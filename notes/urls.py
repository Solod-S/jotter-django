from django.urls import path
from . import views

app_name = "notes"

urlpatterns = [
    path('', views.index, name="index"),
    path('about/', views.about, name="about"),
    path('notes/', views.notes_list, name="notes_list"),
    path('notes/create/', views.note_create, name="note_create"),
    path('notes/<int:pk>/', views.note_detail, name="note_detail"),
]
