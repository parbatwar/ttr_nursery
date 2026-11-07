from django.core.validators import MinValueValidator
from django.db import migrations, models


CATEGORIES = [
    ("indoor", "Indoor"),
    ("outdoor", "Outdoor"),
    ("fruit-herbs", "Fruit & Herbs"),
    ("pots-garden-care", "Pots & Garden Care"),
]
LIGHT_REQUIREMENTS = [
    ("low-light", "Low Light"),
    ("bright-indirect", "Bright Indirect"),
    ("partial-sun", "Partial Sun"),
    ("full-sun", "Full Sun"),
]
OLD_CATEGORY_SLUGS = {
    "indoor-plant": "indoor",
    "indoor-plants": "indoor",
    "outdoor-plant": "outdoor",
    "outdoor-plants": "outdoor",
}
OLD_SUNLIGHT = {
    "low": "low-light",
    "indirect": "bright-indirect",
    "partial": "partial-sun",
    "full": "full-sun",
}
OLD_WATERING = {
    "rare": "every-2-weeks",
    "biweekly": "every-2-weeks",
    "weekly": "weekly",
    "frequent": "every-2-3-days",
}


def copy_existing_catalog(apps, schema_editor):
    db = schema_editor.connection.alias
    Category = apps.get_model("products", "Category")
    LightRequirement = apps.get_model("products", "LightRequirement")
    Product = apps.get_model("products", "Product")

    # Reuse the old Indoor Plant row instead of leaving a duplicate behind.
    Category.objects.using(db).filter(slug="indoor-plant").update(
        name="Indoor",
        slug="indoor",
    )

    categories = {}
    for slug, name in CATEGORIES:
        categories[slug], _ = Category.objects.using(db).update_or_create(
            slug=slug,
            defaults={"name": name},
        )

    lights = {}
    for slug, name in LIGHT_REQUIREMENTS:
        lights[slug], _ = LightRequirement.objects.using(db).get_or_create(
            slug=slug,
            defaults={"name": name},
        )

    for product in Product.objects.using(db).select_related("category").iterator():
        environment_slugs = set(product.environments.values_list("slug", flat=True))
        type_slugs = set(product.plant_types.values_list("slug", flat=True))
        tag_slugs = set(product.tags.values_list("slug", flat=True))

        # Collect first: the duplicate check does not exist yet during this migration.
        new_categories = set(environment_slugs)
        new_lights = set()

        if product.category:
            slug = OLD_CATEGORY_SLUGS.get(product.category.slug, product.category.slug)
            if slug in categories:
                new_categories.add(slug)

        if type_slugs & {"fruit", "herb"}:
            new_categories.add("fruit-herbs")
            product.item_type = "fruit" if "fruit" in type_slugs else "herb"

        if "seasonal" in type_slugs:
            product.lifespan = "seasonal"
        elif "perennial" in type_slugs:
            product.lifespan = "perennial"

        product.is_flowering = bool(type_slugs & {"flowering", "orchid"})

        if "easy-care" in tag_slugs:
            product.care_level = "easy"

        if "low-light" in tag_slugs:
            new_lights.add("low-light")
        if product.sunlight in OLD_SUNLIGHT:
            new_lights.add(OLD_SUNLIGHT[product.sunlight])

        product.categories.add(*[categories[slug] for slug in new_categories])
        product.light_requirements.add(*[lights[slug] for slug in new_lights])

        if "large-giant" in tag_slugs and not product.variants.exists():
            product.size = "large"

        product.watering = OLD_WATERING.get(product.watering, "")
        product.save()


class Migration(migrations.Migration):
    dependencies = [
        ("products", "0007_care_and_shortcut_defaults"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="category",
            options={"ordering": ["id"], "verbose_name_plural": "categories"},
        ),
        migrations.CreateModel(
            name="LightRequirement",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                ("slug", models.SlugField(unique=True)),
            ],
            options={"ordering": ["id"]},
        ),
        migrations.AddField(
            model_name="product",
            name="local_name",
            field=models.CharField(
                blank=True,
                help_text="Local or Nepali name, such as Tulsi. Search also checks this.",
                max_length=255,
            ),
        ),
        migrations.AddField(
            model_name="product",
            name="categories",
            field=models.ManyToManyField(
                blank=True,
                related_name="products",
                to="products.category",
            ),
        ),
        migrations.AddField(
            model_name="product",
            name="item_type",
            field=models.CharField(
                blank=True,
                choices=[
                    ("fruit", "Fruit"),
                    ("herb", "Herbs"),
                    ("pots", "Pots"),
                    ("soil-fertilizer", "Soil & Fertilizer"),
                    ("tools", "Tools"),
                ],
                help_text="Used in Fruit & Herbs and in Pots & Garden Care.",
                max_length=30,
            ),
        ),
        migrations.AddField(
            model_name="product",
            name="original_price",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                help_text="Fill this in only for a sale. It must be higher than the price.",
                max_digits=10,
                null=True,
                validators=[MinValueValidator(0)],
            ),
        ),
        migrations.AddField(
            model_name="product",
            name="care_level",
            field=models.CharField(
                blank=True,
                choices=[
                    ("easy", "Easy"),
                    ("moderate", "Moderate"),
                    ("expert", "Expert"),
                ],
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="product",
            name="light_requirements",
            field=models.ManyToManyField(
                blank=True,
                related_name="products",
                to="products.lightrequirement",
            ),
        ),
        migrations.AddField(
            model_name="product",
            name="lifespan",
            field=models.CharField(
                blank=True,
                choices=[("seasonal", "Seasonal"), ("perennial", "Perennial")],
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="product",
            name="is_flowering",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="product",
            name="size",
            field=models.CharField(
                blank=True,
                choices=[
                    ("small", "Small"),
                    ("medium", "Medium"),
                    ("large", "Large"),
                ],
                help_text="For products without variants. Otherwise set each variant's size.",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="product",
            name="measurement",
            field=models.CharField(
                blank=True,
                help_text="Real size for products without variants, such as About 45 cm tall.",
                max_length=100,
            ),
        ),
        migrations.AddField(
            model_name="product",
            name="comes_in",
            field=models.CharField(
                blank=True,
                choices=[
                    ("nursery-bag", "Nursery bag"),
                    ("plastic-pot", "Plastic pot"),
                    ("decorative-pot", "Decorative pot"),
                ],
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="product",
            name="best_season",
            field=models.CharField(
                blank=True,
                help_text="Optional, such as Spring to early summer.",
                max_length=100,
            ),
        ),
        migrations.AddField(
            model_name="productvariant",
            name="measurement",
            field=models.CharField(
                blank=True,
                help_text="Real size, such as About 45 cm tall.",
                max_length=100,
            ),
        ),
        migrations.AddField(
            model_name="productvariant",
            name="original_price",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                help_text="Fill this in only for a sale. It must be higher than the price.",
                max_digits=10,
                null=True,
                validators=[MinValueValidator(0)],
            ),
        ),
        migrations.AlterField(
            model_name="product",
            name="watering",
            field=models.CharField(
                blank=True,
                choices=[
                    ("daily", "Daily"),
                    ("every-2-3-days", "Every 2–3 days"),
                    ("weekly", "Weekly"),
                    ("every-2-weeks", "Every 2+ weeks"),
                ],
                max_length=20,
            ),
        ),
        migrations.AlterField(
            model_name="product",
            name="low_stock_threshold",
            field=models.PositiveIntegerField(
                default=10,
                help_text="Show remaining quantity only below this level. Set to 0 to disable.",
            ),
        ),
        migrations.AlterField(
            model_name="productvariant",
            name="size",
            field=models.CharField(
                blank=True,
                help_text="Use Small, Medium or Large so the size filter can find it.",
                max_length=60,
            ),
        ),
        migrations.RunPython(copy_existing_catalog, migrations.RunPython.noop),
        migrations.RemoveField(model_name="product", name="category"),
        migrations.RemoveField(model_name="product", name="sunlight"),
        migrations.RemoveField(model_name="product", name="environments"),
        migrations.RemoveField(model_name="product", name="plant_types"),
        migrations.RemoveField(model_name="product", name="tags"),
        migrations.DeleteModel(name="PlantType"),
        migrations.DeleteModel(name="NeedTag"),
        migrations.DeleteModel(name="Environment"),
    ]
