from django.contrib.auth.models import User
from django.core.cache import cache
from django.test import TestCase
from rest_framework.test import APIClient

from carts.models import Cart
from products.models import Product

from .models import Customer, Order


class GuestCheckoutTests(TestCase):
    def setUp(self):
        cache.clear()
        self.client = APIClient()
        self.product = Product.objects.create(name="Fern", price=500, stock=5)
        self.delivery = {
            "customer_name": "Sita",
            "address": "Patan",
            "city": "lalitpur",
        }
        self.contact = {"phone": "9800000000", "email": "sita@example.com"}

    def add_to_cart(self, client=None, token=None):
        client = client or self.client
        headers = {"HTTP_X_CART_TOKEN": token} if token else {}
        response = client.post(
            "/api/cart/items/",
            {"product": self.product.id, "quantity": 1},
            format="json",
            **headers,
        )
        self.assertEqual(response.status_code, 200)
        return response.data["token"]

    def checkout(self, token, **contact):
        return self.client.post(
            "/api/orders/",
            {**self.delivery, **contact},
            format="json",
            HTTP_X_CART_TOKEN=token,
        )

    def test_guest_can_buy_without_an_account(self):
        token = self.add_to_cart()

        response = self.checkout(
            token,
            phone="98000 00000",
            email="Sita@Example.com",
            note="Please call before coming.",
        )

        self.assertEqual(response.status_code, 201)
        order = Order.objects.get()
        self.assertIsNone(order.user)
        self.assertEqual(order.phone, "9800000000")
        self.assertEqual(order.customer.phone, "9800000000")
        self.assertEqual(order.customer.email, "sita@example.com")
        self.assertEqual(order.note, "Please call before coming.")
        self.assertEqual(order.payment_method, "cod")
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 4)

    def test_every_required_field_is_needed(self):
        token = self.add_to_cart()
        complete = {
            **self.delivery,
            "phone": "9800000000",
            "email": "sita@example.com",
        }

        for field in ["phone", "email", "customer_name", "address", "city"]:
            details = {key: value for key, value in complete.items() if key != field}
            response = self.client.post(
                "/api/orders/",
                details,
                format="json",
                HTTP_X_CART_TOKEN=token,
            )
            self.assertEqual(response.status_code, 400, field)
            self.assertIn(field, response.data)

        self.assertEqual(Order.objects.count(), 0)

    def test_note_is_optional(self):
        token = self.add_to_cart()

        response = self.checkout(token, **self.contact)

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Order.objects.get().note, "")

    def test_online_payment_is_refused_until_connected(self):
        token = self.add_to_cart()

        response = self.checkout(token, **self.contact, payment_method="esewa")

        self.assertEqual(response.status_code, 400)

    def test_repeat_buyer_keeps_one_customer_record(self):
        self.checkout(self.add_to_cart(), **self.contact)
        self.checkout(self.add_to_cart(), **self.contact)

        self.assertEqual(Customer.objects.count(), 1)
        self.assertEqual(Customer.objects.get().orders.count(), 2)

    def test_checkout_does_not_change_an_existing_customer_name(self):
        Customer.objects.create(name="Original", phone="9800000000")

        self.checkout(self.add_to_cart(), **self.contact)

        self.assertEqual(Customer.objects.get().name, "Original")
        self.assertEqual(Order.objects.get().customer_name, "Sita")

    def test_empty_cart_cannot_check_out(self):
        response = self.client.post(
            "/api/orders/",
            {**self.delivery, **self.contact},
            format="json",
        )

        self.assertEqual(response.status_code, 400)

    def test_order_page_needs_the_private_link(self):
        created = self.checkout(self.add_to_cart(), **self.contact).data

        response = self.client.get(f"/api/orders/track/{created['access_token']}/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["id"], created["id"])

        missing = "00000000-0000-0000-0000-000000000000"
        self.assertEqual(self.client.get(f"/api/orders/track/{missing}/").status_code, 404)
        self.assertEqual(self.client.get(f"/api/orders/{created['id']}/").status_code, 401)

    def test_signed_in_order_is_linked_to_the_account(self):
        user = User.objects.create_user(username="buyer", password="test-password")
        client = APIClient()
        client.force_authenticate(user)
        self.add_to_cart(client)

        response = client.post(
            "/api/orders/",
            {**self.delivery, **self.contact},
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        order = Order.objects.get()
        self.assertEqual(order.user, user)
        self.assertEqual(order.customer.user, user)
        self.assertEqual(client.get("/api/orders/history/").data[0]["id"], order.id)


class GuestCartTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.product = Product.objects.create(name="Fern", price=500, stock=5)

    def add(self, client, token=None, quantity=1):
        headers = {"HTTP_X_CART_TOKEN": token} if token else {}
        return client.post(
            "/api/cart/items/",
            {"product": self.product.id, "quantity": quantity},
            format="json",
            **headers,
        )

    def test_cart_stays_with_the_token(self):
        token = self.add(self.client).data["token"]

        self.add(self.client, token)

        cart = self.client.get("/api/cart/", HTTP_X_CART_TOKEN=token).data
        self.assertEqual(cart["items"][0]["quantity"], 2)
        self.assertEqual(Cart.objects.count(), 1)

    def test_visitor_without_a_token_has_an_empty_cart(self):
        self.add(self.client)

        self.assertEqual(self.client.get("/api/cart/").data["items"], [])

    def test_guest_cannot_change_another_guests_cart(self):
        first = self.add(self.client).data
        second = self.client.post(
            "/api/cart/items/",
            {"product": self.product.id, "quantity": 1},
            format="json",
        ).data

        response = self.client.delete(
            f"/api/cart/items/{first['items'][0]['id']}/remove/",
            HTTP_X_CART_TOKEN=second["token"],
        )

        self.assertEqual(response.status_code, 404)

    def test_account_cart_cannot_be_opened_with_its_token(self):
        user = User.objects.create_user(username="buyer", password="test-password")
        client = APIClient()
        client.force_authenticate(user)
        self.add(client)
        token = str(Cart.objects.get(user=user).token)

        cart = self.client.get("/api/cart/", HTTP_X_CART_TOKEN=token).data

        self.assertEqual(cart["items"], [])

    def test_guest_items_move_to_the_account_on_sign_in(self):
        token = self.add(self.client, quantity=2).data["token"]
        user = User.objects.create_user(username="buyer", password="test-password")
        client = APIClient()
        client.force_authenticate(user)
        self.add(client, quantity=4)

        cart = client.get("/api/cart/", HTTP_X_CART_TOKEN=token).data

        # 4 + 2 is more than the 5 in stock, so the quantity stops at 5.
        self.assertEqual(cart["items"][0]["quantity"], 5)
        self.assertIsNone(cart["token"])
        self.assertEqual(Cart.objects.count(), 1)
