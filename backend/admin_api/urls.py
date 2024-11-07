from django.urls import path
from .views import (
    ColegioListCreateView,
    ColegioRetrieveUpdateDestroyView,
    CursoColegioListCreateView,
    CursoColegioRetrieveUpdateDestroyView,
    CursosPorColegioView
)


urlpatterns = [
    path('colegios/', ColegioListCreateView.as_view(), name='list_create_colegio'),
    path('colegios/<int:pk>/', ColegioRetrieveUpdateDestroyView.as_view(), name='retrieve_update_destroy_colegio'),
    path('colegios/<int:pk>/cursos/', CursosPorColegioView.as_view(), name='cursos_por_colegio'),
    path('cursos/', CursoColegioListCreateView.as_view(), name='list_create_curso'),
    path('cursos/<int:pk>/', CursoColegioRetrieveUpdateDestroyView.as_view(), name='retrieve_update_destroy_curso'),
]
