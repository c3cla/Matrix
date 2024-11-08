# Generated by Django 3.2 on 2024-10-18 18:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_alter_profile_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='Colegio',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=100, unique=True)),
                ('direccion', models.CharField(max_length=255)),
                ('ciudad', models.CharField(max_length=100)),
            ],
        ),
        migrations.AddField(
            model_name='profile',
            name='rut',
            field=models.CharField(blank=True, max_length=12, null=True, unique=True),
        ),
        migrations.CreateModel(
            name='CursoColegio',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('nivel', models.CharField(max_length=50)),
                ('letra', models.CharField(max_length=1)),
                ('colegio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cursos', to='api.colegio')),
            ],
        ),
        migrations.AddField(
            model_name='profile',
            name='colegio',
            field=models.ForeignKey(blank=True, help_text='Solo aplicable si el usuario es profesor', null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='profesores', to='api.colegio'),
        ),
        migrations.AddField(
            model_name='profile',
            name='curso',
            field=models.ForeignKey(blank=True, help_text='Aplicable si el usuario es alumno', null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='alumnos', to='api.cursocolegio'),
        ),
    ]
