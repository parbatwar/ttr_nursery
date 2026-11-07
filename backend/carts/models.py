import uuid

from django.contrib.auth.models import User
from django.db import models

from products.models import Product, ProductVariant

# Create your models here.


class Cart(models.Model):
    """A shopping cart. Guests have no user and are found by their token."""

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="cart",
        null=True,
        blank=True,
    )
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        if self.user:
            return f"{self.user.username}'s Cart"
        return f"Guest cart #{self.pk}"


class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name="items",
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
    )

    quantity = models.PositiveIntegerField(default=1)
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"
