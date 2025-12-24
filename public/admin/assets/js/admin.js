/**
 * =====================================================
 * Admin Sidebar Controller
 * =====================================================
 * HTML基準：
 *  - .sidebar
 *  - .sidebar-overlay
 *  - .sidebar-toggle
 *  - .nav-link
 */

/* open / close toggle */
window.toggleSidebar = function () {
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.querySelector(".sidebar-overlay");

  if (!sidebar || !overlay) return;

  sidebar.classList.toggle("open");
  overlay.classList.toggle("show");
  document.body.classList.toggle("sidebar-open");
};

/* force close */
window.closeSidebar = function () {
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.querySelector(".sidebar-overlay");

  if (!sidebar || !overlay) return;

  sidebar.classList.remove("open");
  overlay.classList.remove("show");
  document.body.classList.remove("sidebar-open");
};

/* nav click -> close sidebar (mobile only) */
document.addEventListener("click", function (e) {
  const link = e.target.closest(".nav-link");
  if (!link) return;

  if (window.innerWidth <= 640) {
    window.closeSidebar();
  }
});

/* ESC key -> close */
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    window.closeSidebar();
  }
});
