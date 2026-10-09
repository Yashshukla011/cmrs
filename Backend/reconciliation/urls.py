
from rest_framework.routers import DefaultRouter
from .views import ReconciliationViewSet

router = DefaultRouter()
router.register("", ReconciliationViewSet, basename="reconciliation")

urlpatterns = router.urls