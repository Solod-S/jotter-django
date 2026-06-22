from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from .models import Category, Note, Tag


def index(request):
    context = {}
    if request.user.is_authenticated:
        notes = Note.objects.filter(owner=request.user).order_by("-id")
        context = {
            "recent_notes": notes[:3],
            "notes_count": notes.count(),
        }
    return render(request, "home/index.html", context)


def about(request):
    return render(request, "about/index.html")


@login_required
def notes_list(request):
    notes = Note.objects.filter(owner=request.user)
    tags = Tag.objects.filter(owner=request.user)
    categories = Category.objects.filter(owner=request.user)
    return render(
        request,
        "notes/notes_list.html",
        {"notes": notes, "tags": tags, "categories": categories},
    )


@login_required
def note_create(request):
    # TODO: Implement note creation
    from django.http import HttpResponse

    return HttpResponse("Note create — coming soon")


@login_required
def note_detail(request, pk):
    # TODO: Implement note detail view
    from django.http import HttpResponse

    return HttpResponse(f"Note detail — pk={pk}")
