
from django.contrib import admin
from .models import Settlement


@admin.register(Settlement)
class SettlementAdmin(admin.ModelAdmin):
    list_display = (
        "settlement_reference",
        "bank_deposit",
        "amount",
        "settlement_date",
        "status",
    )
    list_filter = ("status", "settlement_date")
    search_fields = ("settlement_reference",)