
from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):

    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        AGENT = "AGENT", "Collection Agent"
        BRANCH_MANAGER = "BRANCH_MANAGER", "Branch Manager"
        FINANCE = "FINANCE", "Finance Officer"

    email = models.EmailField(unique=True)

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.AGENT
    )

    def __str__(self):
        return f"{self.username} ({self.role})"