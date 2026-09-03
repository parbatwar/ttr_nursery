from django.contrib.auth.models import User
from rest_framework import serializers

from .models import CustomerProfile


class RegisterSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(write_only=True, required=False)
    address = serializers.CharField(write_only=True, required=False)
    city = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "phone",
            "address",
            "city",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def create(self, validated_data):
        phone = validated_data.pop("phone", "")
        address = validated_data.pop("address", "")
        city = validated_data.pop("city", "")

        user = User.objects.create_user(**validated_data)

        CustomerProfile.objects.create(
            user=user,
            phone=phone,
            address=address,
            city=city,
        )

        return user
