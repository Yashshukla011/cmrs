
from django.db import transaction
from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAuthenticated

from .models import CashCollection
from .serializers import CashCollectionSerializer
from loans.models import Loan


class CashCollectionViewSet(viewsets.ModelViewSet):
    queryset = CashCollection.objects.select_related(
        "customer", "loan", "agent", "branch"
    ).all()

    serializer_class = CashCollectionSerializer
    permission_classes = [IsAuthenticated]

    # Collections cannot be edited or deleted through this API.
    http_method_names = ["get", "post", "head", "options"]

    @transaction.atomic
    def perform_create(self, serializer):
        loan_id = serializer.validated_data["loan"].pk

        # Lock the loan row during payment processing.
        loan = Loan.objects.select_for_update().get(pk=loan_id)

        amount = serializer.validated_data["amount"]
        customer = serializer.validated_data["customer"]

        if loan.customer_id != customer.pk:
            raise serializers.ValidationError({
                "loan": "This loan does not belong to the selected customer."
            })

        if loan.status != Loan.Status.ACTIVE:
            raise serializers.ValidationError({
                "loan": "Only active loans can receive collections."
            })

        if amount > loan.outstanding_balance:
            raise serializers.ValidationError({
                "amount": "Collection cannot exceed the outstanding balance."
            })

        # Save the collection and update the loan balance atomically.
        serializer.save(agent=self.request.user)

        loan.outstanding_balance -= amount

        if loan.outstanding_balance == 0:
            loan.status = Loan.Status.CLOSED
            loan.save(update_fields=["outstanding_balance", "status"])
        else:
            loan.save(update_fields=["outstanding_balance"])