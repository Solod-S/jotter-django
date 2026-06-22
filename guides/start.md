# Стартовый Django-проект через Pipenv и `.venv`

Инструкция описывает создание Django-проекта с нуля в отдельной виртуальной среде `.venv` внутри папки проекта.

Используемый стек:

- Windows
- VS Code
- Python 3.11
- Pipenv
- Django 4.0.8
- django-tastypie

> Важно: для `django==4.0.8` лучше использовать Python 3.11 или ниже. На Python 3.14 Django 4.0.8 падает с ошибкой `ModuleNotFoundError: No module named 'cgi'`, потому что модуль `cgi` удален из новых версий Python.

---

## 1. Создать папку проекта

Пример:

```powershell
cd C:\Users\Sergey\Documents\test
mkdir jotter-django
cd jotter-django
```

Проверить текущую папку:

```powershell
pwd
```

Ожидаемый путь:

```text
C:\Users\Sergey\Documents\test\jotter-django
```

---

## 2. Проверить, что Python 3.11 установлен

```powershell
py -0p
```

В списке должен быть Python 3.11, например:

```text
-3.11-64    C:\Users\Sergey\AppData\Local\Programs\Python\Python311\python.exe
```

Если Python 3.11 есть, можно использовать его для виртуального окружения проекта.

---

## 3. Очистить папку от старых файлов окружения

Если проект создается с нуля, можно удалить старые следы Pipenv и `.venv`:

```powershell
Remove-Item .\.venv -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item .\Pipfile -Force -ErrorAction SilentlyContinue
Remove-Item .\Pipfile.lock -Force -ErrorAction SilentlyContinue
```

---

## 4. Включить создание `.venv` внутри проекта

В текущем терминале выполнить:

```powershell
$env:PIPENV_VENV_IN_PROJECT="1"
```

Проверить:

```powershell
echo $env:PIPENV_VENV_IN_PROJECT
```

Ожидаемый результат:

```text
1
```

Это нужно, чтобы Pipenv создал виртуальное окружение прямо внутри проекта:

```text
jotter-django/.venv
```

---

## 5. Установить Pipenv для Python 3.11

```powershell
py -3.11 -m pip install --user pipenv
```

Эта команда устанавливает сам инструмент `pipenv`. Это не установка пакетов проекта.

---

## 6. Создать `.venv` на Python 3.11 и установить Django

```powershell
py -3.11 -m pipenv --python 3.11 install django==4.0.8
```

После команды в проекте должны появиться:

```text
.venv/
Pipfile
Pipfile.lock
```

Проверить путь к виртуальной среде:

```powershell
py -3.11 -m pipenv --venv
```

Ожидаемый результат:

```text
C:\Users\Sergey\Documents\test\jotter-django\.venv
```

---

## 7. Установить django-tastypie

```powershell
py -3.11 -m pipenv install django-tastypie
```

---

## 8. Проверить версии внутри окружения

```powershell
py -3.11 -m pipenv run python --version
py -3.11 -m pipenv run django-admin --version
```

Ожидаемо:

```text
Python 3.11.x
4.0.8
```

---

## 9. Создать Django-проект

В папке `jotter-django` выполнить:

```powershell
py -3.11 -m pipenv run django-admin startproject base .
```

Точка в конце обязательна:

```text
.
```

Она означает: создать Django-проект прямо в текущей папке, без лишней вложенной директории.

После этого структура будет примерно такая:

```text
jotter-django/
├── .venv/
├── .vscode/
├── .gitignore
├── Pipfile
├── Pipfile.lock
├── manage.py
└── base/
    ├── __init__.py
    ├── asgi.py
    ├── settings.py
    ├── urls.py
    └── wsgi.py
```

---

## 10. Выполнить миграции

```powershell
py -3.11 -m pipenv run python manage.py migrate
```

После этого появится файл базы данных SQLite:

```text
db.sqlite3
```

---

## 11. Запустить сервер

```powershell
py -3.11 -m pipenv run python manage.py runserver
```

Открыть в браузере:

```text
http://127.0.0.1:8000/
```

Если открылась стартовая страница Django, проект запущен правильно.

---

## 12. Создать приложение, например `notes`

```powershell
py -3.11 -m pipenv run python manage.py startapp notes
```

Структура станет такой:

```text
jotter-django/
├── manage.py
├── base/
├── notes/
│   ├── migrations/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   └── views.py
├── Pipfile
├── Pipfile.lock
└── .venv/
```

---

## 13. Подключить приложение и tastypie

Открыть файл:

```text
base/settings.py
```

Найти список `INSTALLED_APPS` и добавить туда `tastypie` и `notes`:

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'tastypie',
    'notes.apps.NotesConfig'
]
```

---

## 14. Создать суперпользователя

```powershell
py -3.11 -m pipenv run python manage.py createsuperuser
```

Потом снова запустить сервер:

```powershell
py -3.11 -m pipenv run python manage.py runserver
```

Админка будет доступна по адресу:

```text
http://127.0.0.1:8000/admin/
```

---

# Как запускать проект в будущем

Например, ты вернулся к проекту через 3 дня.

## Вариант 1. Запуск без активации окружения

Перейти в папку проекта:

```powershell
cd C:\Users\Sergey\Documents\test\jotter-django
```

Запустить сервер:

```powershell
py -3.11 -m pipenv run python manage.py runserver
```

Это самый надежный вариант, потому что команда явно запускается через Pipenv-окружение проекта.

---

## Вариант 2. Войти в виртуальное окружение и работать внутри него

Перейти в папку проекта:

```powershell
cd C:\Users\Sergey\Documents\test\jotter-django
```

Активировать shell Pipenv:

```powershell
py -3.11 -m pipenv shell
```

После этого команды можно писать короче:

```powershell
python --version
django-admin --version
python manage.py runserver
```

Внутри окружения `python --version` должен показать:

```text
Python 3.11.x
```

Чтобы выйти из окружения:

```powershell
exit
```

---

# Как добавлять новые пакеты в проект

Новые зависимости нужно ставить через Pipenv из папки проекта.

Пример установки пакета:

```powershell
cd C:\Users\Sergey\Documents\test\jotter-django
py -3.11 -m pipenv install package-name
```

Например:

```powershell
py -3.11 -m pipenv install django-debug-toolbar
```

Pipenv сделает сразу несколько вещей:

1. установит пакет в `.venv`;
2. добавит пакет в `Pipfile`;
3. обновит `Pipfile.lock`.

---

## Как добавлять dev-зависимости

Если пакет нужен только для разработки, ставить его лучше с флагом `--dev`.

Например:

```powershell
py -3.11 -m pipenv install --dev black
py -3.11 -m pipenv install --dev flake8
```

Такие пакеты попадут в dev-секцию `Pipfile`.

---

## Как удалить пакет

```powershell
py -3.11 -m pipenv uninstall package-name
```

Например:

```powershell
py -3.11 -m pipenv uninstall django-debug-toolbar
```

---

## Как посмотреть установленные пакеты

```powershell
py -3.11 -m pipenv graph
```

---

## Как восстановить проект после скачивания из GitHub

Обычно в GitHub не загружают `.venv`, но загружают:

```text
Pipfile
Pipfile.lock
```

После клонирования проекта нужно выполнить:

```powershell
cd путь\к\проекту
$env:PIPENV_VENV_IN_PROJECT="1"
py -3.11 -m pipenv sync
```

Если нужно установить и dev-зависимости:

```powershell
py -3.11 -m pipenv sync --dev
```

---

# Что добавить в `.gitignore`

В `.gitignore` желательно добавить:

```gitignore
.venv/
db.sqlite3
__pycache__/
*.pyc
.env
```

`Pipfile` и `Pipfile.lock` игнорировать не нужно. Их надо хранить в репозитории.

---

# Полная короткая команда с нуля

```powershell
cd C:\Users\Sergey\Documents\test
mkdir jotter-django
cd jotter-django

Remove-Item .\.venv -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item .\Pipfile -Force -ErrorAction SilentlyContinue
Remove-Item .\Pipfile.lock -Force -ErrorAction SilentlyContinue

$env:PIPENV_VENV_IN_PROJECT="1"

py -3.11 -m pip install --user pipenv

py -3.11 -m pipenv --python 3.11 install django==4.0.8
py -3.11 -m pipenv install django-tastypie

py -3.11 -m pipenv run python --version
py -3.11 -m pipenv run django-admin --version

py -3.11 -m pipenv run django-admin startproject base .
py -3.11 -m pipenv run python manage.py migrate
py -3.11 -m pipenv run python manage.py runserver
```

---

# Рабочий ежедневный минимум

Когда проект уже создан:

```powershell
cd C:\Users\Sergey\Documents\test\jotter-django
py -3.11 -m pipenv run python manage.py runserver
```

Если нужно добавить пакет:

```powershell
cd C:\Users\Sergey\Documents\test\jotter-django
py -3.11 -m pipenv install package-name
```

Если нужно создать новое приложение:

```powershell
cd C:\Users\Sergey\Documents\test\jotter-django
py -3.11 -m pipenv run python manage.py startapp app_name
```
