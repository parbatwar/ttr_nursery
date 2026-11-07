from django import forms
from django.contrib import admin
from django.db import models

from .models import Product, ProductImage, ProductVariant


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 0


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 0


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "local_name", "starting_price", "available_stock"]
    search_fields = ["name", "local_name"]
    list_filter = ["categories", "care_level", "light_requirements", "lifespan"]
    prepopulated_fields = {"slug": ("name",)}
    formfield_overrides = {
        models.ManyToManyField: {"widget": forms.CheckboxSelectMultiple},
    }
    fieldsets = [
        (
            "Product",
            {
                "fields": [
                    "name",
                    "local_name",
                    "slug",
                    "description",
                    "categories",
                    "item_type",
                ],
            },
        ),
        (
            "Price and stock",
            {
                "fields": [
                    "price",
                    "original_price",
                    "stock",
                    "low_stock_threshold",
                ],
            },
        ),
        (
            "Plant details",
            {
                "description": "Leave these blank for pots, soil, fertilizer and tools.",
                "fields": [
                    "care_level",
                    "light_requirements",
                    "watering",
                    "lifespan",
                    "is_flowering",
                    "best_season",
                ],
            },
        ),
        (
            "Size and supply",
            {
                "fields": [
                    "size",
                    "pot_size",
                    "comes_in",
                ],
            },
        ),
    ]
    inlines = [ProductImageInline, ProductVariantInline]

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related("variants")

    @admin.display(description="Price from")
    def starting_price(self, obj):
        variants = list(obj.variants.all())
        return min(item.price for item in variants) if variants else obj.price

    @admin.display(description="Available stock")
    def available_stock(self, obj):
        variants = list(obj.variants.all())
        return sum(item.stock for item in variants) if variants else obj.stock

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        form.base_fields["price"].help_text = (
            "Base price for products without variants. "
            "Otherwise each variant supplies its own price."
        )
        form.base_fields["stock"].help_text = (
            "Base stock for products without variants. "
            "Otherwise each variant supplies its own inventory."
        )
        return form


admin.site.register(ProductImage)
