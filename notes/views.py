import json

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.utils.text import slugify
from django.views.decorators.http import require_http_methods

from .forms import NoteForm
from .models import Category, Note, Tag


def index(request):
    context = {}
    if request.user.is_authenticated:
        notes = (
            Note.objects.filter(owner=request.user)
            .select_related("category")
            .prefetch_related("tags")
            .order_by("-id")
        )
        context = {
            "recent_notes": notes[:3],
            "notes_count": notes.count(),
        }
    return render(request, "home/index.html", context)


def about(request):
    return render(request, "about/index.html")


@login_required
def notes_list(request):
    notes = (
        Note.objects.filter(owner=request.user)
        .select_related("category")
        .prefetch_related("tags")
    )
    tags = Tag.objects.filter(owner=request.user)
    categories = Category.objects.filter(owner=request.user)
    return render(
        request,
        "notes/notes_list.html",
        {"notes": notes, "tags": tags, "categories": categories},
    )


@login_required
def note_create(request):
    form = NoteForm(request.POST or None, user=request.user)
    if request.method == "POST" and form.is_valid():
        note = form.save(commit=False)
        note.owner = request.user
        note.save()
        form.save_m2m()
        form.save_new_tags(note)
        return redirect("notes:note_detail", pk=note.pk)

    return render(request, "notes/note_form.html", {"form": form, "action": "create"})


@login_required
def note_detail(request, pk):
    note = get_object_or_404(Note, pk=pk, owner=request.user)
    return render(request, "notes/note_detail.html", {"note": note})


@login_required
def note_edit(request, pk):
    note = get_object_or_404(Note, pk=pk, owner=request.user)
    form = NoteForm(request.POST or None, instance=note, user=request.user)
    if request.method == "POST" and form.is_valid():
        note = form.save()
        form.save_new_tags(note)
        return redirect("notes:note_detail", pk=note.pk)

    return render(request, "notes/note_form.html", {"form": form, "action": "edit"})


@login_required
@require_http_methods(["GET", "POST"])
def note_delete(request, pk):
    note = get_object_or_404(Note, pk=pk, owner=request.user)

    if request.method == "POST":
        note.delete()
        return redirect("notes:notes_list")

    return render(request, "notes/note_confirm_delete.html", {"note": note})


@login_required
@require_http_methods(["GET", "POST"])
def tags_api(request):
    if request.method == "GET":
        tags = Tag.objects.filter(owner=request.user).order_by("name")
        return JsonResponse(
            {"tags": [{"id": tag.pk, "name": tag.name} for tag in tags]}
        )

    try:
        payload = json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Couldn't read tag data."}, status=400)

    name = str(payload.get("name", "")).strip()

    if not name:
        return JsonResponse({"error": "Tag name can't be empty."}, status=400)

    if len(name) > 30:
        return JsonResponse(
            {"error": "Tag names must be 30 characters or fewer."},
            status=400,
        )

    slug = slugify(name, allow_unicode=True) or name.casefold().replace(" ", "-")
    tag, _created = Tag.objects.get_or_create(
        owner=request.user,
        slug=slug,
        defaults={"name": name},
    )

    return JsonResponse({"tag": {"id": tag.pk, "name": tag.name}}, status=201)
