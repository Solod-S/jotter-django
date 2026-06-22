from django.contrib.auth import login
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.shortcuts import redirect, render


def login_view(request):
    if request.method == "POST":
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            login(request, form.get_user())
            return redirect("notes:notes_list")
    else:
        form = AuthenticationForm()
    return render(request, "registration/login.html", {"form": form})


def signup_view(request):
    if request.method == "POST":
        form = UserCreationForm(data=request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect("notes:notes_list")
    else:
        form = UserCreationForm()
    return render(request, "registration/signup.html", {"form": form})
