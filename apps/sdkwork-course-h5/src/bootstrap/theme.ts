/**
 * Course H5 theme bootstrap.
 *
 * Applies the `.dark` class from the system color scheme on startup and keeps
 * it in sync while the page is open. The WeChat developer tools simulator
 * fires `matchMedia` change events when its dark-mode toggle is switched
 * after load, so the listener is required for live preview.
 */

const DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)";

function applyInitialTheme(): void {
  document.documentElement.classList.toggle(
    "dark",
    window.matchMedia(DARK_MEDIA_QUERY).matches,
  );
}

export function initCourseH5Theme(): void {
  applyInitialTheme();
  const media = window.matchMedia(DARK_MEDIA_QUERY);
  const onChange = (event: MediaQueryListEvent) => {
    document.documentElement.classList.toggle("dark", event.matches);
  };
  media.addEventListener("change", onChange);
}
