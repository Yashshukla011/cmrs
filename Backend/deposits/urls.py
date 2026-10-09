from rest_framework.routers import DefaultRouter
from .views import DepositViewSet

router = DefaultRouter()
router.register("", DepositViewSet, basename="deposit")

urlpatterns = router.urls
