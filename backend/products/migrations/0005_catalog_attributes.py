from django.db import migrations, models


def seed_catalog(apps, schema_editor):
    db = schema_editor.connection.alias
    groups = {
        "Environment": [("indoor", "Indoor Plants"), ("outdoor", "Outdoor Plants")],
        "PlantType": [("succulent", "Succulents"), ("flowering", "Flowering"),
                      ("fruit", "Fruit"), ("herb", "Herbs"), ("perennial", "Perennials"),
                      ("seasonal", "Seasonal"), ("orchid", "Orchids")],
        "NeedTag": [("easy-care", "Easy Care"), ("low-light", "Low Light"),
                    ("pet-friendly", "Pet Friendly"), ("air-purifying", "Air Purifying"),
                    ("office-friendly", "Office Friendly"), ("fast-growing", "Fast Growing"),
                    ("large-giant", "Large / Giant")],
    }
    records = {}
    for model_name, values in groups.items():
        model = apps.get_model("products", model_name)
        for slug, name in values:
            records[slug], _ = model.objects.using(db).get_or_create(slug=slug, defaults={"name": name})

    # Copy only known, explicit legacy classifications. Do not infer suitability.
    aliases = {"indoor-plant": "indoor", "indoor-plants": "indoor",
               "outdoor-plant": "outdoor", "outdoor-plants": "outdoor",
               "succulents": "succulent", "flowering-plants": "flowering",
               "fruit-plants": "fruit", "herbs": "herb", "perennials": "perennial",
               "seasonal-plants": "seasonal", "orchids": "orchid"}
    Product = apps.get_model("products", "Product")
    for product in Product.objects.using(db).select_related("category").iterator():
        if product.category_id:
            slug = aliases.get(product.category.slug, product.category.slug)
            if slug in records:
                relation = "environments" if slug in ("indoor", "outdoor") else "plant_types" if slug in dict(groups["PlantType"]) else "tags"
                getattr(product, relation).add(records[slug])


class Migration(migrations.Migration):
    dependencies = [("products", "0004_alter_product_slug")]
    operations = [
        migrations.CreateModel(
            name=name,
            fields=[("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                    ("name", models.CharField(max_length=100)), ("slug", models.SlugField(unique=True))],
            options={"ordering": ["id"], "abstract": False},
        ) for name in ("Environment", "PlantType", "NeedTag")
    ] + [
        migrations.AddField(model_name="product", name=name,
                            field=models.ManyToManyField(blank=True, related_name="products", to=f"products.{model}"))
        for name, model in [("environments", "environment"), ("plant_types", "planttype"), ("tags", "needtag")]
    ] + [migrations.RunPython(seed_catalog, migrations.RunPython.noop)]
