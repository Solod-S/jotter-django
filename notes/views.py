from django.shortcuts import render
from .models import Note, Tag, Category
# Create your views here.


def index(request):
    return render(request, "home/index.html")


def about(request):
    return render(request, "about/index.html")


def notes_list(request):
    notes = Note.objects.all()
    tags = Tag.objects.all()
    categories = Category.objects.all()
    return render(request, "notes/notes_list.html", {
        "notes": notes,
        "tags": tags,
        "categories": categories
    })


def note_create(request):
    # TODO: Implement note creation
    from django.http import HttpResponse
    return HttpResponse("Note create — coming soon")


def note_detail(request, pk):
    # TODO: Implement note detail view
    from django.http import HttpResponse
    return HttpResponse(f"Note detail — pk={pk}")
