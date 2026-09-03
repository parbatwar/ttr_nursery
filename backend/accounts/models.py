from django.db import models

# Create your models here.
from django.contrib.auth.models import User
from django.db import models


class CustomerProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile",
    )

    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(
        max_length=100,
        choices=[
            ("kathmandu", "Kathmandu"),
            ("lalitpur", "Lalitpur"),
            ("bhaktapur", "Bhaktapur"),
        ],
        blank=True,
    )

    def __str__(self):
        return self.user.username
