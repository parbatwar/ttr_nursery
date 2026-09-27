from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import register, me, EmailLoginView

urlpatterns = [
    path("register/", register),
    path("login/", EmailLoginView.as_view(), name="email_login"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("me/", me),
]
