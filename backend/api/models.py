from django.db import models
from django.contrib.auth.models import User

#Usuarios
class Colegio(models.Model):
    id = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=100, unique=True)
    direccion = models.CharField(max_length=255)
    ciudad = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre


class CursoColegio(models.Model):
    id = models.BigAutoField(primary_key=True)
    nivel = models.CharField(max_length=50)
    letra = models.CharField(max_length=1)
    colegio = models.ForeignKey(Colegio, on_delete=models.CASCADE, related_name='cursos')

    def __str__(self):
        return f"{self.nivel} {self.letra} - {self.colegio.nombre}"


class Profile(models.Model):
    id = models.BigAutoField(primary_key=True)
    ROLE_CHOICES = [
        ('student', 'Alumno'),
        ('teacher', 'Profesor'),
        ('admin', 'Administrador'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    rut = models.CharField(max_length=12, unique=True, null=True, blank=True)
    colegio = models.ForeignKey(Colegio, on_delete=models.SET_NULL, null=True, blank=True, related_name='profesores', help_text='Solo aplicable si el usuario es profesor')
    curso = models.ForeignKey(CursoColegio, on_delete=models.SET_NULL, null=True, blank=True, related_name='alumnos', help_text='Aplicable si el usuario es alumno')

    def __str__(self):
        return f"{self.user.username} - {self.role}"

    def save(self, *args, **kwargs):
        if self.role != 'teacher':
            self.colegio = None
            self.curso = None
        super().save(*args, **kwargs)


#Preguntas       
class OA(models.Model):
    id_OA = models.AutoField(primary_key=True)
    OA = models.CharField(max_length=255)
    descripcion = models.TextField()

    def __str__(self):
        return self.OA

class IndicadoresEvaluacion(models.Model):
    id_indicador = models.AutoField(primary_key=True)
    id_OA = models.ForeignKey(OA, on_delete=models.CASCADE)
    descripcion = models.TextField()
    contenido = models.TextField()

    def __str__(self):
        return f"Indicador {self.id_indicador}"


class Niveles(models.Model):
    id_nivel = models.CharField(primary_key=True, max_length=10)
    nombre = models.CharField(max_length=255)
    OA = models.ForeignKey(OA, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre


class Etapas(models.Model):
    id_etapa = models.AutoField(primary_key=True)
    id_nivel = models.ForeignKey(Niveles, on_delete=models.CASCADE)
    OA = models.ForeignKey(OA, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField()
    componente = models.TextField()
    completado = models.BooleanField(default=False)
    posicion_x = models.IntegerField()
    posicion_y = models.IntegerField()

    def __str__(self):
        return self.nombre


class Pregunta(models.Model):
    id_pregunta = models.AutoField(primary_key=True)
    id_etapa = models.ForeignKey(Etapas, on_delete=models.CASCADE)
    contenido = models.TextField()
    tipo = models.CharField(max_length=50) 
    dificultad = models.CharField(max_length=50)
    habilidad = models.CharField(max_length=50)
    
    configuracion = models.JSONField(blank=True, null=True)

    def __str__(self):
        return f"Pregunta {self.id_pregunta} - {self.tipo}"
    
class TerminosPareados(models.Model):
    id_termino = models.AutoField(primary_key=True)
    uso = models.CharField(max_length=255)
    concepto = models.CharField(max_length=255)
    definicion = models.TextField()

    def __str__(self):
        return self.concepto


class AvanceEstudiantes(models.Model):
    id = models.BigAutoField(primary_key=True)
    estudiante = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tiempos')
    etapa = models.ForeignKey(Etapas, on_delete=models.CASCADE, related_name='tiempos')
    tiempo = models.CharField(max_length=8, help_text="Tiempo invertido en la etapa")
    fecha_completada = models.DateTimeField(auto_now_add=True)
    logro = models.PositiveIntegerField(help_text="Porcentaje de logro alcanzado en la etapa")

    def __str__(self):
        return f"{self.estudiante.username} - {self.etapa.nombre} - {self.tiempo} - {self.logro}%"
