from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PreguntaViewSet, TerminosPareadosViewSet, NivelesViewSet, EtapasViewSet, AvanceEstudiantesViewSet

router = DefaultRouter()
router.register(r'preguntas', PreguntaViewSet)
router.register(r'terminos_pareados', TerminosPareadosViewSet, basename='terminos_pareados')
router.register(r'niveles', NivelesViewSet, basename='niveles')
router.register(r'etapas', EtapasViewSet, basename='etapas')
router.register(r'avance_estudiantes', AvanceEstudiantesViewSet, basename='avance_estudiantes')

urlpatterns = [
    path('', include(router.urls)),    
]

