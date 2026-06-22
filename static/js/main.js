/**
 * Jotter — minimal client-side JavaScript.
 * Mobile drawer toggle.
 */
(function () {
  "use strict";

  var burger = document.getElementById("burger-btn");
  var drawer = document.getElementById("mobile-drawer");
  var backdrop = document.getElementById("drawer-backdrop");
  var closeButton = document.getElementById("drawer-close");
  var desktopQuery = window.matchMedia("(min-width: 640px)");

  if (!burger || !drawer || !backdrop) {
    return;
  }

  function openDrawer() {
    burger.setAttribute("aria-expanded", "true");
    burger.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    drawer.classList.add("is-open");
    document.body.style.overflow = "hidden";

    var firstLink = drawer.querySelector(".drawer__link");
    if (firstLink) {
      firstLink.focus();
    }
  }

  function closeDrawer() {
    burger.setAttribute("aria-expanded", "false");
    burger.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    drawer.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function toggleDrawer() {
    var isOpen = drawer.classList.contains("is-open");
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }

  burger.addEventListener("click", toggleDrawer);
  backdrop.addEventListener("click", closeDrawer);

  if (closeButton) {
    closeButton.addEventListener("click", function () {
      closeDrawer();
      burger.focus();
    });
  }

  drawer.addEventListener("click", function (event) {
    if (event.target.closest("a")) {
      closeDrawer();
    }
  });

  function handleViewportChange(event) {
    if (event.matches) {
      closeDrawer();
    }
  }

  if (desktopQuery.addEventListener) {
    desktopQuery.addEventListener("change", handleViewportChange);
  } else {
    desktopQuery.addListener(handleViewportChange);
  }

  // Close on Escape
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && drawer.classList.contains("is-open")) {
      closeDrawer();
      burger.focus();
    }
  });

  // Trap focus inside drawer when open
  drawer.addEventListener("keydown", function (event) {
    if (event.key !== "Tab") {
      return;
    }

    var focusableSelector = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ].join(", ");

    var focusableElements = drawer.querySelectorAll(focusableSelector);
    var firstFocusable = focusableElements[0];
    var lastFocusable = focusableElements[focusableElements.length - 1];

    if (!focusableElements.length) {
      return;
    }

    if (event.shiftKey) {
      // Shift+Tab
      if (document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
  });
})();
