
from rest_framework import serializers
from .models import CashCollection


class CashCollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CashCollection
        fields = "__all__"
        read_only_fields = (
            "agent",
            "collected_at",
            "status",
        )

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Amount must be greater than zero."
            )
        return value

    def validate(self, attrs):
        customer = attrs.get(
            "customer",
            getattr(self.instance, "customer", None)
        )
        loan = attrs.get(
            "loan",
            getattr(self.instance, "loan", None)
        )

        if customer and loan:
            if loan.customer_id != customer.id:
                raise serializers.ValidationError({
                    "loan": "This loan does not belong to the selected customer."
                })

            if loan.status != loan.Status.ACTIVE:
                raise serializers.ValidationError({
                    "loan": "Collection is allowed only for active loans."
                })

            if loan.outstanding_balance <= 0:
                raise serializers.ValidationError({
                    "loan": "This loan has no outstanding balance."
                })

        return attrs