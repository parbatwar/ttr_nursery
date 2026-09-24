from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from orders.models import Order
from .models import Payment
from .serializers import PaymentSerializer


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_payment(request):
    order_id = request.data.get("order")
    provider = request.data.get("provider")

    if not order_id:
        return Response(
            {"detail": "Order is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if provider not in ["esewa", "khalti"]:
        return Response(
            {"detail": "Invalid payment provider."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        order = Order.objects.get(
            id=order_id,
            user=request.user,
        )
    except Order.DoesNotExist:
        return Response(
            {"detail": "Order not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if hasattr(order, "payment"):
        return Response(
            {"detail": "A payment already exists for this order."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if order.status == "cancelled":
        return Response(
            {"detail": "Cannot pay for a cancelled order."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    payment = Payment.objects.create(
        order=order,
        provider=provider,
        amount=order.total,
    )

    return Response(
        PaymentSerializer(payment).data,
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def payment_detail(request, payment_id):
    try:
        payment = Payment.objects.get(
            id=payment_id,
            order__user=request.user,
        )
    except Payment.DoesNotExist:
        return Response(
            {"detail": "Payment not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    return Response(PaymentSerializer(payment).data)
