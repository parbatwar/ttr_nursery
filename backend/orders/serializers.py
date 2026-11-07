import re

from rest_framework import serializers

from .models import Order, OrderItem

PHONE_PATTERN = re.compile(r"^\+?\d{7,15}$")


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "product_name",
            "variant",
            "variant_size",
            "variant_color",
            "unit_price",
            "quantity",
            "subtotal",
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    payment_method_label = serializers.CharField(
        source="get_payment_method_display",
        read_only=True,
    )
    status_label = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "access_token",
            "status",
            "status_label",
            "payment_method",
            "payment_method_label",
            "customer_name",
            "email",
            "phone",
            "address",
            "city",
            "note",
            "subtotal",
            "shipping_charge",
            "total",
            "items",
            "created_at",
            "updated_at",
        ]


class CreateOrderSerializer(serializers.Serializer):
    customer_name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    address = serializers.CharField()
    city = serializers.ChoiceField(
        choices=[
            ("kathmandu", "Kathmandu"),
            ("lalitpur", "Lalitpur"),
            ("bhaktapur", "Bhaktapur"),
        ]
    )
    note = serializers.CharField(required=False, allow_blank=True, max_length=1000)
    # Online payment is not connected yet, so only cash on delivery is accepted.
    payment_method = serializers.ChoiceField(choices=["cod"], default="cod")

    def validate_email(self, value):
        return value.strip().lower()

    def validate_phone(self, value):
        phone = re.sub(r"[\s-]", "", value)

        if not PHONE_PATTERN.match(phone):
            raise serializers.ValidationError("Enter a valid phone number.")

        return phone
