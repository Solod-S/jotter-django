from django import forms
from django.utils.text import slugify

from .models import Category, Note, Tag


class NoteForm(forms.ModelForm):
    new_tags = forms.CharField(
        required=False,
        widget=forms.HiddenInput(
            attrs={
                "class": "note-form__tag-input",
                "data-new-tags": "true",
            }
        ),
    )

    def __init__(self, *args, user=None, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = user
        self.fields["category"].empty_label = "Select category"

        if user is not None:
            self.fields["category"].queryset = Category.objects.filter(owner=user)
            self.fields["tags"].queryset = Tag.objects.filter(owner=user)
        else:
            self.fields["category"].queryset = Category.objects.none()
            self.fields["tags"].queryset = Tag.objects.none()

    def clean_new_tags(self):
        raw_tags = self.cleaned_data.get("new_tags", "")
        names = []
        seen = set()

        for raw_name in raw_tags.split(","):
            name = raw_name.strip()
            key = name.casefold()

            if not name or key in seen:
                continue

            if len(name) > 30:
                raise forms.ValidationError("Tag names must be 30 characters or fewer.")

            names.append(name)
            seen.add(key)

        return names

    def save_new_tags(self, note):
        if self.user is None:
            return

        for name in self.cleaned_data.get("new_tags", []):
            slug = self._build_tag_slug(name)
            tag, _created = Tag.objects.get_or_create(
                owner=self.user,
                slug=slug,
                defaults={"name": name},
            )
            note.tags.add(tag)

    @staticmethod
    def _build_tag_slug(name):
        slug = slugify(name, allow_unicode=True)
        return slug or name.strip().casefold().replace(" ", "-")

    class Meta:
        model = Note
        fields = ["title", "content", "category", "tags", "status"]
        widgets = {
            "title": forms.TextInput(
                attrs={
                    "placeholder": "Untitled",
                    "class": "note-form__title",
                    "aria-label": "Note title",
                }
            ),
            "content": forms.HiddenInput(),
            "category": forms.Select(attrs={"class": "note-form__select"}),
            "tags": forms.SelectMultiple(
                attrs={
                    "class": "note-form__select note-form__tag-select",
                    "data-tag-select": "true",
                }
            ),
            "status": forms.Select(attrs={"class": "note-form__select"}),
        }
