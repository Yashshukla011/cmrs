from rest_framework import serializers
from .models import Deposit


class DepositSerializer(serializers.ModelSerializer):

    class Meta:
        model = Deposit
        fields = "__all__"
        read_only_fields = [
            "id",
            "submitted_by",
            "verified_by",
            "status",
            "created_at",
            "updated_at",
        ]

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Deposit amount must be greater than zero."
            )
        return value

    def validate(self, attrs):
        deposit_type = attrs.get(
            "deposit_type",
            getattr(self.instance, "deposit_type", None),
        )

        reference = attrs.get(
            "deposit_reference",
            getattr(self.instance, "deposit_reference", ""),
        )

        if (
            deposit_type == Deposit.DepositType.BANK
            and not reference.strip()
        ):
            raise serializers.ValidationError({
                "deposit_reference": (
                    "Bank deposit requires a bank reference."
                )
            })

        return attrs
