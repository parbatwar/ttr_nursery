from decimal import Decimal

from django.db import transaction
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

from carts.models import Cart
from carts.views import find_cart
from products.models import Product, ProductVariant

from .models import Customer, Order, OrderItem
from .serializers import CreateOrderSerializer, OrderSerializer


class GuestCheckoutThrottle(AnonRateThrottle):
    """Limits fake orders, since anyone can check out without an account."""

    rate = "30/hour"


def get_or_create_customer(data, user):
    """Find the buyer by email, then phone, or create a new customer record."""
    email = data["email"]
    phone = data["phone"]

    customer = Customer.objects.filter(email=email).first()
    if customer is None:
        customer = Customer.objects.filter(phone=phone).first()

    if customer is None:
        return Customer.objects.create(
            user=user,
            name=data["customer_name"],
            email=email,
            phone=phone,
        )

    # Contact details aren't verified, so only fill gaps and never overwrite.
    if not customer.name:
        customer.name = data["customer_name"]
    if not customer.email and not Customer.objects.filter(email=email).exists():
        customer.email = email
    if not customer.phone and not Customer.objects.filter(phone=phone).exists():
        customer.phone = phone
    if not customer.user and user:
        customer.user = user
    customer.save()

    return customer


@api_view(["POST"])
@throttle_classes([GuestCheckoutThrottle])
@transaction.atomic
def create_order(request):
    serializer = CreateOrderSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    data = serializer.validated_data
    empty_cart_response = Response(
        {"detail": "Your cart is empty."},
        status=status.HTTP_400_BAD_REQUEST,
    )

    found_cart = find_cart(request)
    if found_cart is None:
        return empty_cart_response

    cart = Cart.objects.select_for_update().get(pk=found_cart.pk)
    cart_items = list(cart.items.select_related("product"))

    if not cart_items:
        return empty_cart_response

    product_ids = [item.product_id for item in cart_items]
    products = {
        product.id: product
        for product in Product.objects.select_for_update()
        .filter(id__in=product_ids)
        .order_by("id")
    }
    variants = {
        variant.id: variant
        for variant in ProductVariant.objects.select_for_update()
        .filter(product_id__in=product_ids)
        .order_by("id")
    }
    products_with_variants = {variant.product_id for variant in variants.values()}
    selections = {}
    quantities = {}
    subtotal = Decimal("0.00")

    for cart_item in cart_items:
        product = products.get(cart_item.product_id)

        if product is None:
            return Response(
                {"detail": f"Product '{cart_item.product.name}' is no longer available."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        inventory = variants.get(cart_item.variant_id) if cart_item.variant_id else product

        if (
            inventory is None
            or (cart_item.variant_id and inventory.product_id != product.id)
            or (not cart_item.variant_id and product.id in products_with_variants)
        ):
            return Response(
                {"detail": f"Please choose an available option for '{product.name}' again."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        key = (product.id, cart_item.variant_id)
        quantities[key] = quantities.get(key, 0) + cart_item.quantity

        if inventory.stock < quantities[key]:
            return Response(
                {
                    "detail": (
                        f"Not enough stock for '{product.name}'. "
                        f"Available stock: {inventory.stock}."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        selections[cart_item.id] = inventory
        subtotal += inventory.price * cart_item.quantity

    user = request.user if request.user.is_authenticated else None
    shipping_charge = Decimal("0.00")

    order = Order.objects.create(
        user=user,
        customer=get_or_create_customer(data, user),
        payment_method=data["payment_method"],
        customer_name=data["customer_name"],
        email=data["email"],
        phone=data["phone"],
        address=data["address"],
        city=data["city"],
        note=data.get("note", ""),
        subtotal=subtotal,
        shipping_charge=shipping_charge,
        total=subtotal + shipping_charge,
    )

    for cart_item in cart_items:
        product = products[cart_item.product_id]
        inventory = selections[cart_item.id]

        OrderItem.objects.create(
            order=order,
            product=product,
            product_name=product.name,
            variant=inventory if cart_item.variant_id else None,
            variant_size=inventory.size if cart_item.variant_id else "",
            variant_color=inventory.color if cart_item.variant_id else "",
            unit_price=inventory.price,
            quantity=cart_item.quantity,
            subtotal=inventory.price * cart_item.quantity,
        )

        inventory.stock -= cart_item.quantity
        inventory.save(update_fields=["stock"])

    cart.items.all().delete()

    return Response(
        OrderSerializer(order).data,
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET"])
def order_status(request, access_token):
    """The order page guests reach through their private link."""
    try:
        order = Order.objects.prefetch_related("items").get(access_token=access_token)
    except Order.DoesNotExist:
        return Response(
            {"detail": "Order not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    return Response(OrderSerializer(order).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def order_list(request):
    orders = (
        Order.objects.filter(user=request.user)
        .prefetch_related("items")
        .order_by("-created_at")
    )

    serializer = OrderSerializer(orders, many=True)

    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def order_detail(request, order_id):
    try:
        order = Order.objects.prefetch_related("items").get(
            id=order_id,
            user=request.user,
        )
    except Order.DoesNotExist:
        return Response(
            {"detail": "Order not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    serializer = OrderSerializer(order)

    return Response(serializer.data)
