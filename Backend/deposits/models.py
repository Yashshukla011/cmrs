from django.conf import settings
from django.db import models


class Deposit(models.Model):
    class DepositType(models.TextChoices):
        BRANCH = "BRANCH", "Agent to Branch"
        BANK = "BANK", "Branch to Bank"

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        CONFIRMED = "CONFIRMED", "Confirmed"
        REJECTED = "REJECTED", "Rejected"

    deposit_number = models.CharField(max_length=30, unique=True)
    deposit_type = models.CharField(max_length=10, choices=DepositType.choices)

    branch = models.ForeignKey(
        "branches.Branch",
        on_delete=models.PROTECT,
        related_name="deposits"
    )

    amount = models.DecimalField(max_digits=14, decimal_places=2)

    submitted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="submitted_deposits"
    )

    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="verified_deposits",
        null=True,
        blank=True
    )

    deposit_reference = models.CharField(max_length=100, blank=True)
    status = models.CharField(
        max_length=12,
        choices=Status.choices,
        default=Status.PENDING
    )
    deposited_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.deposit_number} - {self.amount}"
