from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models
from django.utils.text import slugify


# Create your models here.
class Category(models.Model):
    """Main shop category, such as Indoor or Pots & Garden Care."""

    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)

    class Meta:
        ordering = ["id"]
        verbose_name_plural = "categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class LightRequirement(models.Model):
    """A light level. One plant can suit more than one."""

    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return self.name


class Product(models.Model):
    """A plant or garden supply sold in the shop."""

    CARE_LEVEL_CHOICES = [
        ("easy", "Easy"),
        ("moderate", "Moderate"),
        ("expert", "Expert"),
    ]
    WATERING_CHOICES = [
        ("daily", "Daily"),
        ("every-2-3-days", "Every 2–3 days"),
        ("weekly", "Weekly"),
        ("every-2-weeks", "Every 2+ weeks"),
    ]
    LIFESPAN_CHOICES = [
        ("seasonal", "Seasonal"),
        ("perennial", "Perennial"),
    ]
    SIZE_CHOICES = [
        ("small", "Small"),
        ("medium", "Medium"),
        ("large", "Large"),
    ]
    COMES_IN_CHOICES = [
        ("nursery-bag", "Nursery bag"),
        ("plastic-pot", "Plastic pot"),
        ("decorative-pot", "Decorative pot"),
    ]
    ITEM_TYPE_CHOICES = [
        ("fruit", "Fruit"),
        ("herb", "Herbs"),
        ("pots", "Pots"),
        ("soil-fertilizer", "Soil & Fertilizer"),
        ("tools", "Tools"),
    ]

    name = models.CharField(max_length=255)
    local_name = models.CharField(
        max_length=255,
        blank=True,
        help_text="Local or Nepali name, such as Tulsi. Search also checks this.",
    )
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField(blank=True)

    categories = models.ManyToManyField(
        Category,
        blank=True,
        related_name="products",
    )
    item_type = models.CharField(
        max_length=30,
        blank=True,
        choices=ITEM_TYPE_CHOICES,
        help_text="Used in Fruit & Herbs and in Pots & Garden Care.",
    )

    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
        help_text="Fill this in only for a sale. It must be higher than the price.",
    )
    stock = models.IntegerField()
    low_stock_threshold = models.PositiveIntegerField(
        default=10,
        help_text="Show remaining quantity only below this level. Set to 0 to disable.",
    )

    care_level = models.CharField(
        max_length=20,
        blank=True,
        choices=CARE_LEVEL_CHOICES,
    )
    light_requirements = models.ManyToManyField(
        LightRequirement,
        blank=True,
        related_name="products",
    )
    watering = models.CharField(
        max_length=20,
        blank=True,
        choices=WATERING_CHOICES,
    )
    lifespan = models.CharField(
        max_length=20,
        blank=True,
        choices=LIFESPAN_CHOICES,
    )
    is_flowering = models.BooleanField(default=False)

    size = models.CharField(
        max_length=20,
        blank=True,
        choices=SIZE_CHOICES,
        help_text="For products without variants. Otherwise set each variant's size.",
    )
    pot_size = models.CharField(
        max_length=100,
        blank=True,
        help_text="For products without variants, such as 6 inch pot.",
    )
    comes_in = models.CharField(
        max_length=20,
        blank=True,
        choices=COMES_IN_CHOICES,
    )
    best_season = models.CharField(
        max_length=100,
        blank=True,
        help_text="Optional, such as Spring to early summer.",
    )

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


class ProductVariant(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="variants",
    )
    size = models.CharField(
        max_length=60,
        blank=True,
        help_text="Use Small, Medium or Large so the size filter can find it.",
    )
    pot_size = models.CharField(
        max_length=100,
        blank=True,
        help_text="Such as 6 inch pot.",
    )
    color = models.CharField(max_length=60, blank=True)
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
    )
    original_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
        help_text="Fill this in only for a sale. It must be higher than the price.",
    )
    stock = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["id"]
        constraints = [
            models.UniqueConstraint(
                fields=["product", "size", "color"],
                name="unique_product_variant",
            ),
            models.CheckConstraint(
                condition=~models.Q(size="", color=""),
                name="variant_has_option",
            ),
            models.CheckConstraint(
                condition=models.Q(price__gte=0),
                name="variant_nonnegative_price",
            ),
        ]

    def clean(self):
        self.size = self.size.strip()
        self.color = self.color.strip()
        if not self.size and not self.color:
            raise ValidationError("A variant needs a size or color.")

    def __str__(self):
        options = " / ".join(filter(None, [self.size, self.color]))
        return f"{self.product.name} — {options}"
