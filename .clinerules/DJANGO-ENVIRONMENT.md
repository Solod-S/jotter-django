# Django Environment Rule

This workspace contains a Django project on Windows.

The project must be run through Pipenv with Python 3.11.

## Python and Django commands

Always use this pattern for Django commands:

```bash
py -3.11 -m pipenv run python manage.py <command>
```

Correct command to start the development server:

```bash
py -3.11 -m pipenv run python manage.py runserver
```

Correct examples:

```bash
py -3.11 -m pipenv run python manage.py check
py -3.11 -m pipenv run python manage.py migrate
py -3.11 -m pipenv run python manage.py makemigrations
py -3.11 -m pipenv run python manage.py createsuperuser
py -3.11 -m pipenv run python manage.py startapp notes
```

When installing Python packages, use:

```bash
py -3.11 -m pipenv install package_name
```

Do not use global Python directly.

Do not use:

```bash
python manage.py runserver
python manage.py migrate
python manage.py <command>
```

Do not use Python 3.14 or another global Python version for this project.

## Windows PowerShell rules

The terminal is Windows PowerShell, not Linux bash.

Do not use Linux/macOS shell commands such as:

```bash
head
tail
grep
rm -rf
touch
which
```

Use PowerShell-compatible commands instead.

Examples:

```powershell
# Instead of: head -20
Select-Object -First 20

# Instead of: tail -20
Select-Object -Last 20

# Instead of: grep "text"
Select-String "text"

# Instead of: which python
Get-Command python

# Instead of: rm -rf folder
Remove-Item -Recurse -Force folder
```

## Django checks

For local development, use:

```bash
py -3.11 -m pipenv run python manage.py check
```

Do not use `check --deploy` for normal local development unless explicitly asked.

`check --deploy` is intended for production security checks and may show warnings about HTTPS, HSTS, DEBUG, SECRET_KEY, CSRF_COOKIE_SECURE, SESSION_COOKIE_SECURE, and ALLOWED_HOSTS. These warnings do not necessarily mean the local development project is broken.

## Running the server

Prefer running the Django development server in the foreground:

```bash
py -3.11 -m pipenv run python manage.py runserver
```

Do not start multiple background Django servers unless explicitly needed.

Do not use `Start-Process` for `runserver` unless the user specifically asks to run the server in the background.

## Testing local URLs on Windows

When checking local URLs from PowerShell, use either `curl.exe` with Latin ASCII letters:

```powershell
curl.exe -s -o NUL -w "%{http_code}" http://127.0.0.1:8000/notes/
```

Or use PowerShell:

```powershell
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8000/notes/
```

Important: command names must use Latin ASCII characters only. Do not accidentally use Cyrillic letters, for example Cyrillic `с` in `сcurl.exe`.

Correct:

```powershell
curl.exe
```

Incorrect:

```powershell
сcurl.exe
```

The incorrect version starts with a Cyrillic character and will fail in PowerShell.
