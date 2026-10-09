
from rest_framework import serializers
from .models import Reconciliation


class ReconciliationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reconciliation
        fields = "__all__"
        read_only_fields = (
            "difference",
            "status",
            "reconciled_by",
            "created_at",
        )

    def validate(self, attrs):
        expected = attrs.get(
            "expected_amount",
            getattr(self.instance, "expected_amount", None)
        )
        actual = attrs.get(
            "actual_amount",
            getattr(self.instance, "actual_amount", None)
        )

        if expected is not None and expected < 0:
            raise serializers.ValidationError(
                {"expected_amount": "Amount cannot be negative."}
            )
        if actual is not None and actual < 0:
            raise serializers.ValidationError(
                {"actual_amount": "Amount cannot be negative."}
            )
        return attrs