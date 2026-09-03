from django.db import models
from django.utils.text import slugify


# Create your models here.
class Category(models.Model):
    """Model representing a category of plants."""

    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Product(models.Model):
    """Model representing a plant product."""

    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)

    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()

    sunlight = models.CharField(
        max_length=50,
        choices=[
            ("low", "Low Light"),
            ("indirect", "Bright Indirect Light"),
            ("partial", "Partial Sun"),
            ("full", "Full Sun"),
        ],
    )
    watering = models.CharField(
        max_length=50,
        choices=[
            ("rare", "Rarely"),
            ("weekly", "Once a Week"),
            ("biweekly", "Every 1–2 Weeks"),
            ("frequent", "Frequently"),
        ],
    )

    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="images",
    )
    image = models.ImageField(upload_to="product_images/")
