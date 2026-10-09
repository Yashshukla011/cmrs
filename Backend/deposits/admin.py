from django.contrib import admin
from .models import Deposit


@admin.register(Deposit)
class DepositAdmin(admin.ModelAdmin):
    list_display = (
        "deposit_number",
        "deposit_type",
        "branch",
        "amount",
        "status",
        "submitted_by",
        "verified_by",
        "created_at",
    )

    list_filter = (
        "deposit_type",
        "status",
        "created_at",
    )

    search_fields = (
        "deposit_number",
        "deposit_reference",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
        "deposited_at",
    )

    ordering = ("-created_at",)
