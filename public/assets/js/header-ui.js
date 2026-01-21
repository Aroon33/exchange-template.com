export function initHeaderUI() {
  document.addEventListener("click", (e) => {
    const toggle = e.target.closest("#menu-toggle");
    const overlay = e.target.closest("#drawer-overlay");

    if (toggle) {
      const isOpen = document.body.classList.toggle("drawer-open");
      toggle.setAttribute("aria-expanded", isOpen);
      return;
    }

    if (overlay) {
      closeDrawer();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDrawer();
    }
  });

  function closeDrawer() {
    document.body.classList.remove("drawer-open");
    const toggle = document.getElementById("menu-toggle");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
    }
  }
}
