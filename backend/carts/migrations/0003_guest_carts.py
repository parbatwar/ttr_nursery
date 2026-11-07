import uuid

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


def give_existing_carts_a_token(apps, schema_editor):
    Cart = apps.get_model("carts", "Cart")
    for cart in Cart.objects.using(schema_editor.connection.alias).all():
        cart.token = uuid.uuid4()
        cart.save(update_fields=["token"])


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("carts", "0002_cartitem_variant"),
    ]

    operations = [
        migrations.AlterField(
            model_name="cart",
            name="user",
            field=models.OneToOneField(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="cart",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="cart",
            name="token",
            field=models.UUIDField(editable=False, null=True),
        ),
        migrations.RunPython(give_existing_carts_a_token, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="cart",
            name="token",
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
        ),
    ]
