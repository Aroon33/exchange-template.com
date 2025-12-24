import { getMe, logout } from "./api/auth.api.js";

export async function updateHeaderUserState(root = document) {
  const actions = root.querySelector(".header-actions");
  if (!actions) return;

  try {
    const data = await getMe();
    const user = data.user || data;

    actions.innerHTML = `
      <a href="/mypage.html" class="btn btn-outline btn-sm">
        ${user.name} さん
      </a>
      <button id="logout-btn" class="btn btn-primary btn-sm">
        ログアウト
      </button>
    `;

    root.querySelector("#logout-btn").onclick = async () => {
      await logout();
      location.href = "/login.html";
    };

  } catch {
    // 未ログイン時は何もしない
  }
}



document.addEventListener("DOMContentLoaded", async () => {
  const headerHolder = document.getElementById("header");
  if (!headerHolder) return;

  /* =========================
     ヘッダーHTML読み込み
  ========================= */
  const html = await fetch("/common/header.html").then(res => res.text());
  headerHolder.innerHTML = html;

  /* =========================
     ハンバーガーメニュー（左サイドバー方式）
  ========================= */
  const toggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const overlay = document.getElementById("menu-overlay");
  const closeBtn = document.getElementById("menu-close");

  if (toggle && mobileMenu && overlay) {
    toggle.addEventListener("click", () => {
      mobileMenu.classList.add("open");
      overlay.classList.add("show");
      document.body.style.overflow = "hidden";
    });

    overlay.addEventListener("click", closeMenu);
    closeBtn?.addEventListener("click", closeMenu);
  }

  function closeMenu() {
    mobileMenu.classList.remove("open");
    overlay.classList.remove("show");
    document.body.style.overflow = "";
  }

  /* =========================
     ログイン状態反映
  ========================= */
  updateHeaderUserState(headerHolder);
});

/* =========================
   ログイン状態反映
========================= */
async function updateHeaderUserState(root) {
  const actions = root.querySelector("#header-actions");
  if (!actions) return;

  try {
    const res = await fetch("https://api.exchange-template.com/auth/me", {
      credentials: "include"
    });
    if (!res.ok) return;

    const data = await res.json();
    const user = data.user || data;

    actions.innerHTML = `
      <a href="/mypage.html" class="btn btn-outline btn-sm">${user.name} さん</a>
      <a href="#" id="logout-btn" class="btn btn-primary btn-sm">ログアウト</a>
    `;

    root.querySelector("#logout-btn").addEventListener("click", async () => {
      await fetch("https://api.exchange-template.com/auth/logout", {
        method: "POST",
        credentials: "include"
      });
      location.href = "/login.html";
    });

  } catch (e) {
    // 未ログイン時は何もしない
  }
}
