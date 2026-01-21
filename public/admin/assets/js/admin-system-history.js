import {
  getGroups,
  getSystemHistory,
} from "./api/system-history.api.js";

/* ▼ フォーマット関数 */
function fmtDate(d) {
  if (!d) return "-";
  const date = new Date(d);
  const y = date.getFullYear();
  const m = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const h = ("0" + date.getHours()).slice(-2);
  const min = ("0" + date.getMinutes()).slice(-2);
  const s = ("0" + date.getSeconds()).slice(-2);
  return `${y}/${m}/${day} ${h}:${min}:${s}`;
}

function fmtNum(n, digits = 2) {
  return Number(n).toFixed(digits);
}

function fmtLot(n) {
  return Number(n).toFixed(4);
}

function showToast(msg) {
  const t = document.getElementById("toast");
  document.getElementById("toast-text").textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2000);
}

/* ▼ グループ読み込み */
async function loadGroups() {
  const groups = await getGroups();
  const sel = document.getElementById("groupSelect");
  sel.innerHTML = "";
  groups.forEach(g => {
    sel.innerHTML += `<option value="${g.id}">${g.name} (ID:${g.id})</option>`;
  });
}

/* ▼ フィルタークリア */
function clearFilters() {
  document.getElementById("fSymbol").value = "";
  document.getElementById("fUserId").value = "";
  document.getElementById("fStatus").value = "";
}

/* ▼ 履歴ロード */
async function loadHistory() {
  const gid = document.getElementById("groupSelect").value;
  if (!gid) return showToast("グループIDを選択してください");

  const data = await getSystemHistory(gid);

  let parent = data.parent;
  let children = data.children;

  const symbol = document.getElementById("fSymbol").value.trim().toUpperCase();
  const userId = Number(document.getElementById("fUserId").value);
  const status = document.getElementById("fStatus").value;

  /* ▼ フィルタ */
  if (symbol !== "") {
    parent = parent.filter(t => t.symbol === symbol);
    children = children.filter(t => t.symbol === symbol);
  }

  if (!isNaN(userId) && userId > 0) {
    children = children.filter(t => t.userId === userId);
  }

  if (status === "open") {
    parent = parent.filter(t => t.closePrice === null);
    children = children.filter(t => t.closePrice === null);
  } else if (status === "closed") {
    parent = parent.filter(t => t.closePrice !== null);
    children = children.filter(t => t.closePrice !== null);
  }

  /* ▼ 親履歴描画 */
  const pBody = document.getElementById("parentBody");
  pBody.innerHTML = "";
  document.getElementById("metaParent").textContent = `${parent.length}件`;

  if (!parent.length) {
    pBody.innerHTML = `<tr><td colspan="8" class="muted">なし</td></tr>`;
  } else {
    parent.forEach(t => {
      pBody.innerHTML += `
<tr>
  <td>${t.id}</td>
  <td>${t.userName}（${t.groupName}）</td>
  <td>${t.type === "BUY" ? "買" : "売"}</td>
  <td>${t.symbol.replace("USDT", "")}</td>
  <td>${Number(t.lot).toFixed(4)}</td>
  <td>${Number(t.entry).toFixed(4)}</td>
  <td>${Number(t.currentPrice).toFixed(4)}</td>
  <td class="${t.profit >= 0 ? "profit-plus" : "profit-minus"}">
    ${Number(t.profit).toFixed(4)}
  </td>
  <td>${new Date(t.updatedAt).toLocaleString("ja-JP")}</td>
</tr>`;
    });
  }

  /* ▼ 子履歴描画 */
  const cBody = document.getElementById("childBody");
  cBody.innerHTML = "";
  document.getElementById("metaChildren").textContent = `${children.length}件`;

  if (!children.length) {
    cBody.innerHTML = `<tr><td colspan="9" class="muted">なし</td></tr>`;
  } else {
    children.forEach(t => {
      cBody.innerHTML += `
<tr>
  <td>${t.id}</td>
  <td>${t.user.name} (ID:${t.userId})</td>
  <td>${t.symbol}</td>
  <td>${fmtLot(t.size)}</td>
  <td>${fmtNum(t.entryPrice)}</td>
  <td>${fmtNum(t.closePrice)}</td>
  <td class="${t.profit >= 0 ? 'profit-plus' : 'profit-minus'}">
    ${fmtNum(t.profit)}
  </td>
  <td>${fmtDate(t.openedAt)}</td>
  <td>${fmtDate(t.closedAt)}</td>
</tr>`;
    });
  }

  showToast("履歴を読み込みました");
}

/* ▼ 初期 */
loadGroups();

/* ▼ expose（HTMLの onclick 用） */
window.loadHistory = loadHistory;
window.clearFilters = clearFilters;
