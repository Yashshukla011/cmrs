from django.db import models
from django.conf import settings

from deposits.models import Deposit


class Settlement(models.Model):

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        COMPLETED = "COMPLETED", "Completed"
        FAILED = "FAILED", "Failed"

    settlement_reference = models.CharField(
        max_length=100,
        unique=True,
    )

    bank_deposit = models.ForeignKey(
        Deposit,
        on_delete=models.PROTECT,
        related_name="settlements",
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    settlement_date = models.DateField()

    company_account_reference = models.CharField(
        max_length=100,
        blank=True,
    )

    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.PENDING,
    )

    processed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="settlements",
    )

    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    def __str__(self):
        return self.settlement_reference
