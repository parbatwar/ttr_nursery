from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("products", "0008_simplify_catalog"),
    ]

    operations = [
        migrations.DeleteModel(name="PlantCare"),
        migrations.RenameField(
            model_name="product",
            old_name="measurement",
            new_name="pot_size",
        ),
        migrations.RenameField(
            model_name="productvariant",
            old_name="measurement",
            new_name="pot_size",
        ),
        migrations.AlterField(
            model_name="product",
            name="pot_size",
            field=models.CharField(
                blank=True,
                help_text="For products without variants, such as 6 inch pot.",
                max_length=100,
            ),
        ),
        migrations.AlterField(
            model_name="productvariant",
            name="pot_size",
            field=models.CharField(
                blank=True,
                help_text="Such as 6 inch pot.",
                max_length=100,
            ),
        ),
    ]
