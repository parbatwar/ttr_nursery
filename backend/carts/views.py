from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Cart, CartItem
from .serializers import CartSerializer, AddCartItemSerializer, UpdateCartItemSerializer
from products.models import Product


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def cart_detail(request):
    cart, created = Cart.objects.get_or_create(user=request.user)
    serializer = CartSerializer(cart)

    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_cart_item(request):
    serializer = AddCartItemSerializer(data=request.data)

    if not serializer.is_valid():
        return (Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST),)

    product_id = serializer.validated_data["product"]
    quantity = serializer.validated_data["quantity"]

    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response(
            {"detail": "Product not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    cart, created = Cart.objects.get_or_create(user=request.user)

    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product,
        defaults={"quantity": quantity},
    )

    if not created:
        cart_item.quantity += quantity
        cart_item.save()

    return Response(
        {"detail": "Item added to cart."},
        status=status.HTTP_200_OK,
    )


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_cart_item(request, item_id):
    serializer = UpdateCartItemSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    try:
        cart_item = CartItem.objects.get(id=item_id, cart__user=request.user)
    except CartItem.DoesNotExist:
        return Response(
            {"detail": "Item not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    cart_item.quantity = serializer.validated_data["quantity"]
    cart_item.save()

    return Response(CartSerializer(cart_item.cart).data)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def remove_cart_item(request, item_id):
    try:
        cart_item = CartItem.objects.get(id=item_id, cart__user=request.user)
    except CartItem.DoesNotExist:
        return Response(
            {"detail": "Item not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    cart = cart_item.cart
    cart_item.delete()

    return Response(CartSerializer(cart).data)
