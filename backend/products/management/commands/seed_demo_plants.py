from django.core.management.base import BaseCommand
from django.db import transaction

from products.models import Category, LightRequirement, Product, ProductVariant


# Fictional products for exercising the storefront, not horticultural advice.
DEMO_PLANTS = [
    {
        "slug": "velvet-leaf",
        "name": "Velvet Leaf",
        "price": 650,
        "stock": 25,
        "categories": ["indoor"],
        "care_level": "easy",
        "lights": ["low-light", "bright-indirect"],
        "watering": "weekly",
        "lifespan": "perennial",
        "size": "small",
        "pot_size": "5 inch pot",
        "comes_in": "plastic-pot",
    },
    {
        "slug": "meadow-bloom",
        "name": "Meadow Bloom",
        "price": 850,
        "stock": 7,
        "categories": ["indoor", "outdoor"],
        "care_level": "easy",
        "lights": ["bright-indirect", "partial-sun"],
        "watering": "every-2-3-days",
        "lifespan": "seasonal",
        "is_flowering": True,
        "comes_in": "nursery-bag",
        "best_season": "Spring to early summer",
        "variants": [
            ("Small", "5 inch pot", "White", 850, 7),
            ("Small", "5 inch pot", "Orange", 900, 20),
            ("Medium", "7 inch pot", "White", 1200, 4),
        ],
    },
    {
        "slug": "desert-rosette",
        "name": "Desert Rosette",
        "price": 450,
        "stock": 18,
        "categories": ["indoor", "outdoor"],
        "care_level": "easy",
        "lights": ["partial-sun", "full-sun"],
        "watering": "every-2-weeks",
        "lifespan": "perennial",
        "comes_in": "plastic-pot",
        "variants": [
            ("Small", "4 inch pot", "", 450, 18),
            ("Medium", "6 inch pot", "", 700, 6),
            ("Large", "9 inch pot", "", 1100, 0),
        ],
    },
    {
        "slug": "balcony-berry",
        "name": "Balcony Berry",
        "price": 1400,
        "stock": 12,
        "categories": ["outdoor", "fruit-herbs"],
        "item_type": "fruit",
        "care_level": "moderate",
        "lights": ["full-sun"],
        "watering": "every-2-3-days",
        "lifespan": "perennial",
        "size": "medium",
        "pot_size": "10 inch pot",
        "comes_in": "nursery-bag",
    },
    {
        "slug": "kitchen-sprig",
        "name": "Kitchen Sprig",
        "price": 350,
        "stock": 6,
        "categories": ["fruit-herbs"],
        "item_type": "herb",
        "care_level": "easy",
        "lights": ["bright-indirect", "partial-sun"],
        "watering": "every-2-3-days",
        "lifespan": "seasonal",
        "size": "small",
        "pot_size": "4 inch pot",
        "comes_in": "plastic-pot",
    },
    {
        "slug": "canopy-green",
        "name": "Canopy Green",
        "price": 2400,
        "stock": 3,
        "categories": ["indoor"],
        "care_level": "moderate",
        "lights": ["bright-indirect"],
        "watering": "weekly",
        "lifespan": "perennial",
        "comes_in": "decorative-pot",
        "variants": [
            ("Medium", "12 inch pot", "", 2400, 3),
            ("Large", "16 inch pot", "", 3800, 2),
        ],
    },
    {
        "slug": "cloud-orchid",
        "name": "Cloud Orchid",
        "price": 1800,
        "stock": 15,
        "categories": ["indoor"],
        "care_level": "expert",
        "lights": ["bright-indirect"],
        "watering": "weekly",
        "lifespan": "perennial",
        "is_flowering": True,
        "comes_in": "plastic-pot",
        "variants": [
            ("", "", "White", 1800, 15),
            ("", "", "Purple", 1950, 5),
        ],
    },
    {
        "slug": "patio-petals",
        "name": "Patio Petals",
        "price": 700,
        "stock": 0,
        "categories": ["outdoor"],
        "care_level": "easy",
        "lights": ["full-sun"],
        "watering": "every-2-3-days",
        "lifespan": "seasonal",
        "is_flowering": True,
        "size": "small",
        "pot_size": "5 inch pot",
        "comes_in": "nursery-bag",
        "best_season": "Spring to autumn",
    },
    {
        "slug": "desk-garden",
        "name": "Desk Garden",
        "price": 950,
        "stock": 30,
        "categories": ["indoor"],
        "care_level": "easy",
        "lights": ["low-light", "bright-indirect"],
        "watering": "weekly",
        "lifespan": "perennial",
        "comes_in": "decorative-pot",
        "variants": [
            ("Small", "4 inch pot", "White", 950, 20),
            ("Small", "4 inch pot", "Purple", 1000, 10),
            ("Medium", "5 inch pot", "White", 1300, 7),
            ("Medium", "5 inch pot", "Purple", 1350, 0),
        ],
    },
    {
        "slug": "terracotta-pot",
        "name": "Terracotta Pot",
        "price": 400,
        "stock": 20,
        "categories": ["pots-garden-care"],
        "item_type": "pots",
        "size": "medium",
        "pot_size": "8 inch pot",
    },
]

PLANT_DETAIL_FIELDS = [
    "item_type",
    "care_level",
    "watering",
    "lifespan",
    "is_flowering",
    "size",
    "pot_size",
    "comes_in",
    "best_season",
]


class Command(BaseCommand):
    help = "Add ten clearly labeled fictional demo products; existing entries are left unchanged."

    @transaction.atomic
    def handle(self, *args, **options):
        created_count = 0

        for plant in DEMO_PLANTS:
            details = {
                field: plant[field]
                for field in PLANT_DETAIL_FIELDS
                if field in plant
            }
            product, created = Product.objects.get_or_create(
                slug=f"demo-{plant['slug']}",
                defaults={
                    "name": f"Demo — {plant['name']}",
                    "price": plant["price"],
                    "stock": plant["stock"],
                    "description": (
                        f"Fictional demo product: {plant['name']}. "
                        "Sample details and pricing are illustrative only. "
                        "Replace with verified product information before offering this for sale."
                    ),
                    **details,
                },
            )
            if not created:
                continue

            product.categories.set(Category.objects.filter(slug__in=plant["categories"]))
            product.light_requirements.set(
                LightRequirement.objects.filter(slug__in=plant.get("lights", []))
            )
            ProductVariant.objects.bulk_create(
                [
                    ProductVariant(
                        product=product,
                        size=size,
                        pot_size=pot_size,
                        color=color,
                        price=price,
                        stock=stock,
                    )
                    for size, pot_size, color, price, stock in plant.get("variants", [])
                ]
            )
            created_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Created {created_count} demo products. Existing products were not changed."
            )
        )
