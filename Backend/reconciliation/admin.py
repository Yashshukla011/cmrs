
from django.contrib import admin
from .models import Reconciliation


@admin.register(Reconciliation)
class ReconciliationAdmin(admin.ModelAdmin):
    list_display = (
        "reconciliation_date",
        "branch",
        "expected_amount",
        "actual_amount",
        "difference",
        "status",
    )
    list_filter = ("status", "branch", "reconciliation_date")
    search_fields = ("branch__name",)