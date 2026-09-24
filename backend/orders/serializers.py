from rest_framework import serializers

from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "product_name",
            "unit_price",
            "quantity",
            "subtotal",
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "status",
            "customer_name",
            "phone",
            "address",
            "city",
            "subtotal",
            "shipping_charge",
            "total",
            "items",
            "created_at",
            "updated_at",
        ]


class CreateOrderSerializer(serializers.Serializer):
    customer_name = serializers.CharField(max_length=255)
    phone = serializers.CharField(max_length=20)
    address = serializers.CharField()
    city = serializers.ChoiceField(
        choices=[
            ("kathmandu", "Kathmandu"),
            ("lalitpur", "Lalitpur"),
            ("bhaktapur", "Bhaktapur"),
        ]
    )
