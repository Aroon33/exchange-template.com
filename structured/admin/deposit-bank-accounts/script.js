import { CONFIG } from "../config.js";


/* ---------- util ---------- */
function formatDate(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("ja-JP", { hour12:false });
}

function openCreateBank() {
  location.href = "deposit-bank-account-edit.html";
}


function openCreateCrypto() {
  location.href = "deposit-crypto-address-edit.html";
}


async function apiGet(path) {
  const res = await fetch(CONFIG.API_BASE_URL + path, { credentials:"include" });
  const txt = await res.text();
  if (!res.ok) throw new Error(txt);
  return JSON.parse(txt);
}

/* ---------- load bank ---------- */
async function loadBankAccounts() {
  const status = document.getElementById("status-filter").value;
  const from   = document.getElementById("date-from").value;
  const to     = document.getElementById("date-to").value;

  const params = new URLSearchParams();
  if (status !== "ALL") params.append("status", status);
  if (from) params.append("from", from);
  if (to) params.append("to", to);

  const list = await apiGet(
    "/admin/deposit/bank-accounts?" + params.toString()
  );

  renderBankTable(list);
}

/* ---------- render bank ---------- */
function renderBankTable(list) {
  const tbody = document.getElementById("bank-account-table");
  tbody.innerHTML = "";

  if (!list.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center;color:#777;">
          未登録
        </td>
      </tr>
    `;
    return;
  }

  list.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${formatDate(r.createdAt)}</td>
      <td>${r.bankName}</td>
      <td>${r.branchName}</td>
      <td>****${r.accountNumber.slice(-3)}</td>
      <td>${r.accountHolder}</td>
      <td>${statusLabel(r.status)}</td>
      <td>${renderActions(r)}</td>
    `;
    tbody.appendChild(tr);
  });
}

function statusLabel(status) {
  if (status === "ACTIVE") return "使用中";
  if (status === "UNUSED") return "未使用";
  if (status === "CLOSED") return "解約済";
  return "-";
}

function renderActions(r) {
  if (r.status === "UNUSED") {
    return `
      <button class="btn-xs btn-primary" onclick="setActive(${r.id})">使用開始</button>
      <button class="btn-xs" onclick="edit(${r.id})">編集</button>
    `;
  }
  if (r.status === "ACTIVE") {
    return `
      <button class="btn-xs btn-warning" onclick="closeAccount(${r.id})">解約</button>
      <button class="btn-xs" onclick="edit(${r.id})">編集</button>
    `;
  }
  if (r.status === "CLOSED") {
    return `
      <button class="btn-xs btn-primary" onclick="restoreAccount(${r.id})">未使用に戻す</button>
      <button class="btn-xs" onclick="edit(${r.id})">編集</button>
      <button class="btn-xs btn-danger" onclick="deleteAccount(${r.id})">削除</button>
    `;
  }
  return "";
}



function editBank(id) {
  location.href = "deposit-bank-account-edit.html?id=" + id;
}


/* ---------- crypto ---------- */
async function loadCryptoAddresses() {
  const list = await apiGet("/admin/deposit/crypto-addresses");
  renderCryptoTable(list);
}

function renderCryptoTable(list) {
  const tbody = document.getElementById("crypto-address-table");
  tbody.innerHTML = "";

  if (!list.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center;color:#777;">
          未登録
        </td>
      </tr>
    `;
    return;
  }

  list.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${formatDate(r.createdAt)}</td>
      <td>${r.userId ?? "-"}</td>
      <td>${r.currency}</td>
      <td>
        ${r.address}
        <span class="copy-btn" onclick="copyText('${r.address}')">コピー</span>
      </td>
      <td>${r.memoTag ?? "-"}</td>
      
      <td style="color:${r.used ? 'red' : 'green'};">
        ${r.used ? "使用済" : "未使用"}
      </td>
      <td>
        <button class="btn-xs" onclick="editCrypto(${r.id})">編集</button>
        <button class="btn-xs btn-danger" onclick="deleteCrypto(${r.id})">削除</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/* ---------- actions ---------- */
function openCreate() {
  location.href = "deposit-bank-account-edit.html";
}
function edit(id) {
  location.href = "deposit-bank-account-edit.html?id=" + id;
}
function editCrypto(id) {
  location.href = "deposit-crypto-address-edit.html?id=" + id;
}
function copyText(text) {
  navigator.clipboard.writeText(text);
  alert("コピーしました");
}

async function setActive(id) {
  if (!confirm("この口座を使用開始しますか？")) return;
  await apiGet(`/admin/deposit/bank-accounts/${id}/activate`);
  loadBankAccounts();
}
async function closeAccount(id) {
  if (!confirm("この口座を解約しますか？")) return;
  await apiGet(`/admin/deposit/bank-accounts/${id}/close`);
  loadBankAccounts();
}
async function restoreAccount(id) {
  if (!confirm("未使用に戻しますか？")) return;
  await apiGet(`/admin/deposit/bank-accounts/${id}/restore`);
  loadBankAccounts();
}
async function deleteAccount(id) {
  if (!confirm("削除しますか？")) return;
  await apiGet(`/admin/deposit/bank-accounts/${id}/delete`);
  loadBankAccounts();
}
async function deleteCrypto(id) {
  if (!confirm("削除しますか？")) return;
  await apiGet(`/admin/deposit/crypto-addresses/${id}/delete`);
  loadCryptoAddresses();
}

/* ---------- init ---------- */
document.getElementById("reload-btn").onclick = loadBankAccounts;
document.getElementById("status-filter").onchange = loadBankAccounts;

loadBankAccounts();
loadCryptoAddresses();
