import {
  getAllDeposits,
  approveDeposit,
  assignCryptoAddress,
} from "./api/deposit.api.js";

let allDeposits = [];

/* ---------- utility ---------- */
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2000);
}

function formatDate(v) {
  if (!v) return "-";
  return new Date(v).toLocaleString("ja-JP", { hour12: false });
}

function formatAmount(v) {
  const n = Number(v);
  return isNaN(n) ? "-" : n.toLocaleString("en-US", { minimumFractionDigits: 2 });
}
function statusJP(status) {
  switch (status) {
    case "PENDING":
      return "申請中";
    case "CONFIRMING":
      return "確認中";
    case "COMPLETED":
      return "完了";
    case "CANCELED":
      return "キャンセル";
    case "APPROVED":
      return "承認済み";
    default:
      return status;
  }
}

/* ---------- actions ---------- */
async function sendAddress(id) {
  try {
    await assignCryptoAddress(id);
    showToast("入金先を送信しました");
    loadDeposits();
  } catch {
    showToast("送信失敗");
  }
}

async function approve(id) {
  try {
    await approveDeposit(id);
    showToast("承認しました");
    loadDeposits();
  } catch {
    showToast("承認失敗");
  }
}

function openChat(userId) {
  if (!userId) {
    showToast("ユーザー不明");
    return;
  }
  location.href = `tickets.html?user=${userId}`;
}

/* ---------- render ---------- */
function renderTable(list) {
  const tbody = document.getElementById("deposit-table-body");
  tbody.innerHTML = "";

  if (!list.length) {
    tbody.innerHTML =
      `<tr><td colspan="10" style="text-align:center;color:#777;">申請なし</td></tr>`;
    return;
  }

  list.forEach(t => {
    const isCrypto = t.method === "CRYPTO";
    const currency = isCrypto ? t.currency : "JPY";

    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${t.id}</td>
        <td>${formatDate(t.createdAt)}</td>
        <td>${t.user?.name ?? "-"}</td>
        <td>${isCrypto ? "暗号資産" : "日本円"}</td>
        <td>${currency}</td>
        <td>${formatAmount(t.amount)} JPY</td>
        <td>${isCrypto ? `${formatAmount(t.cryptoAmount)} ${currency}` : "-"}</td>
        <td>${formatDate(t.updatedAt)}</td>
        <td>${statusJP(t.status)}</td>
        <td>
          ${t.status === "PENDING" && isCrypto
            ? `<button class="btn-xs btn-warning btn-send" data-id="${t.id}">送信</button>`
            : ""}
          ${["PENDING", "CONFIRMING"].includes(t.status)
            ? `<button class="btn-xs btn-xs-primary btn-approve" data-id="${t.id}">承認</button>`
            : ""}
          <button class="btn-xs btn-chat" data-user-id="${t.user?.id ?? ""}">チャット</button>
        </td>
      </tr>
    `);
  });

  tbody.querySelectorAll(".btn-send").forEach(b =>
    b.onclick = () => sendAddress(+b.dataset.id)
  );
  tbody.querySelectorAll(".btn-approve").forEach(b =>
    b.onclick = () => approve(+b.dataset.id)
  );
  tbody.querySelectorAll(".btn-chat").forEach(b =>
    b.onclick = () => openChat(+b.dataset.userId)
  );
}

/* ---------- filter ---------- */
function applyFilter() {
  const f = document.getElementById("status-filter").value;

  if (f === "ALL") return renderTable(allDeposits);

  if (f === "PENDING") {
    return renderTable(allDeposits.filter(t =>
      ["PENDING", "APPROVED"].includes(t.status)
    ));
  }

  renderTable(allDeposits.filter(t => t.status === f));
}

/* ---------- load ---------- */
async function loadDeposits() {
  try {
    allDeposits = await getAllDeposits();
    applyFilter();
  } catch {
    showToast("取得失敗");
  }
}

/* ---------- init ---------- */
document.getElementById("status-filter").onchange = applyFilter;
document.getElementById("reload-btn").onclick = loadDeposits;
loadDeposits();
