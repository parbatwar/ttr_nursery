from django.urls import path
from .views import category_list, product_detail, product_list, catalog_filters

urlpatterns = [
    path("catalog-filters/", catalog_filters),
    path("products/", product_list),
    path("products/<slug:slug>/", product_detail),
    path("categories/", category_list),
]
