from django.db import models

# Create your models here.

class Todo(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField()
    completed = models.BooleanField(default=False)

    def _str_(self):
        return self.title

class Files(models.Model):
    file = models.FileField(upload_to='origin/')

    def __str__(self):
        return self.file