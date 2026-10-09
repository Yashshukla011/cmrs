
from django.contrib import admin
from .models import Branch


@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = (
        "branch_code",
        "name",
        "city",
        "state",
        "manager",
        "is_active"
    )

    search_fields = ("name", "branch_code", "city")
    list_filter = ("state", "is_active")