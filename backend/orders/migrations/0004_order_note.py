from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("orders", "0003_guest_checkout"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="note",
            field=models.TextField(blank=True),
        ),
    ]
