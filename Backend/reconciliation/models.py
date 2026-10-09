
from django.db import models
from django.conf import settings
from branches.models import Branch


class Reconciliation(models.Model):

    class Status(models.TextChoices):
        MATCHED = "MATCHED", "Matched"
        MISMATCH = "MISMATCH", "Mismatch"
        PENDING = "PENDING", "Pending"

    reconciliation_date = models.DateField()
    branch = models.ForeignKey(
        Branch,
        on_delete=models.PROTECT,
        related_name="reconciliations"
    )
    expected_amount = models.DecimalField(
        max_digits=12, decimal_places=2
    )
    actual_amount = models.DecimalField(
        max_digits=12, decimal_places=2
    )
    difference = models.DecimalField(
        max_digits=12, decimal_places=2, default=0
    )
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.PENDING
    )
    reconciled_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT
    )
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.difference = self.actual_amount - self.expected_amount

        if self.difference == 0:
            self.status = self.Status.MATCHED
        else:
            self.status = self.Status.MISMATCH

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.branch} - {self.reconciliation_date}"