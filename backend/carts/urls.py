from django.urls import path

from .views import add_cart_item, cart_detail, remove_cart_item, update_cart_item

urlpatterns = [
    path("", cart_detail),
    path("items/", add_cart_item),
    path("items/<int:item_id>/", update_cart_item),
    path("items/<int:item_id>/remove/", remove_cart_item),
]
