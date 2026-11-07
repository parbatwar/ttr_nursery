from datetime import timedelta

from django.db.models import Sum
from django.utils import timezone
from rest_framework import serializers

from orders.models import OrderItem

from .models import (
    Category,
    LightRequirement,
    Product,
    ProductImage,
    ProductVariant,
)

NEW_PRODUCT_DAYS = 30
BEST_SELLER_COUNT = 10


def get_best_seller_ids():
    """Return the top-selling products, ignoring cancelled orders."""
    best_sellers = (
        OrderItem.objects.filter(product__isnull=False)
        .exclude(order__status="cancelled")
        .values("product")
        .annotate(total_sold=Sum("quantity"))
        .order_by("-total_sold", "product")[:BEST_SELLER_COUNT]
    )
    return {item["product"] for item in best_sellers}


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class LightRequirementSerializer(serializers.ModelSerializer):
    class Meta:
        model = LightRequirement
        fields = ["id", "name", "slug"]


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image"]


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = [
            "id",
            "size",
            "pot_size",
            "color",
            "price",
            "original_price",
            "stock",
        ]


class ProductSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    light_requirements = LightRequirementSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)

    # Readable names for the saved choices, such as "Every 2–3 days".
    care_level_label = serializers.CharField(source="get_care_level_display", read_only=True)
    watering_label = serializers.CharField(source="get_watering_display", read_only=True)
    lifespan_label = serializers.CharField(source="get_lifespan_display", read_only=True)
    size_label = serializers.CharField(source="get_size_display", read_only=True)
    comes_in_label = serializers.CharField(source="get_comes_in_display", read_only=True)
    item_type_label = serializers.CharField(source="get_item_type_display", read_only=True)

    class Meta:
        model = Product
        fields = "__all__"

    def get_best_seller_ids(self):
        # Work this out once, even when many products are being returned.
        if "best_seller_ids" not in self.context:
            self.context["best_seller_ids"] = get_best_seller_ids()
        return self.context["best_seller_ids"]

    def get_labels(self, product, stock):
        labels = []
        variants = list(product.variants.all())
        price_options = variants or [product]

        is_new = product.created_at >= timezone.now() - timedelta(days=NEW_PRODUCT_DAYS)
        is_on_sale = any(
            option.original_price and option.original_price > option.price
            for option in price_options
        )

        if is_new:
            labels.append("new")
        if product.id in self.get_best_seller_ids():
            labels.append("best_seller")
        if is_on_sale:
            labels.append("sale")
        if stock <= 0:
            labels.append("sold_out")
        elif stock < product.low_stock_threshold:
            labels.append("few_left")

        return labels

    def to_representation(self, instance):
        data = super().to_representation(instance)
        variants = list(instance.variants.all())

        if variants:
            cheapest = min(variants, key=lambda variant: variant.price)
            data["price"] = str(cheapest.price)
            data["original_price"] = (
                str(cheapest.original_price) if cheapest.original_price else None
            )
            data["stock"] = sum(variant.stock for variant in variants)

        data["labels"] = self.get_labels(instance, data["stock"])
        return data
