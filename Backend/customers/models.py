
from django.db import models
from branches.models import Branch


class Customer(models.Model):
    customer_id = models.CharField(max_length=30, unique=True)
    full_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=15)
    email = models.EmailField(blank=True)
    address = models.TextField()

    branch = models.ForeignKey(
        Branch,
        on_delete=models.PROTECT,
        related_name="customers"
    )

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer_id} - {self.full_name}"