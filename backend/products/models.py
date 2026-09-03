from django.db import models


# Create your models here.
class Category(models.Model):
    """Model representing a category of plants."""

    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    """Model representing a plant product."""

    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)

    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()

    sunlight = models.CharField(max_length=255)
    watering = models.CharField(max_length=255)
    difficulty = models.CharField(max_length=255)

    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    """Model representing an image of a plant product."""

    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to="product_images/")
