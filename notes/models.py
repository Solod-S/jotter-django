from django.conf import settings
from django.db import models

# Create your models here.


class Category(models.Model):
    # Категория группирует заметки пользователя по смыслу, например "Работа".
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="note_categories",
    )
    # Название показывается пользователю, slug нужен для коротких URL и поиска.
    name = models.CharField(max_length=256)
    slug = models.SlugField(max_length=256)

    class Meta:
        verbose_name_plural = "categories"
        unique_together = ("owner", "slug")

    def __str__(self):
        return self.name


class Tag(models.Model):
    # Тег помогает помечать заметки дополнительными признаками.
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="note_tags",
    )
    # Название видно в интерфейсе, slug хранит URL-friendly вариант названия.
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=150)

    class Meta:
        unique_together = ("owner", "slug")

    def __str__(self):
        return self.name


class Note(models.Model):
    # Основная модель заметки: текст, владелец, категория, теги и состояние.
    class Status(models.TextChoices):
        # TextChoices ограничивает список допустимых статусов заметки.
        DRAFT = "draft", "Draft"
        ACTIVE = "active", "Active"
        COMPLETED = "completed", "Completed"
        ARCHIVED = "archived", "Archived"

    # owner связывает заметку с пользователем, которому она принадлежит.
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notes",
    )
    # title - короткое название заметки, content - полный текст заметки.
    title = models.CharField(max_length=256)
    content = models.TextField()
    # Одна заметка может быть в одной категории; категорию можно не выбирать.
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="notes",
    )
    # У заметки может быть несколько тегов, и один тег может быть у многих заметок.
    tags = models.ManyToManyField(Tag, blank=True, related_name="notes")
    # status хранит текущее состояние заметки из списка Status.
    status = models.CharField(
        max_length=100, choices=Status.choices, default=Status.DRAFT)
    # is_pinned отмечает закрепленные заметки, is_archived скрывает архивные.
    is_pinned = models.BooleanField(default=False)
    is_archived = models.BooleanField(default=False)

    def __str__(self):
        return self.title


# py - 3.11 - m pipenv run python manage.py makemigrations
# py - 3.11 -m pipenv run python manage.py migrate
