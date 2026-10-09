
import os
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Create a deployment admin account once"

    def handle(self, *args, **options):
        User = get_user_model()

        username = os.getenv("DEPLOY_USERNAME")
        email = os.getenv("DEPLOY_EMAIL")
        password = os.getenv("DEPLOY_USER_PASSWORD")

        if not all([username, email, password]):
            raise CommandError(
                "DEPLOY_USERNAME, DEPLOY_EMAIL and "
                "DEPLOY_USER_PASSWORD must be set."
            )

        if User.objects.filter(username=username).exists():
            raise CommandError(
                "Username already exists. No changes were made."
            )

        if User.objects.filter(email=email).exists():
            raise CommandError(
                "Email already exists. No changes were made."
            )

        User.objects.create_superuser(
            username=username,
            email=email,
            password=password,
            role="ADMIN",
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Admin account '{username}' created successfully."
            )
        )