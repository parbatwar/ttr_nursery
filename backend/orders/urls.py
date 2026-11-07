from django.urls import path

from .views import create_order, order_detail, order_list, order_status

urlpatterns = [
    path("", create_order, name="create-order"),
    path("history/", order_list, name="order-list"),
    path("track/<uuid:access_token>/", order_status, name="order-status"),
    path("<int:order_id>/", order_detail, name="order-detail"),
]
