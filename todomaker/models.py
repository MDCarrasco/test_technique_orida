import datetime
from django.db import models
from django.utils import timezone

# Create your models here.
class TodoList(models.Model):
    content = models.TextField(blank=True)
    created = models.DateTimeField(default=timezone.now().strftime('%Y-%m-%d %H:%M:%S'))


    class Meta:
        ordering = ["-created"] #ordering by the created field

    def __str__(self) -> str:
        return str(self.content)

    def was_published_recently(self) -> bool:
        return self.created >= timezone.now() - datetime.timedelta(days=1)
