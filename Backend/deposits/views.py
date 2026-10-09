from django.utils import timezone
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from .models import Deposit
from .serializers import DepositSerializer


class DepositViewSet(viewsets.ModelViewSet):
    queryset = Deposit.objects.select_related(
        "branch",
        "submitted_by",
        "verified_by",
    ).all()

    serializer_class = DepositSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(submitted_by=self.request.user)

    @action(detail=True, methods=["post"])
    def confirm(self, request, pk=None):
        deposit = self.get_object()

        if deposit.status != Deposit.Status.PENDING:
            raise ValidationError({
                "detail": "Only pending deposits can be confirmed."
            })

        if deposit.deposit_type == Deposit.DepositType.BANK:
            if not deposit.deposit_reference.strip():
                raise ValidationError({
                    "deposit_reference": (
                        "Add a bank reference before confirming."
                    )
                })

        deposit.status = Deposit.Status.CONFIRMED
        deposit.verified_by = request.user
        deposit.deposited_at = timezone.now()
        deposit.save(
            update_fields=[
                "status",
                "verified_by",
                "deposited_at",
                "updated_at",
            ]
        )

        return Response({
            "message": "Deposit confirmed successfully.",
            "id": deposit.id,
            "deposit_number": deposit.deposit_number,
            "status": deposit.status,
            "verified_by": deposit.verified_by_id,
            "deposited_at": deposit.deposited_at,
        })

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        deposit = self.get_object()

        if deposit.status != Deposit.Status.PENDING:
            raise ValidationError({
                "detail": "Only pending deposits can be rejected."
            })

        deposit.status = Deposit.Status.REJECTED
        deposit.verified_by = request.user
        deposit.save(
            update_fields=[
                "status",
                "verified_by",
                "updated_at",
            ]
        )

        return Response({
            "message": "Deposit rejected.",
            "id": deposit.id,
            "status": deposit.status,
        })
