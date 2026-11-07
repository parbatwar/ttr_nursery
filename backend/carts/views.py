from uuid import UUID

from django.db import transaction
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from products.models import Product, ProductVariant

from .models import Cart, CartItem
from .serializers import AddCartItemSerializer, CartSerializer, UpdateCartItemSerializer

CART_TOKEN_HEADER = "HTTP_X_CART_TOKEN"


def get_guest_cart(request):
    """Find the guest cart named by the X-Cart-Token header, if there is one."""
    try:
        token = UUID(request.META.get(CART_TOKEN_HEADER, ""))
    except ValueError:
        return None

    # Account carts can never be opened with a token.
    return Cart.objects.filter(token=token, user__isnull=True).first()


def move_guest_items_to_cart(guest_cart, cart):
    """Keep what someone added as a guest when they sign in."""
    for guest_item in guest_cart.items.select_related("product", "variant"):
        inventory = guest_item.variant or guest_item.product
        item, _ = CartItem.objects.get_or_create(
            cart=cart,
            product=guest_item.product,
            variant=guest_item.variant,
            defaults={"quantity": 0},
        )
        item.quantity = min(item.quantity + guest_item.quantity, inventory.stock)

        if item.quantity > 0:
            item.save()
        else:
            item.delete()

    guest_cart.delete()


def find_cart(request, create=False):
    """Return the cart for this visitor, whether signed in or a guest."""
    guest_cart = get_guest_cart(request)

    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
        if guest_cart:
            move_guest_items_to_cart(guest_cart, cart)
        return cart

    if guest_cart or not create:
        return guest_cart

    return Cart.objects.create()


@api_view(["GET"])
@transaction.atomic
def cart_detail(request):
    cart = find_cart(request)

    if cart is None:
        return Response({"id": None, "token": None, "items": []})

    return Response(CartSerializer(cart).data)


@api_view(["POST"])
@transaction.atomic
def add_cart_item(request):
    serializer = AddCartItemSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    product_id = serializer.validated_data["product"]
    quantity = serializer.validated_data["quantity"]
    variant_id = serializer.validated_data.get("variant")

    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response(
            {"detail": "Product not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    variant = None
    if variant_id is not None:
        variant = ProductVariant.objects.filter(id=variant_id, product=product).first()
        if variant is None:
            return Response(
                {"detail": "Select a valid option for this plant."},
                status=status.HTTP_400_BAD_REQUEST,
            )
    elif product.variants.exists():
        return Response(
            {"detail": "Please choose a size or color option."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    inventory = variant if variant else product
    cart = find_cart(request, create=True)
    cart = Cart.objects.select_for_update().get(pk=cart.pk)
    existing = CartItem.objects.filter(cart=cart, product=product, variant=variant).first()

    if (existing.quantity if existing else 0) + quantity > inventory.stock:
        return Response(
            {"detail": "The requested quantity is no longer available."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product,
        variant=variant,
        defaults={"quantity": quantity},
    )

    if not created:
        cart_item.quantity += quantity
        cart_item.save()

    return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)


def find_cart_item(request, item_id):
    cart = find_cart(request)

    if cart is None:
        return None

    Cart.objects.select_for_update().get(pk=cart.pk)
    return CartItem.objects.filter(id=item_id, cart=cart).first()


@api_view(["PATCH"])
@transaction.atomic
def update_cart_item(request, item_id):
    serializer = UpdateCartItemSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    cart_item = find_cart_item(request, item_id)

    if cart_item is None:
        return Response(
            {"detail": "Item not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    inventory = cart_item.variant if cart_item.variant_id else cart_item.product

    if not cart_item.variant_id and cart_item.product.variants.exists():
        return Response(
            {"detail": "Remove this item and choose its size or color again."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if serializer.validated_data["quantity"] > inventory.stock:
        return Response(
            {"detail": "The requested quantity is no longer available."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    cart_item.quantity = serializer.validated_data["quantity"]
    cart_item.save()

    return Response(CartSerializer(cart_item.cart).data)


@api_view(["DELETE"])
@transaction.atomic
def remove_cart_item(request, item_id):
    cart_item = find_cart_item(request, item_id)

    if cart_item is None:
        return Response(
            {"detail": "Item not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    cart = cart_item.cart
    cart_item.delete()

    return Response(CartSerializer(cart).data)
