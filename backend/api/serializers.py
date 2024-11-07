from rest_framework import serializers
from .models import Pregunta, TerminosPareados, Niveles, Etapas, AvanceEstudiantes
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Colegio, CursoColegio, Profile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

#Registros por estudiantes
class AvanceEstudiantesSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvanceEstudiantes
        fields = ['id', 'estudiante', 'etapa', 'tiempo', 'fecha_completada', 'logro']
        read_only_fields = ['fecha_completada', 'estudiante']

#Niveles
class NivelesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Niveles
        fields = '__all__'

#Etapas
class EtapasSerializer(serializers.ModelSerializer):
    nivel = NivelesSerializer(read_only=True, source='id_nivel')

    class Meta:
        model = Etapas
        fields = ['id_etapa', 'nombre', 'descripcion', 'componente', 'posicion_x', 'posicion_y', 'id_nivel', 'nivel']

#Preguntas
class TerminosPareadosSerializer(serializers.ModelSerializer):
    class Meta:
        model = TerminosPareados
        fields = '__all__'

class PreguntaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pregunta
        fields = '__all__'


#Usuarios
class ColegioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Colegio
        fields = '__all__'

class CursoColegioSerializer(serializers.ModelSerializer):
    class Meta:
        model = CursoColegio
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password", "email", "first_name", "last_name"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
            email=validated_data.get("email", ""),
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", "")
        )
        return user

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.get_or_create(user=instance, role='student')

@receiver(post_delete, sender=User)
def delete_user_profile(sender, instance, **kwargs):
    try:
        instance.profile.delete()
    except Profile.DoesNotExist:
        pass

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        try:
            profile = Profile.objects.get(user=user)
            token['role'] = profile.role
        except Profile.DoesNotExist:
            token['role'] = 'undefined'

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        try:
            profile = Profile.objects.get(user=self.user)
            data['role'] = profile.role
        except Profile.DoesNotExist:
            data['role'] = 'undefined'

        return data
