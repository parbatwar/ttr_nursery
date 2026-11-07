from decimal import Decimal, InvalidOperation

from django.db.models import Min, Q
from django.db.models.functions import Coalesce
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from .models import Category, LightRequirement, Product
from .serializers import (
    CategorySerializer,
    LightRequirementSerializer,
    ProductSerializer,
)

# Older links that should still open the right category.
CATEGORY_ALIASES = {
    "indoor-plant": "indoor",
    "indoor-plants": "indoor",
    "outdoor-plant": "outdoor",
    "outdoor-plants": "outdoor",
}


def get_selected_values(request, parameter):
    """Read a filter given as ?size=small,large or ?size=small&size=large."""
    selected = set()
    for value in request.GET.getlist(parameter):
        selected.update(item for item in value.split(",") if item)
    return selected


def format_choices(choices):
    return [{"slug": slug, "name": name} for slug, name in choices]


# Create your views here.
@api_view(["GET"])
def product_list(request):
    products = (
        Product.objects.prefetch_related(
            "categories",
            "images",
            "light_requirements",
            "variants",
        )
        .annotate(catalog_price=Coalesce(Min("variants__price"), "price"))
    )

    category = request.GET.get("category")
    search = request.GET.get("search")
    min_price = request.GET.get("min_price")
    max_price = request.GET.get("max_price")
    ordering = request.GET.get("ordering")

    if category:
        category = CATEGORY_ALIASES.get(category, category)
        products = products.filter(categories__slug=category)

    # Inside one filter, any selected option can match.
    # Between different filters, every filter must match.
    simple_filters = {
        "care_level": "care_level__in",
        "lifespan": "lifespan__in",
        "item_type": "item_type__in",
        "light": "light_requirements__slug__in",
    }
    for parameter, lookup in simple_filters.items():
        selected = get_selected_values(request, parameter)
        if selected:
            products = products.filter(**{lookup: selected})

    if request.GET.get("flowering") == "true":
        products = products.filter(is_flowering=True)

    selected_sizes = get_selected_values(request, "size")
    if selected_sizes:
        size_filter = Q(size__in=selected_sizes)
        for size in selected_sizes:
            size_filter |= Q(variants__size__iexact=size)
        products = products.filter(size_filter)

    if search:
        products = products.filter(
            Q(name__icontains=search) | Q(local_name__icontains=search)
        )

    try:
        lower = Decimal(min_price) if min_price else None
        upper = Decimal(max_price) if max_price else None
        if any(
            value is not None and (not value.is_finite() or value < 0)
            for value in [lower, upper]
        ):
            raise ValueError
        if lower is not None and upper is not None and lower > upper:
            raise ValueError
    except (InvalidOperation, ValueError):
        return Response(
            {"detail": "Enter a valid price range."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if lower is not None:
        products = products.filter(catalog_price__gte=lower)
    if upper is not None:
        products = products.filter(catalog_price__lte=upper)

    allowed_orderings = {
        "price": "catalog_price",
        "-price": "-catalog_price",
        "created_at": "created_at",
        "-created_at": "-created_at",
        "name": "name",
        "-name": "-name",
    }

    products = products.order_by(
        allowed_orderings.get(ordering, "-created_at"),
        "id",
    ).distinct()

    paginator = PageNumberPagination()
    paginator.page_size = 10

    result_page = paginator.paginate_queryset(products, request)

    serializer = ProductSerializer(result_page, many=True)

    return paginator.get_paginated_response(serializer.data)


@api_view(["GET"])
def category_list(request):
    serializer = CategorySerializer(Category.objects.all(), many=True)
    return Response(serializer.data)


@api_view(["GET"])
def catalog_filters(request):
    return Response(
        {
            "categories": CategorySerializer(Category.objects.all(), many=True).data,
            "care_levels": format_choices(Product.CARE_LEVEL_CHOICES),
            "light_requirements": LightRequirementSerializer(
                LightRequirement.objects.all(),
                many=True,
            ).data,
            "lifespans": format_choices(Product.LIFESPAN_CHOICES),
            "sizes": format_choices(Product.SIZE_CHOICES),
            "item_types": format_choices(Product.ITEM_TYPE_CHOICES),
        }
    )


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
