# Generated by Django 3.1.5 on 2021-01-26 00:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todomaker', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='todolist',
            name='created',
            field=models.DateTimeField(default='2021-01-26 00:06:46'),
        ),
    ]