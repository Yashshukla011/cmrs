
from django.contrib import admin
from .models import CashCollection


@admin.register(CashCollection)
class CashCollectionAdmin(admin.ModelAdmin):
    list_display = (
        "receipt_number", "customer", "loan",
        "agent", "branch", "amount", "status", "collected_at"
    )
    search_fields = ("receipt_number", "customer__full_name")
    list_filter = ("status", "branch")