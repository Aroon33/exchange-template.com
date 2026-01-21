import {
  getAllWithdraws,
  approveWithdraw,
  cancelWithdraw,
} from "./api/withdraw.api.js";

let allWithdraws = [];

/* ----------------------
      Utility
---------------------- */
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2000);
}

function formatDate(s) {
  if (!s) return "-";
  return new Date(s).toLocaleString("ja-JP", { hour12: false });
}

function formatAmount(a) {
  const n = Number(a);
  if (isNaN(n)) return a;
  return n.toLocaleString("en-US", { minimumFractionDigits: 2 });
}

/* ----------------------
      承認・取消
---------------------- */
async function approve(id) {
  try {
    await approveWithdraw(id);
    showToast("承認しました");
    loadWithdraws();
  } catch {
    showToast("承認失敗");
  }
}

async function cancel(id) {
  try {
    await cancelWithdraw(id);
    showToast("キャンセルしました");
    loadWithdraws();
  } catch {
    showToast("キャンセル失敗");
  }
}

/* ----------------------
      チャット遷移
---------------------- */
function openChat(userId) {
  if (!userId) {
    showToast("ユーザー不明");
    return;
  }
  location.href = `tickets.html?user=${userId}`;
}

/* ----------------------
      TABLE RENDERING
---------------------- */
function renderTable(list) {
  const tbody = document.getElementById("withdraw-table-body");
  tbody.innerHTML = "";

  if (!list.length) {
    tbody.innerHTML =
      `<tr><td colspan="10" style="text-align:center;color:#777;">申請なし</td></tr>`;
    return;
  }

  list.forEach(t => {
    const isCrypto =
      t.cryptoAmount !== null &&
      !isNaN(Number(t.cryptoAmount)) &&
      Number(t.cryptoAmount) > 0;

    const methodLabel = isCrypto ? "暗号資産" : "日本円";
    const currency = isCrypto ? t.currency : "JPY";

    const requestAmount = `${formatAmount(t.amount)} JPY`;
    const withdrawAmount = isCrypto
      ? `${formatAmount(t.cryptoAmount)} ${currency}`
      : `${formatAmount(t.amount)} JPY`;

    const statusJP =
      t.status === "PENDING" ? "申請中" :
      t.status === "COMPLETED" ? "完了" :
      "キャンセル";

    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${t.id}</td>
        <td>${formatDate(t.createdAt)}</td>
        <td>${t.user?.name ?? "-"}</td>
        <td>${methodLabel}</td>
        <td>${currency}</td>
        <td>${requestAmount}</td>
        <td>${withdrawAmount}</td>
        <td>${formatDate(t.updatedAt)}</td>
        <td>${statusJP}</td>
        <td>
          ${
            t.status === "PENDING"
              ? `<button class="btn-xs btn-xs-primary btn-approve" data-id="${t.id}">承認</button>`
              : ""
          }
          <button class="btn-xs btn-xs-danger btn-cancel" data-id="${t.id}">取消</button>
          <button class="btn-xs btn-warning btn-chat" data-user-id="${t.user?.id ?? ""}">チャット</button>
        </td>
      </tr>
    `);
  });

  // events
  tbody.querySelectorAll(".btn-approve").forEach(btn =>
    btn.onclick = () => approve(Number(btn.dataset.id))
  );
  tbody.querySelectorAll(".btn-cancel").forEach(btn =>
    btn.onclick = () => cancel(Number(btn.dataset.id))
  );
  tbody.querySelectorAll(".btn-chat").forEach(btn =>
    btn.onclick = () => openChat(Number(btn.dataset.userId))
  );
}

/* ----------------------
      FILTER APPLY
---------------------- */
function applyFilter() {
  const f = document.getElementById("status-filter").value;
  if (f === "ALL") {
    renderTable(allWithdraws);
  } else {
    renderTable(allWithdraws.filter(t => t.status === f));
  }
}

/* ----------------------
      LOAD WITHDRAWS
---------------------- */
async function loadWithdraws() {
  try {
    allWithdraws = await getAllWithdraws();
    applyFilter();
  } catch {
    showToast("取得失敗");
  }
}

/* ----------------------
      INIT
---------------------- */
document
  .getElementById("status-filter")
  .addEventListener("change", applyFilter);

document
  .getElementById("reload-btn")
  .addEventListener("click", loadWithdraws);

loadWithdraws();
