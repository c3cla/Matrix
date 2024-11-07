from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import Colegio, CursoColegio
from api.serializers import CursoColegioSerializer, ColegioSerializer
from .permissions import IsAdminUserRole
from rest_framework.permissions import IsAuthenticated


class CursosPorColegioView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserRole]

    def get(self, request, pk):
        try:
            # Intentar obtener el colegio por ID
            colegio = Colegio.objects.get(pk=pk)
            # Filtrar los cursos por el colegio encontrado
            cursos = colegio.cursos.all()  # Alternativa usando related_name
            # Serializar los datos de los cursos
            serializer = CursoColegioSerializer(cursos, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Colegio.DoesNotExist:
            return Response({"error": "Colegio no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Loggear el error para entender qué está pasando
            print(f"Error inesperado: {e}")
            return Response({"error": "Ocurrió un error inesperado en el servidor"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ColegioListCreateView(generics.ListCreateAPIView):
    queryset = Colegio.objects.all()
    serializer_class = ColegioSerializer
    permission_classes = [IsAuthenticated, IsAdminUserRole]

class ColegioRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Colegio.objects.all()
    serializer_class = ColegioSerializer
    permission_classes = [IsAuthenticated, IsAdminUserRole]

class CursoColegioListCreateView(generics.ListCreateAPIView):
    queryset = CursoColegio.objects.all()
    serializer_class = CursoColegioSerializer
    permission_classes = [IsAuthenticated, IsAdminUserRole]

class CursoColegioRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CursoColegio.objects.all()
    serializer_class = CursoColegioSerializer
    permission_classes = [IsAuthenticated, IsAdminUserRole]