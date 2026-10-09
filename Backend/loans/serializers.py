
from rest_framework import serializers
from .models import Loan


class LoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loan
        fields = "__all__"

    def validate(self, attrs):
        principal = attrs.get(
            "principal_amount",
            getattr(self.instance, "principal_amount", None)
        )
        balance = attrs.get(
            "outstanding_balance",
            getattr(self.instance, "outstanding_balance", None)
        )
        interest_rate = attrs.get(
            "interest_rate",
            getattr(self.instance, "interest_rate", 0)
        )
        tenure = attrs.get(
            "tenure_months",
            getattr(self.instance, "tenure_months", None)
        )

        if principal is not None and principal <= 0:
            raise serializers.ValidationError({
                "principal_amount": "Amount must be greater than zero."
            })

        if balance is not None and balance < 0:
            raise serializers.ValidationError({
                "outstanding_balance": "Balance cannot be negative."
            })

        if (
            principal is not None
            and balance is not None
            and balance > principal
        ):
            raise serializers.ValidationError({
                "outstanding_balance": "Balance cannot exceed principal."
            })

        if interest_rate is not None and interest_rate < 0:
            raise serializers.ValidationError({
                "interest_rate": "Interest rate cannot be negative."
            })

        if tenure is not None and tenure <= 0:
            raise serializers.ValidationError({
                "tenure_months": "Tenure must be at least one month."
            })

        return attrs