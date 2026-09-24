from django.contrib import admin

from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "order",
        "provider",
        "amount",
        "status",
        "transaction_id",
        "created_at",
    ]

    list_filter = [
        "provider",
        "status",
        "created_at",
    ]

    search_fields = [
        "transaction_id",
        "provider_reference",
        "order__id",
        "order__user__username",
    ]
