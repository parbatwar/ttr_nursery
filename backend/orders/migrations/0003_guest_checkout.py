import uuid

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models
from django.db.models import Q


def link_existing_orders(apps, schema_editor):
    db = schema_editor.connection.alias
    Customer = apps.get_model("orders", "Customer")
    Order = apps.get_model("orders", "Order")

    for order in Order.objects.using(db).order_by("id"):
        order.access_token = uuid.uuid4()
        customer, _ = Customer.objects.using(db).get_or_create(
            phone=order.phone,
            defaults={"name": order.customer_name, "user_id": order.user_id},
        )
        order.customer = customer
        order.save(update_fields=["access_token", "customer"])


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("orders", "0002_orderitem_variant_orderitem_variant_color_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="Customer",
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
                ("name", models.CharField(blank=True, max_length=255)),
                ("email", models.EmailField(blank=True, max_length=254)),
                ("phone", models.CharField(blank=True, max_length=20)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="customers",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "constraints": [
                    models.UniqueConstraint(
                        condition=~Q(email=""),
                        fields=("email",),
                        name="unique_customer_email",
                    ),
                    models.UniqueConstraint(
                        condition=~Q(phone=""),
                        fields=("phone",),
                        name="unique_customer_phone",
                    ),
                ],
            },
        ),
        migrations.AlterField(
            model_name="order",
            name="user",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="orders",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name="order",
            name="phone",
            field=models.CharField(blank=True, max_length=20),
        ),
        migrations.AddField(
            model_name="order",
            name="email",
            field=models.EmailField(blank=True, max_length=254),
        ),
        migrations.AddField(
            model_name="order",
            name="payment_method",
            field=models.CharField(
                choices=[
                    ("cod", "Cash on delivery"),
                    ("esewa", "eSewa"),
                    ("khalti", "Khalti"),
                ],
                default="cod",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="order",
            name="customer",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="orders",
                to="orders.customer",
            ),
        ),
        migrations.AddField(
            model_name="order",
            name="access_token",
            field=models.UUIDField(editable=False, null=True),
        ),
        migrations.RunPython(link_existing_orders, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="order",
            name="access_token",
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
        ),
    ]
