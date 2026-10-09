from datetime import datetime, time, timedelta
from decimal import Decimal, InvalidOperation

from django.db import transaction
from django.utils import timezone

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from cash_collections.models import CashCollection
from .models import Reconciliation
from .serializers import ReconciliationSerializer


class ReconciliationViewSet(viewsets.ModelViewSet):
    queryset = Reconciliation.objects.select_related(
        "branch", "reconciled_by"
    ).all()

    serializer_class = ReconciliationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(reconciled_by=self.request.user)

    def get_collection_data(self, branch, date_str):
        # Validate branch ID and date
        try:
            branch_id = int(branch)

            if branch_id <= 0:
                raise ValueError

            reconciliation_date = datetime.strptime(
                date_str, "%Y-%m-%d"
            ).date()

        except (ValueError, TypeError):
            raise ValidationError({
                "detail": (
                    "Provide a positive branch ID and date "
                    "in YYYY-MM-DD format."
                )
            })

        # Calculate start and end of the selected day
        start = timezone.make_aware(
            datetime.combine(reconciliation_date, time.min)
        )
        end = start + timedelta(days=1)

        # Get collections that have not yet been deposited
        collections = CashCollection.objects.filter(
            branch_id=branch_id,
            collected_at__gte=start,
            collected_at__lt=end,
            status=CashCollection.Status.COLLECTED,
        )

        # Calculate expected cash
        total = sum(
            (item.amount for item in collections),
            Decimal("0.00"),
        )

        expected_amount = total.quantize(Decimal("0.01"))

        return (
            branch_id,
            reconciliation_date,
            collections.count(),
            expected_amount,
        )

    @action(
        detail=False,
        methods=["get"],
        url_path="collection-summary",
    )
    def collection_summary(self, request):
        branch = request.query_params.get("branch")
        date_str = request.query_params.get("date")

        if not branch or not date_str:
            raise ValidationError({
                "detail": "Provide both branch and date parameters."
            })

        branch_id, recon_date, count, total = (
            self.get_collection_data(branch, date_str)
        )

        return Response({
            "branch": branch_id,
            "date": recon_date.isoformat(),
            "collection_count": count,
            "expected_amount": str(total),
        })

    @action(
        detail=False,
        methods=["post"],
        url_path="auto-reconcile",
    )
    def auto_reconcile(self, request):
        branch = request.data.get("branch")
        date_str = request.data.get("date")
        actual = request.data.get("actual_amount")

        if branch is None or not date_str or actual is None:
            raise ValidationError({
                "detail": (
                    "Provide branch, date and actual_amount."
                )
            })

        # Validate actual cash amount
        try:
            actual_amount = Decimal(str(actual))

            if (
                not actual_amount.is_finite()
                or actual_amount < 0
                or actual_amount != actual_amount.quantize(
                    Decimal("0.01")
                )
            ):
                raise ValueError

        except (InvalidOperation, ValueError, TypeError):
            raise ValidationError({
                "actual_amount": (
                    "Enter a valid non-negative amount with "
                    "up to 2 decimal places."
                )
            })

        # Calculate expected cash from collections
        branch_id, recon_date, count, expected = (
            self.get_collection_data(branch, date_str)
        )

        # Update the latest existing record or create a new one.
        # This avoids MultipleObjectsReturned when old duplicates exist.
        with transaction.atomic():
            reconciliation = (
                Reconciliation.objects.select_for_update()
                .filter(
                    branch_id=branch_id,
                    reconciliation_date=recon_date,
                )
                .order_by("-id")
                .first()
            )

            if reconciliation is not None:
                reconciliation.expected_amount = expected
                reconciliation.actual_amount = actual_amount
                reconciliation.reconciled_by = request.user
                reconciliation.notes = (
                    "Automatically reconciled from collected cash."
                )
                reconciliation.save()

                created = False

            else:
                reconciliation = Reconciliation.objects.create(
                    branch_id=branch_id,
                    reconciliation_date=recon_date,
                    expected_amount=expected,
                    actual_amount=actual_amount,
                    reconciled_by=request.user,
                    notes=(
                        "Automatically reconciled from collected cash."
                    ),
                )
                created = True

        return Response({
            "message": (
                "Reconciliation created"
                if created
                else "Reconciliation updated"
            ),
            "id": reconciliation.id,
            "branch": branch_id,
            "reconciliation_date": recon_date.isoformat(),
            "collection_count": count,
            "expected_amount": str(
                reconciliation.expected_amount
            ),
            "actual_amount": str(
                reconciliation.actual_amount
            ),
            "difference": str(reconciliation.difference),
            "status": reconciliation.status,
        })
