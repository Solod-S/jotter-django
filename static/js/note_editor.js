(function () {
  "use strict";

  var editor = document.querySelector("[data-editor]");

  if (!editor) {
    return;
  }

  var surface = editor.querySelector(".html-editor__surface");
  var toolbar = editor.querySelector(".html-editor__toolbar");
  var inputId = surface ? surface.getAttribute("data-input-id") : "";
  var input = inputId ? document.getElementById(inputId) : null;
  var form = editor.closest("form");

  if (!surface || !toolbar || !input || !form) {
    return;
  }

  function isEmptyHtml(html) {
    var text = html
      .replace(/<br\s*\/?>/gi, "")
      .replace(/&nbsp;/gi, " ")
      .replace(/<[^>]*>/g, "")
      .trim();

    return text.length === 0;
  }

  function updateEmptyState() {
    surface.dataset.empty = isEmptyHtml(surface.innerHTML) ? "true" : "false";
  }

  function syncInput() {
    input.value = isEmptyHtml(surface.innerHTML) ? "" : surface.innerHTML;
    updateEmptyState();
  }

  function restoreContent() {
    if (input.value.trim()) {
      surface.innerHTML = input.value;
    }

    updateEmptyState();
  }

  function normalizeBlockValue(value) {
    return value ? "<" + value + ">" : null;
  }

  function runCommand(command, value) {
    surface.focus();

    if (command === "createLink") {
      var href = window.prompt("Link URL");

      if (!href) {
        return;
      }

      document.execCommand(command, false, href);
    } else if (command === "formatBlock") {
      document.execCommand(command, false, normalizeBlockValue(value));
    } else {
      document.execCommand(command, false, value || null);
    }

    syncInput();
    updateToolbarState();
  }

  function updateToolbarState() {
    var buttons = toolbar.querySelectorAll("[data-command]");

    buttons.forEach(function (button) {
      var command = button.getAttribute("data-command");

      if (command === "formatBlock" || command === "createLink" || command === "removeFormat") {
        button.classList.remove("is-active");
        return;
      }

      button.classList.toggle("is-active", document.queryCommandState(command));
    });
  }

  toolbar.addEventListener("click", function (event) {
    var button = event.target.closest("[data-command]");

    if (!button) {
      return;
    }

    runCommand(button.getAttribute("data-command"), button.getAttribute("data-value"));
  });

  surface.addEventListener("input", syncInput);
  surface.addEventListener("keyup", updateToolbarState);
  surface.addEventListener("mouseup", updateToolbarState);

  form.addEventListener("submit", function () {
    syncInput();
  });

  document.addEventListener("selectionchange", function () {
    if (document.activeElement === surface) {
      updateToolbarState();
    }
  });

  restoreContent();
})();

(function () {
  "use strict";

  var picker = document.querySelector("[data-tag-picker]");

  if (!picker) {
    return;
  }

  var select = picker.querySelector("[data-tag-select]");
  var hiddenInput = picker.querySelector("[data-new-tags]");
  var input = picker.querySelector("[data-tag-entry]");
  var list = picker.querySelector("[data-tag-list]");
  var dropdown = picker.querySelector("[data-tag-dropdown]");
  var optionsList = picker.querySelector("[data-tag-options]");
  var loadingState = picker.querySelector("[data-tag-loading]");
  var emptyState = picker.querySelector("[data-tag-empty]");
  var errorState = picker.querySelector("[data-tag-error]");
  var form = picker.closest("form");
  var tagsUrl = picker.getAttribute("data-tags-url");
  var allTags = [];
  var newTags = [];
  var isLoading = false;
  var hasLoadError = false;

  if (!select || !hiddenInput || !input || !list || !dropdown || !optionsList || !form) {
    return;
  }

  picker.classList.add("is-enhanced");
  input.setAttribute("autocomplete", "off");

  function normalizeName(name) {
    return name.trim().replace(/\s+/g, " ");
  }

  function keyFor(name) {
    return normalizeName(name).toLocaleLowerCase();
  }

  function getExistingOptions() {
    return Array.prototype.slice.call(select.options);
  }

  function hydrateFromSelect() {
    allTags = getExistingOptions().map(function (option) {
      return { id: option.value, name: normalizeName(option.textContent) };
    });
  }

  function syncSelectOptions() {
    var selectedValues = getExistingOptions()
      .filter(function (option) {
        return option.selected;
      })
      .map(function (option) {
        return option.value;
      });

    select.replaceChildren();

    allTags.forEach(function (tag) {
      var option = document.createElement("option");
      option.value = String(tag.id);
      option.textContent = tag.name;
      option.selected = selectedValues.indexOf(String(tag.id)) !== -1;
      select.appendChild(option);
    });
  }

  function findExistingOption(name) {
    var key = keyFor(name);

    return getExistingOptions().find(function (option) {
      return keyFor(option.textContent) === key;
    });
  }

  function hasSelectedTag(name) {
    var key = keyFor(name);
    var selectedExisting = getExistingOptions().some(function (option) {
      return option.selected && keyFor(option.textContent) === key;
    });
    var selectedNew = newTags.some(function (tagName) {
      return keyFor(tagName) === key;
    });

    return selectedExisting || selectedNew;
  }

  function getSelectedExistingIds() {
    return getExistingOptions()
      .filter(function (option) {
        return option.selected;
      })
      .map(function (option) {
        return option.value;
      });
  }

  function removeTag(name, value, type) {
    if (type === "existing") {
      var option = getExistingOptions().find(function (candidate) {
        return candidate.value === value;
      });

      if (option) {
        option.selected = false;
      }
    } else {
      var key = keyFor(name);
      newTags = newTags.filter(function (tagName) {
        return keyFor(tagName) !== key;
      });
    }

    renderTags();
  }

  function createChip(name, value, type) {
    var chip = document.createElement("span");
    var label = document.createElement("span");
    var removeButton = document.createElement("button");

    chip.className = "tag-picker__chip";
    label.className = "tag-picker__chip-label";
    label.textContent = name;

    removeButton.type = "button";
    removeButton.className = "tag-picker__remove";
    removeButton.setAttribute("aria-label", "Remove " + name);
    removeButton.textContent = "x";
    removeButton.addEventListener("click", function () {
      removeTag(name, value, type);
    });

    chip.appendChild(label);
    chip.appendChild(removeButton);

    return chip;
  }

  function renderTags() {
    list.replaceChildren();

    getExistingOptions().forEach(function (option) {
      if (option.selected) {
        list.appendChild(createChip(option.textContent, option.value, "existing"));
      }
    });

    newTags.forEach(function (name) {
      list.appendChild(createChip(name, "", "new"));
    });

    syncNewTagsInput();
  }

  function addExistingTag(id) {
    var option = getExistingOptions().find(function (candidate) {
      return candidate.value === String(id);
    });

    if (option && !option.selected) {
      option.selected = true;
      renderTags();
    }
  }

  function addNewTag(name) {
    var cleanName = normalizeName(name);

    if (!cleanName || cleanName.length > 30 || hasSelectedTag(cleanName)) {
      return false;
    }

    var existingOption = findExistingOption(cleanName);

    if (existingOption) {
      existingOption.selected = true;
    } else {
      newTags.push(cleanName);
    }

    renderTags();
    return true;
  }

  function closeDropdown() {
    dropdown.hidden = true;
  }

  function openDropdown() {
    dropdown.hidden = false;
    renderDropdown();
  }

  function syncNewTagsInput() {
    hiddenInput.value = newTags.join(", ");
  }

  function setState(element, visible) {
    if (element) {
      element.hidden = !visible;
    }
  }

  function visibleTags(query) {
    var selectedIds = getSelectedExistingIds();
    var term = keyFor(query || "");

    return allTags.filter(function (tag) {
      var isSelected = selectedIds.indexOf(String(tag.id)) !== -1;
      var matches = !term || keyFor(tag.name).indexOf(term) !== -1;

      return !isSelected && matches;
    });
  }

  function createOptionButton(tag) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "tag-picker__option";
    button.textContent = tag.name;
    button.addEventListener("click", function () {
      addExistingTag(tag.id);
      input.value = "";
      closeDropdown();
      input.focus();
    });

    return button;
  }

  function createTagOnServer(name) {
    var csrfInput = form.querySelector("[name=csrfmiddlewaretoken]");

    if (!tagsUrl || !window.fetch || !csrfInput) {
      return Promise.reject(new Error("No tag endpoint"));
    }

    return window
      .fetch(tagsUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfInput.value,
        },
        body: JSON.stringify({ name: name }),
      })
      .then(function (response) {
        return response.json().then(function (data) {
          if (!response.ok) {
            throw new Error(data.error || "Couldn't create tag.");
          }

          return data.tag;
        });
      });
  }

  function createNewTag(name) {
    var cleanName = normalizeName(name);

    if (!cleanName || cleanName.length > 30 || hasSelectedTag(cleanName)) {
      return;
    }

    createTagOnServer(cleanName)
      .then(function (tag) {
        if (!allTags.some(function (candidate) { return String(candidate.id) === String(tag.id); })) {
          allTags.push(tag);
          allTags.sort(function (a, b) {
            return a.name.localeCompare(b.name);
          });
        }

        syncSelectOptions();
        addExistingTag(tag.id);
        input.value = "";
        closeDropdown();
      })
      .catch(function () {
        addNewTag(cleanName);
        input.value = "";
        closeDropdown();
      });
  }

  function createCreateButton(query) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "tag-picker__option tag-picker__option--create";
    button.textContent = 'Create new tag: "' + normalizeName(query) + '"';
    button.addEventListener("click", function () {
      createNewTag(query);
    });

    return button;
  }

  function renderDropdown() {
    var query = normalizeName(input.value);
    var tags = visibleTags(query);
    var hasExactMatch = allTags.some(function (tag) {
      return keyFor(tag.name) === keyFor(query);
    });

    optionsList.replaceChildren();

    setState(loadingState, isLoading);
    setState(errorState, hasLoadError);
    setState(emptyState, !isLoading && !hasLoadError && !tags.length && !query);

    if (isLoading || hasLoadError) {
      return;
    }

    tags.forEach(function (tag) {
      optionsList.appendChild(createOptionButton(tag));
    });

    if (query && !hasExactMatch && query.length <= 30) {
      optionsList.appendChild(createCreateButton(query));
    }
  }

  function addFromInput() {
    var cleanName = normalizeName(input.value);

    if (!cleanName) {
      return;
    }

    var existingOption = findExistingOption(cleanName);

    if (existingOption) {
      addExistingTag(existingOption.value);
    } else {
      createNewTag(cleanName);
    }

    input.value = "";
  }

  function loadTags() {
    if (!tagsUrl || !window.fetch) {
      hydrateFromSelect();
      renderDropdown();
      return;
    }

    isLoading = true;
    hasLoadError = false;
    renderDropdown();

    window
      .fetch(tagsUrl, { headers: { Accept: "application/json" } })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Couldn't load tags.");
        }

        return response.json();
      })
      .then(function (data) {
        allTags = data.tags || [];
        syncSelectOptions();
      })
      .catch(function () {
        hasLoadError = true;
        hydrateFromSelect();
      })
      .finally(function () {
        isLoading = false;
        renderDropdown();
      });
  }

  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addFromInput();
      closeDropdown();
    }

    if (event.key === "Backspace" && !input.value && newTags.length) {
      newTags.pop();
      renderTags();
    }

    if (event.key === "Escape") {
      closeDropdown();
    }
  });

  input.addEventListener("focus", function () {
    openDropdown();
    loadTags();
  });

  input.addEventListener("input", function () {
    openDropdown();
  });

  select.addEventListener("change", renderTags);

  document.addEventListener("click", function (event) {
    if (!picker.contains(event.target)) {
      closeDropdown();
    }
  });

  form.addEventListener("submit", function () {
    if (input.value.trim()) {
      addNewTag(input.value);
    }

    syncNewTagsInput();
  });

  hydrateFromSelect();
  renderTags();
})();

(function () {
  "use strict";

  var control = document.querySelector("[data-status-control]");

  if (!control) {
    return;
  }

  var select = control.querySelector("select");
  var badge = control.querySelector("[data-status-badge]");
  var help = document.querySelector("[data-status-help]");
  var copy = {
    draft: "Draft notes stay private in your workspace.",
    active: "Active notes are part of your current workspace.",
    completed: "Completed notes stay available for reference.",
    archived: "Archived notes are kept out of your active flow.",
  };

  if (!select || !badge || !help) {
    return;
  }

  function updateStatus() {
    var option = select.options[select.selectedIndex];
    var value = select.value;

    badge.textContent = option ? option.textContent : "";
    badge.dataset.status = value;
    help.textContent = copy[value] || "Choose how this note should be treated.";
  }

  select.addEventListener("change", updateStatus);
  updateStatus();
})();
