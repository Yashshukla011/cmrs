
from django.db import models
from customers.models import Customer


class Loan(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "ACTIVE", "Active"
        CLOSED = "CLOSED", "Closed"
        DEFAULTED = "DEFAULTED", "Defaulted"

    loan_number = models.CharField(max_length=30, unique=True)
    customer = models.ForeignKey(
        Customer,
        on_delete=models.PROTECT,
        related_name="loans"
    )
    principal_amount = models.DecimalField(
        max_digits=12, decimal_places=2
    )
    interest_rate = models.DecimalField(
        max_digits=5, decimal_places=2, default=0
    )
    tenure_months = models.PositiveIntegerField()
    outstanding_balance = models.DecimalField(
        max_digits=12, decimal_places=2
    )
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.ACTIVE
    )
    issued_at = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.loan_number