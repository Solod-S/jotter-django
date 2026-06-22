# AGENTS.md

## Project instructions

This project has detailed workspace rules in the `.clinerules/` directory.

Before planning, editing, running commands, or making implementation decisions, read and follow the relevant files from:

```txt
.clinerules/
├─ DESIGN.md
├─ DJANGO-ENVIRONMENT.md
└─ PRODUCT.md
```

## Required rule files

Always read these files before working on the project:

```txt
.clinerules/PRODUCT.md
.clinerules/DJANGO-ENVIRONMENT.md
```

Read this file before UI, layout, CSS, templates, visual, or design-related work:

```txt
.clinerules/DESIGN.md
```

## Rule priority

Use this priority order:

1. User's current request
2. `AGENTS.md`
3. `.clinerules/PRODUCT.md`
4. `.clinerules/DJANGO-ENVIRONMENT.md`
5. `.clinerules/DESIGN.md`
6. Existing project code and conventions

If instructions conflict, stop and ask the user before making changes.

## Important environment rule

This is a Django project on Windows PowerShell.

Do not assume Linux/bash commands.

Do not use global Python directly.

Before running any Django command, read:

```txt
.clinerules/DJANGO-ENVIRONMENT.md
```

The project must be run through Pipenv with Python 3.11.

Use this command pattern:

```bash
py -3.11 -m pipenv run python manage.py <command>
```

Development server:

```bash
py -3.11 -m pipenv run python manage.py runserver
```

Do not use:

```bash
python manage.py runserver
python manage.py migrate
python manage.py <command>
```

Do not use Python 3.14 or another global Python version.

## Working process

Before coding:

1. Read `.clinerules/PRODUCT.md`
2. Read `.clinerules/DJANGO-ENVIRONMENT.md`
3. Read `.clinerules/DESIGN.md` if the task touches UI/design/templates/styles
4. Inspect the existing code
5. Make a short plan
6. Then implement changes

Do not invent requirements that are not present in the user's request or in the `.clinerules/` files.
