import { getMe, logout } from "./api/auth.api.js";

function getActionsRoot(root = document) {
  return root.querySelector(".header-actions");
}

function renderLoggedIn(actions, me) {
  // ★ getMe() の戻り値を正しく扱う
  const user = me.user ?? me;

  actions.innerHTML = `
    <a href="/mypage.html" class="btn btn-outline btn-sm">
      ${user.name} さん
    </a>
    <button id="logout-btn" class="btn btn-primary btn-sm">
      ログアウト
    </button>
  `;

  actions.querySelector("#logout-btn").onclick = async () => {
    await logout();
    localStorage.removeItem("tmp_user");
    location.href = "/login.html";
  };
}

function renderLoggedOut(actions) {
  actions.innerHTML = `
    <a href="/login.html" class="btn btn-primary btn-sm">
      ログイン
    </a>
  `;
}

export async function updateHeaderUserState(root = document) {
  const actions = getActionsRoot(root);
  if (!actions) return;

  try {
    const me = await getMe();   // 認証 & ユーザー取得
    renderLoggedIn(actions, me);
  } catch {
    renderLoggedOut(actions);
  }
}

// ページ読み込み時に必ず実行
document.addEventListener("DOMContentLoaded", () => {
  updateHeaderUserState();
});
