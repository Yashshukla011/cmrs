
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Loan
from .serializers import LoanSerializer


class LoanViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.select_related("customer").all()
    serializer_class = LoanSerializer
    permission_classes = [IsAuthenticated]