
from django.db import models
from django.conf import settings
from customers.models import Customer
from loans.models import Loan
from branches.models import Branch


class CashCollection(models.Model):

    class Status(models.TextChoices):
        COLLECTED = "COLLECTED", "Collected"
        DEPOSITED = "DEPOSITED", "Deposited"
        RECONCILED = "RECONCILED", "Reconciled"

    receipt_number = models.CharField(max_length=30, unique=True)
    customer = models.ForeignKey(
        Customer, on_delete=models.PROTECT, related_name="collections"
    )
    loan = models.ForeignKey(
        Loan, on_delete=models.PROTECT, related_name="collections"
    )
    agent = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT,
        related_name="cash_collections"
    )
    branch = models.ForeignKey(
        Branch, on_delete=models.PROTECT, related_name="cash_collections"
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    collected_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=12, choices=Status.choices, default=Status.COLLECTED
    )
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.receipt_number} - {self.amount}"