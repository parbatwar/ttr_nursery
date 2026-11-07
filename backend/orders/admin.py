from django.contrib import admin

from .models import Customer, Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = [
        "product",
        "product_name",
        "unit_price",
        "quantity",
        "subtotal",
    ]


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "email",
        "phone",
        "created_at",
    ]

    search_fields = [
        "name",
        "email",
        "phone",
    ]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "customer_name",
        "phone",
        "email",
        "status",
        "payment_method",
        "total",
        "created_at",
    ]

    list_filter = [
        "status",
        "payment_method",
        "created_at",
    ]

    search_fields = [
        "customer_name",
        "email",
        "phone",
    ]

    inlines = [OrderItemInline]


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = [
        "order",
        "product_name",
        "quantity",
        "unit_price",
        "subtotal",
    ]

    search_fields = [
        "product_name",
    ]
