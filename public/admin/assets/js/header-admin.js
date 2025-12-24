// header-admin.js
// 管理画面共通：ヘッダー + サイドバー（PC / スマホ対応）

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     Header（スマホ用）
  ========================= */
  const header = document.createElement("header");
  header.className = "admin-header";
  header.innerHTML = `
    <div class="header-left">
      <span class="header-logo">AX</span>
      <span class="header-title">Admin</span>
    </div>
    <button class="hamburger" id="hamburger-btn">☰</button>
  `;
  document.body.prepend(header);

  /* =========================
     Sidebar（★ここでHTMLを書く）
  ========================= */
  const sidebar = document.createElement("aside");
  sidebar.className = "sidebar";
  sidebar.id = "sidebar";
  sidebar.innerHTML = `
    <div class="sidebar-title">メニュー</div>
    <ul class="nav-list">
      <li class="nav-item"><a href="/admin/index.html">🏠 ダッシュボード</a></li>
      <li class="nav-item"><a href="/admin/tickets.html">💬 問い合わせ管理</a></li>
      <li class="nav-item"><a href="/admin/users.html">👥 ユーザー一覧</a></li>
      <li class="nav-item"><a href="/admin/trades.html">📊 取引状況</a></li>
      <li class="nav-item"><a href="/admin/kyc.html">📋 KYC状況</a></li>
      <li class="nav-item"><a href="/admin/deposit.html">➕ 入金申請</a></li>
      <li class="nav-item"><a href="/admin/withdraw.html">➖ 出金申請</a></li>
      <li class="nav-item"><a href="/admin/group.html">🧩 グループ管理</a></li>
      <li class="nav-item"><a href="/admin/settings.html">⚙️ システム設定</a></li>
      <li class="nav-item"><a href="/admin/logout.html">🚪 ログアウト</a></li>
    </ul>
  `;
  document.body.prepend(sidebar);

  /* =========================
     Overlay
  ========================= */
  const overlay = document.createElement("div");
  overlay.className = "sidebar-overlay";
  overlay.id = "sidebar-overlay";
  document.body.appendChild(overlay);

  /* =========================
     Events
  ========================= */
  const hamburger = document.getElementById("hamburger-btn");

  hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    overlay.classList.toggle("show");
  });

  overlay.addEventListener("click", closeSidebar);

  sidebar.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        closeSidebar();
      }
    });
  });

  function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
  }
});
