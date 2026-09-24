from decimal import Decimal

from django.db import transaction
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from carts.models import Cart
from .models import Order, OrderItem
from .serializers import CreateOrderSerializer, OrderSerializer


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_order(request):
    serializer = CreateOrderSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    data = serializer.validated_data

    try:
        cart = Cart.objects.prefetch_related("items__product").get(user=request.user)
    except Cart.DoesNotExist:
        return Response(
            {"detail": "Your cart is empty."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    cart_items = list(cart.items.all())

    if not cart_items:
        return Response(
            {"detail": "Your cart is empty."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    with transaction.atomic():
        product_ids = [item.product_id for item in cart_items]

        from products.models import Product

        products = {
            product.id: product
            for product in Product.objects.select_for_update().filter(
                id__in=product_ids
            )
        }

        subtotal = Decimal("0.00")

        for cart_item in cart_items:
            product = products.get(cart_item.product_id)

            if product is None:
                return Response(
                    {
                        "detail": (
                            f"Product '{cart_item.product.name}' "
                            "is no longer available."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if product.stock < cart_item.quantity:
                return Response(
                    {
                        "detail": (
                            f"Not enough stock for '{product.name}'. "
                            f"Available stock: {product.stock}."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            subtotal += product.price * cart_item.quantity

        shipping_charge = Decimal("0.00")
        total = subtotal + shipping_charge

        order = Order.objects.create(
            user=request.user,
            customer_name=data["customer_name"],
            phone=data["phone"],
            address=data["address"],
            city=data["city"],
            subtotal=subtotal,
            shipping_charge=shipping_charge,
            total=total,
        )

        for cart_item in cart_items:
            product = products[cart_item.product_id]
            item_subtotal = product.price * cart_item.quantity

            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.name,
                unit_price=product.price,
                quantity=cart_item.quantity,
                subtotal=item_subtotal,
            )

            product.stock -= cart_item.quantity
            product.save(update_fields=["stock"])

        cart.items.all().delete()

    return Response(
        OrderSerializer(order).data,
        status=status.HTTP_201_CREATED,
    )


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
