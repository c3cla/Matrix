# Generated by Django 5.0.6 on 2024-11-03 22:33

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='OA',
            fields=[
                ('id_OA', models.AutoField(primary_key=True, serialize=False)),
                ('OA', models.CharField(max_length=255)),
                ('descripcion', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='TerminosPareados',
            fields=[
                ('id_termino', models.AutoField(primary_key=True, serialize=False)),
                ('concepto', models.CharField(max_length=255)),
                ('definicion', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Niveles',
            fields=[
                ('id_nivel', models.CharField(max_length=10, primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=255)),
                ('OA', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.oa')),
            ],
        ),
        migrations.CreateModel(
            name='IndicadoresEvaluacion',
            fields=[
                ('id_indicador', models.AutoField(primary_key=True, serialize=False)),
                ('descripcion', models.TextField()),
                ('contenido', models.TextField()),
                ('id_OA', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.oa')),
            ],
        ),
        migrations.CreateModel(
            name='Etapas',
            fields=[
                ('id_etapa', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=255)),
                ('descripcion', models.TextField()),
                ('completado', models.BooleanField(default=False)),
                ('posicion_x', models.IntegerField()),
                ('posicion_y', models.IntegerField()),
                ('id_nivel', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.niveles')),
                ('OA', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.oa')),
            ],
        ),
        migrations.CreateModel(
            name='Pregunta',
            fields=[
                ('id_pregunta', models.AutoField(primary_key=True, serialize=False)),
                ('contenido', models.TextField()),
                ('tipo', models.CharField(max_length=50)),
                ('dificultad', models.CharField(max_length=50)),
                ('habilidad', models.CharField(max_length=50)),
                ('configuracion', models.JSONField(blank=True, null=True)),
                ('id_etapa', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.etapas')),
            ],
        ),
    ]