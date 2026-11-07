from django.db import migrations


def populate(apps, schema_editor):
    db = schema_editor.connection.alias
    Environment = apps.get_model("products", "Environment")
    PlantType = apps.get_model("products", "PlantType")
    NeedTag = apps.get_model("products", "NeedTag")
    PlantCare = apps.get_model("products", "PlantCare")
    Product = apps.get_model("products", "Product")
    for slug, environment_slugs, label in [
        ("low-light", ["indoor"], ""), ("easy-care", ["indoor", "outdoor"], ""),
        ("pet-friendly", ["indoor"], ""), ("air-purifying", ["indoor"], ""),
        ("office-friendly", ["indoor"], "Office Plants"), ("large-giant", ["indoor"], "Large Indoor Plants"),
    ]:
        tag = NeedTag.objects.using(db).filter(slug=slug).first()
        if tag:
            tag.shopping_label = label
            tag.save(using=db, update_fields=["shopping_label"])
            tag.shopping_environments.set(Environment.objects.using(db).filter(slug__in=environment_slugs))
    for slug, label in [("flowering", ""), ("fruit", "Fruit Plants"), ("herb", ""), ("perennial", ""), ("seasonal", "Seasonal Plants")]:
        plant_type = PlantType.objects.using(db).filter(slug=slug).first()
        if plant_type:
            plant_type.shopping_label = label
            plant_type.save(using=db, update_fields=["shopping_label"])
            plant_type.shopping_environments.set(Environment.objects.using(db).filter(slug="outdoor"))

    # Preserve recorded requirements; do not invent humidity or pet-safety claims.
    sunlight = {"low": "Low light.", "indirect": "Bright indirect light.", "partial": "Partial sun.", "full": "Full sun."}
    watering = {"rare": "Water rarely.", "weekly": "Water once a week.", "biweekly": "Water every 1–2 weeks.", "frequent": "Water frequently."}
    for product in Product.objects.using(db).all().iterator():
        PlantCare.objects.using(db).get_or_create(product_id=product.id, defaults={
            "sunlight": sunlight.get(product.sunlight, ""), "watering": watering.get(product.watering, ""),
        })


class Migration(migrations.Migration):
    dependencies = [("products", "0006_needtag_shopping_environments_needtag_shopping_label_and_more")]
    operations = [migrations.RunPython(populate, migrations.RunPython.noop)]
