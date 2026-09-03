from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer

from django.shortcuts import render


# Create your views here.
@api_view(["GET"])
def product_list(request):
    products = Product.objects.all()

    category = request.GET.get("category")
    search = request.GET.get("search")
    min_price = request.GET.get("min_price")
    max_price = request.GET.get("max_price")
    ordering = request.GET.get("ordering")

    if category:
        products = products.filter(category__slug=category)

    if search:
        products = products.filter(name__icontains=search)

    if min_price:
        products = products.filter(price__gte=min_price)

    if max_price:
        products = products.filter(price__lte=max_price)

    allowed_orderings = {
        "price": "price",
        "-price": "-price",
        "created_at": "created_at",
        "-created_at": "-created_at",
        "name": "name",
        "-name": "-name",
    }

    if ordering in allowed_orderings:
        products = products.order_by(allowed_orderings[ordering])

    paginator = PageNumberPagination()
    paginator.page_size = 10

    result_page = paginator.paginate_queryset(products, request)

    serializer = ProductSerializer(result_page, many=True)

    return paginator.get_paginated_response(serializer.data)


@api_view(["GET"])
def category_list(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def product_detail(request, slug):
    try:
        product = Product.objects.get(slug=slug)
    except Product.DoesNotExist:
        return Response(
            {"detail": "Product not found"},
            status=status.HTTP_404_NOT_FOUND,
        )

    serializer = ProductSerializer(product)
    return Response(serializer.data)
