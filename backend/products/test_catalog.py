from datetime import timedelta

from django.contrib.auth.models import User
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from orders.models import Order, OrderItem

from .models import Category, LightRequirement, Product, ProductVariant


class CatalogFilteringTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.indoor = Category.objects.get(slug="indoor")
        cls.outdoor = Category.objects.get(slug="outdoor")
        cls.fruit_herbs = Category.objects.get(slug="fruit-herbs")
        cls.supplies = Category.objects.get(slug="pots-garden-care")
        cls.low_light = LightRequirement.objects.get(slug="low-light")
        cls.partial_sun = LightRequirement.objects.get(slug="partial-sun")
        cls.full_sun = LightRequirement.objects.get(slug="full-sun")

        cls.fern = cls.make_product(
            "Fern",
            [cls.indoor],
            [cls.low_light],
            care_level="easy",
            lifespan="perennial",
            size="small",
            local_name="Unyu",
        )
        cls.marigold = cls.make_product(
            "Marigold",
            [cls.outdoor],
            [cls.partial_sun, cls.full_sun],
            care_level="moderate",
            lifespan="seasonal",
            is_flowering=True,
            local_name="Sayapatri",
        )
        ProductVariant.objects.create(
            product=cls.marigold,
            size="Large",
            price="900.00",
            stock=5,
        )
        cls.mint = cls.make_product(
            "Mint",
            [cls.fruit_herbs],
            [],
            item_type="herb",
            size="small",
        )
        cls.pot = cls.make_product(
            "Clay pot",
            [cls.supplies],
            [],
            item_type="pots",
            size="large",
        )

    @staticmethod
    def make_product(name, categories, lights, **details):
        product = Product.objects.create(
            name=name,
            price="500.00",
            stock=20,
            **details,
        )
        product.categories.set(categories)
        product.light_requirements.set(lights)
        return product

    def names(self, **params):
        response = APIClient().get("/api/products/", params)
        self.assertEqual(response.status_code, 200)
        return [product["name"] for product in response.data["results"]]

    def test_four_main_categories_exist(self):
        data = APIClient().get("/api/catalog-filters/").data
        self.assertEqual(
            [category["name"] for category in data["categories"]],
            ["Indoor", "Outdoor", "Fruit & Herbs", "Pots & Garden Care"],
        )

    def test_category_filter_and_old_links(self):
        self.assertEqual(self.names(category="indoor"), ["Fern"])
        self.assertEqual(self.names(category="indoor-plants"), ["Fern"])
        self.assertEqual(self.names(category="pots-garden-care"), ["Clay pot"])

    def test_product_can_appear_in_two_categories(self):
        self.fern.categories.add(self.outdoor)
        self.assertCountEqual(self.names(category="outdoor"), ["Fern", "Marigold"])

    def test_options_in_one_filter_widen_results(self):
        self.assertCountEqual(
            self.names(light="low-light,full-sun"),
            ["Fern", "Marigold"],
        )
        self.assertCountEqual(
            self.names(care_level="easy,moderate"),
            ["Fern", "Marigold"],
        )

    def test_different_filters_narrow_results(self):
        self.assertEqual(
            self.names(category="outdoor", lifespan="seasonal", flowering="true"),
            ["Marigold"],
        )
        self.assertEqual(self.names(category="indoor", lifespan="seasonal"), [])

    def test_size_matches_product_and_variant_without_duplicates(self):
        self.assertCountEqual(self.names(size="large"), ["Marigold", "Clay pot"])
        self.assertCountEqual(self.names(size="small"), ["Fern", "Mint"])

    def test_item_type_filter(self):
        self.assertEqual(self.names(item_type="herb"), ["Mint"])
        self.assertEqual(self.names(item_type="pots"), ["Clay pot"])

    def test_search_checks_local_name(self):
        self.assertEqual(self.names(search="sayapatri"), ["Marigold"])
        self.assertEqual(self.names(search="fern"), ["Fern"])

    def test_price_validation_and_search_combine(self):
        self.assertEqual(
            self.names(search="Fern", min_price="500", max_price="500"),
            ["Fern"],
        )
        for params in [
            {"min_price": "bad"},
            {"min_price": "NaN"},
            {"min_price": "600", "max_price": "100"},
        ]:
            self.assertEqual(
                APIClient().get("/api/products/", params).status_code,
                400,
            )

    def test_product_shows_readable_details(self):
        self.fern.watering = "every-2-3-days"
        self.fern.comes_in = "nursery-bag"
        self.fern.best_season = "Spring"
        self.fern.pot_size = "6 inch pot"
        self.fern.save()

        data = APIClient().get(f"/api/products/{self.fern.slug}/").data

        self.assertEqual(data["care_level_label"], "Easy")
        self.assertEqual(data["watering_label"], "Every 2–3 days")
        self.assertEqual(data["comes_in_label"], "Nursery bag")
        self.assertEqual(data["best_season"], "Spring")
        self.assertEqual(data["pot_size"], "6 inch pot")
        self.assertEqual(data["light_requirements"][0]["name"], "Low Light")


class AutomaticLabelTests(TestCase):
    def labels(self, product):
        return APIClient().get(f"/api/products/{product.slug}/").data["labels"]

    def make_product(self, name="Plant", **details):
        values = {"price": "500.00", "stock": 50, **details}
        return Product.objects.create(name=name, **values)

    def test_new_label_uses_the_date_added(self):
        product = self.make_product()
        self.assertIn("new", self.labels(product))

        Product.objects.filter(pk=product.pk).update(
            created_at=timezone.now() - timedelta(days=31)
        )
        self.assertNotIn("new", self.labels(product))

    def test_stock_labels(self):
        self.assertIn("few_left", self.labels(self.make_product("Few", stock=3)))
        self.assertIn("sold_out", self.labels(self.make_product("None", stock=0)))
        self.assertNotIn("few_left", self.labels(self.make_product("Plenty")))

    def test_sale_label_needs_a_higher_original_price(self):
        sale = self.make_product("Sale", original_price="700.00")
        same = self.make_product("Same", original_price="500.00")
        self.assertIn("sale", self.labels(sale))
        self.assertNotIn("sale", self.labels(same))

    def test_sale_label_uses_variant_prices(self):
        product = self.make_product("Sized")
        ProductVariant.objects.create(
            product=product,
            size="Small",
            price="300.00",
            original_price="400.00",
            stock=20,
        )
        data = APIClient().get(f"/api/products/{product.slug}/").data
        self.assertIn("sale", data["labels"])
        self.assertEqual(data["original_price"], "400.00")

    def add_order_item(self, product, status):
        user, _ = User.objects.get_or_create(username="buyer")
        order = Order.objects.create(
            user=user,
            status=status,
            customer_name="Buyer",
            phone="9800000000",
            address="Test address",
            city="Kathmandu",
            subtotal="500.00",
            total="500.00",
        )
        OrderItem.objects.create(
            order=order,
            product=product,
            product_name=product.name,
            unit_price="500.00",
            quantity=1,
            subtotal="500.00",
        )

    def test_best_seller_ignores_cancelled_orders(self):
        sold = self.make_product("Sold")
        cancelled = self.make_product("Cancelled")
        self.add_order_item(sold, "delivered")
        self.add_order_item(cancelled, "cancelled")

        self.assertIn("best_seller", self.labels(sold))
        self.assertNotIn("best_seller", self.labels(cancelled))
