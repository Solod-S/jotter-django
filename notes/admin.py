from django.contrib import admin

from .models import Category, Note, Tag


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    # Настройки отображения категорий в админке.
    # list_display задает колонки в общем списке категорий.
    list_display = ("name", "slug", "owner")
    # list_filter добавляет справа фильтр по владельцу категории.
    list_filter = ("owner",)
    # search_fields включает поиск по названию, slug и username владельца.
    search_fields = ("name", "slug", "owner__username")
    # prepopulated_fields автоматически заполняет slug из поля name.
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    # Настройки отображения тегов в админке.
    list_display = ("name", "slug", "owner")
    # Фильтр помогает быстро показать теги конкретного пользователя.
    list_filter = ("owner",)
    # Поиск работает по полям самого тега и связанному пользователю.
    search_fields = ("name", "slug", "owner__username")
    # Slug будет подставляться автоматически при вводе названия.
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    # Настройки отображения заметок в админке.
    # Эти поля будут видны колонками в списке заметок.
    list_display = (
        "title",
        "owner",
        "category",
        "status",
        "is_pinned",
        "is_archived",
    )
    # Фильтры справа помогают отбирать заметки по состоянию и связям.
    list_filter = ("status", "is_pinned", "is_archived", "category", "tags")
    # Поиск ищет заметки по заголовку, тексту и username владельца.
    search_fields = ("title", "content", "owner__username")
    # Удобный виджет для выбора нескольких тегов в ManyToManyField.
    filter_horizontal = ("tags",)
