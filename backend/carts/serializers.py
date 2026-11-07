from rest_framework import serializers

from .models import Cart, CartItem
from products.serializers import ProductSerializer, ProductVariantSerializer


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    variant = ProductVariantSerializer(read_only=True)
    unit_price = serializers.SerializerMethodField()

    def get_unit_price(self, obj):
        return str(obj.variant.price if obj.variant_id else obj.product.price)

    class Meta:
        model = CartItem
        fields = ["id", "product", "variant", "unit_price", "quantity"]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    token = serializers.SerializerMethodField()

    def get_token(self, obj):
        # A signed-in customer's cart belongs to their account, not a token.
        return None if obj.user_id else str(obj.token)

    class Meta:
        model = Cart
        fields = ["id", "token", "items", "created_at", "updated_at"]


class AddCartItemSerializer(serializers.Serializer):
    product = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)
    variant = serializers.IntegerField(required=False, allow_null=True)


class UpdateCartItemSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1)
