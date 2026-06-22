# Гайд: модели, миграции и админка Django

## 1. Создать модель

Пример простой модели в `notes/models.py`:

```python
from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120)

    def __str__(self):
        return self.name
```

После изменения `models.py` база данных еще не меняется. Django сначала нужно создать миграцию.

## 2. Создать миграцию

```powershell
py -3.11 -m pipenv run python manage.py makemigrations
```

Эта команда создает файл миграции в папке приложения, например:

```text
notes/migrations/0001_initial.py
```

## 3. Применить миграцию к базе

```powershell
py -3.11 -m pipenv run python manage.py migrate
```

После этой команды таблицы реально появляются в базе данных.

## 4. Добавить модель в админку

Чтобы модель появилась в `/admin/`, ее нужно зарегистрировать в `notes/admin.py`:

```python
from django.contrib import admin

from .models import Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
```

## 5. Создать администратора

Если суперпользователя еще нет:

```powershell
py -3.11 -m pipenv run python manage.py createsuperuser
```

Введи username, email и пароль.

## 6. Запустить сервер

```powershell
py -3.11 -m pipenv run python manage.py runserver
```

Открой в браузере:

```text
http://127.0.0.1:8000/admin/
```

Войди под суперпользователем. Зарегистрированные модели появятся в списке приложений.

## Короткая памятка

```powershell
py -3.11 -m pipenv run python manage.py makemigrations
py -3.11 -m pipenv run python manage.py migrate
py -3.11 -m pipenv run python manage.py createsuperuser
py -3.11 -m pipenv run python manage.py runserver
```

Главное правило:

```text
models.py меняет описание данных
makemigrations создает файл миграции
migrate применяет миграцию к базе
admin.py подключает модель к админке
```
