from django.contrib import admin
from .models import OA, Niveles, Etapas, Pregunta, IndicadoresEvaluacion, TerminosPareados, AvanceEstudiantes
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Profile

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'get_full_name', 'get_email', 'role')
    list_filter = ('role',)
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'user__email')
    ordering = ('user',)
    actions = ['make_teacher', 'make_admin']
    
    def make_teacher(self, request, queryset):
        queryset.update(role='teacher')
        self.message_user(request, "Usuarios seleccionados ahora son profesores.")
    make_teacher.short_description = "Cambiar el rol de los seleccionados a profesor"
    
    def make_admin(self, request, queryset):
        queryset.update(role='admin')
        self.message_user(request, "Usuarios seleccionados ahora son administradores.")
    make_admin.short_description = "Cambiar el rol de los seleccionados a administrador"

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"
    get_full_name.short_description = 'Nombre Completo'

    def get_email(self, obj):
        return obj.user.email
    get_email.short_description = 'Correo'

class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Perfiles'

class UserAdmin(BaseUserAdmin):
    inlines = (ProfileInline,)

admin.site.unregister(User)
admin.site.register(User, UserAdmin)

@admin.register(OA)
class OAAdmin(admin.ModelAdmin):
    list_display = ('id_OA', 'OA', 'descripcion')
    search_fields = ('OA', 'descripcion')

@admin.register(IndicadoresEvaluacion)
class IndicadoresEvaluacionAdmin(admin.ModelAdmin):
    list_display = ('id_indicador', 'id_OA', 'descripcion')
    search_fields = ('descripcion', 'contenido')
    list_filter = ('id_OA',)
    autocomplete_fields = ['id_OA']


class EtapasInline(admin.TabularInline):  # Me deja poner las etapas al crear un nivel
    model = Etapas
    fk_name = 'id_nivel' 
    extra = 0
    autocomplete_fields = ['OA']
    fields = ('OA', 'nombre', 'descripcion', 'componente', 'posicion_x', 'posicion_y')


@admin.register(Niveles)
class NivelesAdmin(admin.ModelAdmin):
    list_display = ('id_nivel', 'nombre', 'OA')
    search_fields = ('id_nivel', 'nombre')
    list_filter = ('OA',)
    autocomplete_fields = ['OA']
    inlines = [EtapasInline]  # Incluimos el inline de Etapas


@admin.register(Etapas)
class EtapasAdmin(admin.ModelAdmin):
    list_display = ('id_etapa', 'nombre', 'id_nivel', 'OA', 'completado')
    search_fields = ('nombre',)
    list_filter = ('id_nivel', 'OA', 'completado')
    autocomplete_fields = ['id_nivel', 'OA']

@admin.register(Pregunta)
class PreguntaAdmin(admin.ModelAdmin):
    list_display = ('id_pregunta', 'id_etapa', 'tipo', 'dificultad', 'habilidad')
    search_fields = ('contenido',)
    list_filter = ('tipo', 'dificultad', 'habilidad')
    autocomplete_fields = ['id_etapa']

@admin.register(TerminosPareados)
class TerminosPareadosAdmin(admin.ModelAdmin):
    list_display = ('id_termino', 'uso', 'concepto', 'definicion')
    search_fields = ('concepto', 'definicion')


@admin.register(AvanceEstudiantes)
class AvanceEstudiantesAdmin(admin.ModelAdmin):
    list_display = ('id', 'estudiante', 'etapa', 'tiempo', 'fecha_completada', 'logro')
    search_fields = ('estudiante', 'etapa')