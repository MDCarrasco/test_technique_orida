from django.urls import include, path
from . import views

app_name = 'todomaker'
urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
]

