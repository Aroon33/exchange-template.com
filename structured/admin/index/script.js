import { CONFIG } from "../config.js";


/* =========================
   ログアウト処理
========================= */
async function doLogout() {
  try {
    await fetch(CONFIG.API_BASE_URL + "/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } finally {
    window.location.href = "../login.html";
  }
}

/* =========================
   API GET
========================= */
async function apiGet(path) {
  const res = await fetch(CONFIG.API_BASE_URL + path, { credentials: "include" });

  if (res.status === 401) {
    // 認証切れ
    doLogout();
    throw new Error("unauthorized");
  }

  const txt = await res.text();
  if (!res.ok) throw new Error(txt);
  return JSON.parse(txt);
}

/* =========================
   ダッシュボード初期化
========================= */
function initDates() {
  const fromInput = document.getElementById("from-date");
  const toInput   = document.getElementById("to-date");

  // ダッシュボード以外では何もしない
  if (!fromInput || !toInput) return;

  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 30);

  fromInput.value = from.toISOString().slice(0, 10);
  toInput.value   = to.toISOString().slice(0, 10);
}

/* =========================
   ダッシュボードデータ取得
========================= */
async function loadDashboard() {
  const fromInput = document.getElementById("from-date");
  const toInput   = document.getElementById("to-date");

  // ダッシュボード以外では実行しない
  if (!fromInput || !toInput) return;

  const data = await apiGet(
    `/admin/dashboard?from=${fromInput.value}&to=${toInput.value}`
  );

  // メイン統計（存在チェック付き）
  setText("d-total-users",      data.totalUsers);
  setText("d-total-balance",    data.totalBalance);
  setText("d-new-users",        data.newUsers);
  setText("d-deposit-sum",      data.depositSum);
  setText("d-withdraw-sum",     data.withdrawSum);

  // PENDING counts
  setText("d-deposit-pending",  data.pendingDeposits);
  setText("d-withdraw-pending", data.pendingWithdraws);
  setText("d-kyc-pending",      data.pendingKyc);
  setText("d-ticket-pending",   data.openTickets);

  setText("dashboard-message", "最新情報を取得しました。");
}

/* =========================
   ユーティリティ
========================= */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

/* =========================
   初期化（DOM 読み込み後）
========================= */
document.addEventListener("DOMContentLoaded", () => {
  initDates();
  loadDashboard();

  const refreshBtn = document.getElementById("btn-refresh");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", loadDashboard);
  }
});
