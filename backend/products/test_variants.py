from io import StringIO
from django.contrib.auth.models import User
from django.core.management import call_command
from django.test import TestCase
from rest_framework.test import APIClient

from carts.models import Cart, CartItem
from orders.models import Order
from .models import Product, ProductVariant


class ProductOptionsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="buyer", password="test-password")
        self.client.force_authenticate(self.user)
        self.product = Product.objects.create(name="Options", price=100, stock=50)
        self.small = ProductVariant.objects.create(product=self.product, size="Small", color="White", price=150, stock=7)
        self.large = ProductVariant.objects.create(product=self.product, size="Large", color="Purple", price=300, stock=20)
        self.simple = Product.objects.create(name="Simple", price=75, stock=12)
        self.address = {"customer_name": "Buyer", "email": "buyer@example.test", "phone": "9800000000", "address": "Test address", "city": "kathmandu"}

    def add(self, product, quantity=1, variant=None):
        return self.client.post("/api/cart/items/", {"product": product.id, "quantity": quantity, "variant": variant}, format="json")

    def test_product_representation_and_catalog_price_use_variants(self):
        data = self.client.get(f"/api/products/{self.product.slug}/").data
        self.assertEqual(data["price"], "150.00")
        self.assertEqual(data["stock"], 27)
        self.assertEqual(len(data["variants"]), 2)
        data = self.client.get("/api/products/", {"max_price": 120}).data
        self.assertEqual([row["id"] for row in data["results"]], [self.simple.id])
        self.assertEqual(self.client.get(f"/api/products/{self.simple.slug}/").data["variants"], [])

    def test_variant_required_and_must_belong_to_product(self):
        self.assertEqual(self.add(self.product).status_code, 400)
        self.assertEqual(self.add(self.simple, variant=self.small.id).status_code, 400)
        self.assertEqual(self.add(self.product, variant=999999).status_code, 400)
        self.assertEqual(self.add(self.simple, quantity=0).status_code, 400)

    def test_cart_separates_variants_and_uses_variant_price(self):
        self.assertEqual(self.add(self.product, variant=self.small.id).status_code, 200)
        self.assertEqual(self.add(self.product, variant=self.large.id).status_code, 200)
        self.add(self.product, variant=self.small.id)
        items = self.client.get("/api/cart/").data["items"]
        self.assertEqual(len(items), 2)
        small = next(item for item in items if item["variant"]["id"] == self.small.id)
        self.assertEqual(small["quantity"], 2)
        self.assertEqual(small["unit_price"], "150.00")

    def test_cart_stock_limits_include_existing_quantity(self):
        self.assertEqual(self.add(self.product, quantity=7, variant=self.small.id).status_code, 200)
        self.assertEqual(self.add(self.product, variant=self.small.id).status_code, 400)
        item = CartItem.objects.get(cart__user=self.user)
        self.assertEqual(self.client.patch(f"/api/cart/items/{item.id}/", {"quantity": 8}).status_code, 400)
        self.assertEqual(self.client.patch(f"/api/cart/items/{item.id}/", {"quantity": 6}).status_code, 200)

    def test_checkout_prices_snapshots_and_inventory(self):
        self.add(self.product, quantity=2, variant=self.small.id)
        self.add(self.product, variant=self.large.id)
        self.add(self.simple)
        response = self.client.post("/api/orders/", self.address)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["total"], "675.00")
        item = next(item for item in response.data["items"] if item["variant"] == self.small.id)
        self.assertEqual(item["variant_size"], "Small")
        self.assertEqual(item["variant_color"], "White")
        self.small.refresh_from_db(); self.large.refresh_from_db(); self.simple.refresh_from_db(); self.product.refresh_from_db()
        self.assertEqual((self.small.stock, self.large.stock, self.simple.stock, self.product.stock), (5, 19, 11, 50))
        self.assertFalse(CartItem.objects.filter(cart__user=self.user).exists())
        self.small.delete()
        snapshot = Order.objects.get().items.get(pk=item["id"])
        self.assertIsNone(snapshot.variant_id)
        self.assertEqual(snapshot.variant_size, "Small")

    def test_checkout_rechecks_stock_and_preserves_cart_on_failure(self):
        self.add(self.product, quantity=2, variant=self.small.id)
        self.small.stock = 1
        self.small.save()
        self.assertEqual(self.client.post("/api/orders/", self.address).status_code, 400)
        self.assertEqual(Order.objects.count(), 0)
        self.assertEqual(CartItem.objects.get().quantity, 2)

    def test_simple_products_still_checkout_without_variants(self):
        self.assertEqual(self.add(self.simple, quantity=2).status_code, 200)
        response = self.client.post("/api/orders/", self.address)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["total"], "150.00")
        self.assertIsNone(response.data["items"][0]["variant"])

    def test_legacy_cart_requires_reselection_after_adding_variants(self):
        cart = Cart.objects.create(user=self.user)
        CartItem.objects.create(cart=cart, product=self.product, quantity=1)
        self.assertEqual(self.client.post("/api/orders/", self.address).status_code, 400)

    def test_demo_seed_is_repeatable_and_preserves_edits(self):
        call_command("seed_demo_plants", stdout=StringIO())
        demo = Product.objects.get(slug="demo-velvet-leaf")
        demo.name = "Edited demo"; demo.save()
        call_command("seed_demo_plants", stdout=StringIO())
        self.assertEqual(Product.objects.filter(slug__startswith="demo-").count(), 10)
        demo.refresh_from_db()
        self.assertEqual(demo.name, "Edited demo")
