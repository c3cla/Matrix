from rest_framework import viewsets
from .models import Pregunta, TerminosPareados, Etapas, Profile, AvanceEstudiantes
from .serializers import PreguntaSerializer, TerminosPareadosSerializer, UserSerializer, CustomTokenObtainPairSerializer, NivelesSerializer, EtapasSerializer, AvanceEstudiantesSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import generics, viewsets
from django.db import IntegrityError
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny
from .filtros import *

class AvanceEstudiantesViewSet(viewsets.ModelViewSet):
    queryset = AvanceEstudiantes.objects.all()
    serializer_class = AvanceEstudiantesSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        data = request.data
        estudiante = request.user.profile
        etapa_id = data.get("etapa")
        tiempo = data.get("tiempo")
        logro = data.get("logro")

        avance = AvanceEstudiantes.objects.create(
            estudiante=estudiante,
            etapa_id=etapa_id,
            tiempo=tiempo,
            logro=logro,
        )
        serializer = self.get_serializer(avance)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class NivelesViewSet(viewsets.ModelViewSet):
    queryset = Niveles.objects.all()
    serializer_class = NivelesSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = NivelesFiltro
    search_fields = ['id_nivel']
    permission_classes = [AllowAny]

class EtapasViewSet(viewsets.ModelViewSet):
    queryset = Etapas.objects.all()
    serializer_class = EtapasSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = EtapasFiltro
    permission_classes = [AllowAny]


#Preguntas
class TerminosPareadosViewSet(viewsets.ModelViewSet):
    queryset = TerminosPareados.objects.all()
    serializer_class = TerminosPareadosSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = TerminoPareadoFilter
    search_fields = ['uso']
    permission_classes = [AllowAny]

class PreguntaViewSet(viewsets.ModelViewSet):
    queryset = Pregunta.objects.all()
    serializer_class = PreguntaSerializer

    @action(detail=True, methods=['get'])
    def terminos_pareados(self, request, pk=None):
        pregunta = self.get_object()
        if pregunta.tipo != 'terminos_pareados':
            return Response({'error': 'La pregunta no es de tipo términos pareados.'}, status=400)

        configuracion = pregunta.configuracion or {}
        terminos_ids = configuracion.get('terminos_ids')
        cantidad = configuracion.get('cantidad')

        if terminos_ids:
            terminos = TerminosPareados.objects.filter(id_termino__in=terminos_ids)
        elif cantidad:
            terminos = TerminosPareados.objects.order_by('?')[:cantidad]
        else:
            terminos = TerminosPareados.objects.all()

        serializer = TerminosPareadosSerializer(terminos, many=True)
        return Response(serializer.data)
    

#Usuarios
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            if User.objects.filter(username=request.data.get('username')).exists():
                return Response({"message": "El nombre de usuario ya está en uso."}, status=status.HTTP_400_BAD_REQUEST)
            if User.objects.filter(email=request.data.get('email')).exists():
                return Response({"message": "El correo ya está en uso."}, status=status.HTTP_400_BAD_REQUEST)
            
            user = self.create(request, *args, **kwargs)
            return Response({"message": "Usuario creado exitosamente."}, status=status.HTTP_201_CREATED)
        except IntegrityError:
            return Response({"message": "El usuario o correo ya existen."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message": "Error inesperado."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UpdateUserRoleView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        user_id = kwargs.get('user_id')
        new_role = request.data.get('role')

        if new_role not in ['student', 'teacher', 'admin']:
            return Response({"message": "Rol no válido."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            profile = Profile.objects.get(user_id=user_id)
            profile.role = new_role
            profile.save()
            return Response({"message": "Rol actualizado correctamente."}, status=status.HTTP_200_OK)
        except Profile.DoesNotExist:
            return Response({"message": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)