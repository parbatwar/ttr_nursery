from django.urls import path

from .views import create_payment, payment_detail

urlpatterns = [
    path("", create_payment, name="create-payment"),
    path("<int:payment_id>/", payment_detail, name="payment-detail"),
]
