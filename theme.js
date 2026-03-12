(function () {
  var storageKey = "site-theme";
  var root = document.documentElement;

  function createToggle() {
    var existing = document.querySelector(".theme-toggle");
    if (existing) {
      return existing;
    }

    var toggle = document.createElement("button");
    toggle.className = "theme-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Toggle color theme");
    document.body.appendChild(toggle);
    return toggle;
  }

  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function getPreferredTheme() {
    try {
      var saved = localStorage.getItem(storageKey);
      if (saved === "dark" || saved === "light") {
        return saved;
      }
    } catch (e) {
      // Ignore localStorage errors and fall back to system preference.
    }
    return getSystemTheme();
  }

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    var toggle = document.querySelector(".theme-toggle");
    if (toggle) {
      toggle.setAttribute("aria-pressed", String(theme === "dark"));
      // Use moon/sun symbols that render centered across common system fonts.
      var icon = theme === "dark" ? String.fromCodePoint(0x263C) : String.fromCodePoint(0x1F319);
      toggle.innerHTML = '<span class="theme-icon">' + icon + "</span>";
      toggle.classList.toggle("is-moon", theme !== "dark");
      toggle.setAttribute("title", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(storageKey, theme);
    } catch (e) {
      // Ignore localStorage errors.
    }
  }

  function initThemeToggle() {
    var toggle = createToggle();
    setTheme(getPreferredTheme());

    var lastToggleAt = 0;

    function handleToggle() {
      var now = Date.now();
      // Prevent duplicate toggles when touch and click both fire on mobile.
      if (now - lastToggleAt < 350) {
        return;
      }
      lastToggleAt = now;

      var current = root.getAttribute("data-theme") || "light";
      var next = current === "dark" ? "light" : "dark";
      setTheme(next);
      saveTheme(next);
    }

    toggle.addEventListener("click", handleToggle);

    if (!window.PointerEvent) {
      toggle.addEventListener(
        "touchend",
        function (event) {
          event.preventDefault();
          handleToggle();
        },
        { passive: false }
      );
    }
  }

  document.addEventListener("DOMContentLoaded", initThemeToggle);
})();
