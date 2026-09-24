from django.urls import path

from .views import create_order, order_detail, order_list

urlpatterns = [
    path("", create_order, name="create-order"),
    path("history/", order_list, name="order-list"),
    path("<int:order_id>/", order_detail, name="order-detail"),
]
