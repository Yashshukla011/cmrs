
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Settlement
from .serializers import SettlementSerializer


class SettlementViewSet(viewsets.ModelViewSet):
    queryset = Settlement.objects.select_related(
        "bank_deposit", "processed_by"
    ).all()
    serializer_class = SettlementSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(processed_by=self.request.user)