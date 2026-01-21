import { CONFIG } from "../config.js";

const msg = l => {
  const el = document.getElementById("msg");
  el.textContent = l;
  el.style.color = "green";
};
const err = l => {
  const el = document.getElementById("msg");
  el.textContent = l;
  el.style.color = "red";
};

function fmtDate(i) {
  return new Date(i).toLocaleString("ja-JP", { hour12:false });
}

/* ▼ ID パラメータ取得 */
const params = new URLSearchParams(window.location.search);
const userId = Number(params.get("id"));

if (!userId) {
  err("ユーザーIDが指定されていません");
}

/* ▼ API GET */
async function apiGet(p) {
  const r = await fetch(CONFIG.API_BASE_URL + p, { credentials: "include" });
  const t = await r.text();
  if (!r.ok) throw new Error(t);
  return JSON.parse(t);
}

/* ▼ API POST */
async function apiPost(p, body) {
  const r = await fetch(CONFIG.API_BASE_URL + p, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify(body)
  });
  const t = await r.text();
  if (!r.ok) throw new Error(t);
  return JSON.parse(t);
}

/* ▼ ユーザー詳細読み込み */
async function loadDetail() {
  try {
    const u = await apiGet(`/admin/users/${userId}`);

    document.getElementById("u-id").textContent = u.id;
    document.getElementById("u-name").textContent = u.name;
    document.getElementById("u-email").textContent = u.email;
    document.getElementById("u-created").textContent = fmtDate(u.createdAt);
    document.getElementById("u-kyc").textContent = u.kycRequests[0]?.status ?? 0;

    document.getElementById("u-group").value = u.groupId ?? "";
    document.getElementById("u-status").value = u.systemStatus;

    document.getElementById("p-birth").textContent = u.UserProfile?.dateOfBirth ?? "-";
    document.getElementById("p-address").textContent = u.UserProfile?.address ?? "-";
    document.getElementById("p-phone").textContent = u.UserProfile?.phone ?? "-";

    document.getElementById("w-total").textContent = u.wallet?.balanceTotal ?? 0;
    document.getElementById("w-avail").textContent = u.wallet?.balanceAvailable ?? 0;
    document.getElementById("w-lock").textContent = u.wallet?.balanceLocked ?? 0;

    /* 入出金履歴 */
    const tBody = document.getElementById("transfer-body");
    tBody.innerHTML = "";
    u.transfers.forEach(t => {
      tBody.innerHTML += `
        <tr>
          <td>${t.id}</td>
          <td>${t.type}</td>
          <td>${t.amount}</td>
          <td>${t.status}</td>
          <td>${fmtDate(t.createdAt)}</td>
        </tr>`;
    });

    /* 取引履歴 */
    const tradeBody = document.getElementById("trade-body");
    tradeBody.innerHTML = "";
    u.trades?.forEach(tr => {
      tradeBody.innerHTML += `
        <tr>
          <td>${tr.id}</td>
          <td>${tr.symbol}</td>
          <td>${tr.side}</td>
          <td>${tr.size}</td>
          <td>${tr.profit}</td>
          <td>${fmtDate(tr.openedAt)}</td>
        </tr>`;
    });

    msg("ユーザー情報を読み込みました。");

  } catch (e) {
    console.error(e);
    err("ユーザー情報の取得に失敗しました");
  }
}

/* ▼ グループ変更 */
document.getElementById("btn-update-group").onclick = async () => {
  try {
    const groupId = Number(document.getElementById("u-group").value);
    await apiPost(`/admin/users/${userId}/group`, { groupId });
    msg("グループを更新しました");
  } catch {
    err("グループ更新に失敗");
  }
};

/* ▼ systemStatus 更新 */
document.getElementById("btn-update-status").onclick = async () => {
  try {
    const status = document.getElementById("u-status").value;
    await apiPost(`/admin/users/${userId}/system-status`, { status });
    msg("ステータスを更新しました");
  } catch {
    err("ステータス更新に失敗");
  }
};

/* ▼ 初期読み込み */
loadDetail();
