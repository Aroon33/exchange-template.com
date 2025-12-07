/* 共通ヘッダー読み込み */
document.addEventListener("DOMContentLoaded", async () => {
  const headerHolder = document.getElementById("header");
  if (!headerHolder) return;

  // 共通ヘッダーを読み込む
  const html = await fetch("common-header.html").then(res => res.text());
  headerHolder.innerHTML = html;

  // ログイン検知
  updateHeaderUserState();

  // スマホメニュー
  window.toggleMenu = function () {
    document.getElementById("mobileNav").classList.toggle("show");
  };
});

/* ログイン状態反映 */
async function updateHeaderUserState() {
  const actions = document.getElementById("header-actions");
  if (!actions) return;

  try {
    const res = await fetch("https://api.exchange-template.com/auth/me", {
      credentials: "include"
    });
    if (!res.ok) return;

    const data = await res.json();
    const user = data.user || data;

    actions.innerHTML = `
      <a href="mypage.html" class="btn btn-outline btn-sm">${user.name} さん</a>
      <a href="#" id="logout-btn" class="btn btn-primary btn-sm">ログアウト</a>
    `;

    document.getElementById("logout-btn").addEventListener("click", async () => {
      await fetch("https://api.exchange-template.com/auth/logout", {
        method: "POST",
        credentials: "include"
      });
      location.href = "login.html";
    });

  } catch (e) {
    // 未ログイン時は何もしない
  }
}
