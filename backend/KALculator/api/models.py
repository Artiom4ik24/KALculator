from django.db import models

# Create your models here.
class History(models.Model):
    equation = models.CharField(max_length=1024)
    answer = models.CharField(max_length=1024)
