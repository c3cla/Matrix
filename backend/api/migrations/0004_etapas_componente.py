# Generated by Django 5.0.6 on 2024-11-06 03:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_terminospareados_uso'),
    ]

    operations = [
        migrations.AddField(
            model_name='etapas',
            name='componente',
            field=models.TextField(default='Pelotas'),
            preserve_default=False,
        ),
    ]