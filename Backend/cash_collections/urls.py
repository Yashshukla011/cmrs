
from rest_framework.routers import DefaultRouter
from .views import CashCollectionViewSet

router = DefaultRouter()
router.register("", CashCollectionViewSet, basename="cash-collection")

urlpatterns = router.urls