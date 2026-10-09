
from rest_framework import serializers
from .models import Settlement


class SettlementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settlement
        fields = "__all__"
        read_only_fields = ("processed_by", "created_at")

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Settlement amount must be greater than zero."
            )
        return value