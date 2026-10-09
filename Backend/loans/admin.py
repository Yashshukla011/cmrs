
from django.contrib import admin
from .models import Loan


@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    list_display = (
        "loan_number",
        "customer",
        "principal_amount",
        "outstanding_balance",
        "status",
    )
    search_fields = ("loan_number", "customer__full_name")
    list_filter = ("status",)