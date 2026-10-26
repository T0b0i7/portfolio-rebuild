/* Theme bootstrap — runs before first paint.
 * Served as a static file instead of an inline <script> so browser extensions
 * (reCAPTCHA, ad blockers, script rewriters) cannot desync React's hydration.
 * Keep the storage key in sync with components/theme-toggle.tsx.
 */
(function () {
  try {
    var mode = localStorage.getItem("theme") || "system";
    var dark =
      mode === "dark" ||
      (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    var root = document.documentElement;
    if (dark) root.classList.add("dark");
    root.style.colorScheme = dark ? "dark" : "light";
  } catch (error) {
    /* private mode or blocked storage: fall back to the CSS default */
  }
})();
