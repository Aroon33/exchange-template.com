import {
  getGroups,
  getSystemPositions,
  closeGroupAll,
  closeGroupSymbol,
  closeUserAll,
  closeUserSymbol
} from "./api/system-positions.api.js";

/* ---------- util ---------- */
function toast(msg) {
  const t = document.getElementById("toast");
  document.getElementById("toast-text").textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 1800);
}

function fmtDate(v) {
  if (!v) return "-";
  return new Date(v).toLocaleString("ja-JP", { hour12:false });
}
function fmt3(n) {
  return Number(n).toFixed(3);
}

/* ---------- groups ---------- */
async function loadGroups() {
  const list = await getGroups();
  const sel = document.getElementById("groupSelect");
  sel.innerHTML = "";

  list.forEach(g => {
    sel.innerHTML += `<option value="${g.id}">${g.name} (ID:${g.id})</option>`;
  });

  if (list.length) {
    sel.value = list[0].id;
  }
}

/* ---------- positions ---------- */
async function loadPositions() {
  const gid = document.getElementById("groupSelect").value;
  if (!gid) return;

  const res = await getSystemPositions(gid);
  renderParent(res.parent || [], gid);
  renderChildren(res.children || []);
}
window.loadPositions = loadPositions;

/* ---------- render parent ---------- */
function renderParent(list, groupId) {
  const body = document.getElementById("parentBody");
  body.innerHTML = "";
  document.getElementById("metaParent").textContent = `${list.length}件`;

  if (!list.length) {
    body.innerHTML = `<tr><td colspan="8" class="muted">なし</td></tr>`;
    return;
  }

  list.forEach(p => {
    const cls = p.unrealizedPnl >= 0 ? "profit" : "loss";
    body.innerHTML += `
      <tr>
        <td>${fmtDate(p.openedAt)}</td>
        <td>${groupId}</td>
        <td>${p.symbol}</td>
        <td>${fmt3(p.size)}</td>
        <td>${fmt3(p.entryPrice)}</td>
        <td>${fmt3(p.currentPrice)}</td>
        <td class="${cls}">${fmt3(p.unrealizedPnl)}</td>
        <td>
          <button class="btn-mini btn-danger"
            onclick="onCloseGroupSymbol('${p.symbol}')">決済</button>
        </td>
      </tr>`;
  });
}

/* ---------- render children ---------- */
function renderChildren(list) {
  const body = document.getElementById("childBody");
  body.innerHTML = "";
  document.getElementById("metaChildren").textContent = `${list.length}件`;

  if (!list.length) {
    body.innerHTML = `<tr><td colspan="8" class="muted">なし</td></tr>`;
    return;
  }

  list.forEach(c => {
    const cls = c.unrealizedPnl >= 0 ? "profit" : "loss";
    body.innerHTML += `
      <tr>
        <td>${fmtDate(c.openedAt)}</td>
        <td>${c.userName}</td>
        <td>${c.symbol}</td>
        <td>${fmt3(c.size)}</td>
        <td>${fmt3(c.entryPrice)}</td>
        <td>${fmt3(c.currentPrice)}</td>
        <td class="${cls}">${fmt3(c.unrealizedPnl)}</td>
        <td>
          <button class="btn-mini btn-danger"
            onclick="onCloseUserSymbol(${c.userId}, '${c.symbol}')">決済</button>
          <button class="btn-mini btn-warning"
            onclick="onCloseUserAll(${c.userId})">全決済</button>
        </td>
      </tr>`;
  });
}

/* ---------- actions ---------- */
window.onCloseGroupAll = async () => {
  const gid = document.getElementById("groupSelect").value;
  if (!gid || !confirm("⚠ グループ全決済しますか？")) return;

  try {
    await closeGroupAll(gid);
    toast("グループ全決済しました");
    loadPositions();
  } catch {
    toast("❌ 失敗しました");
  }
};

window.onCloseGroupSymbol = async (symbol) => {
  const gid = document.getElementById("groupSelect").value;
  if (!gid || !confirm(`⚠ ${symbol} を決済しますか？`)) return;

  try {
    await closeGroupSymbol(gid, symbol);
    toast(`${symbol} を決済しました`);
    loadPositions();
  } catch {
    toast("❌ 失敗しました");
  }
};

window.onCloseUserAll = async (userId) => {
  if (!confirm(`⚠ ユーザー ${userId} を全決済しますか？`)) return;

  try {
    await closeUserAll(userId);
    toast(`ユーザー ${userId} 全決済`);
    loadPositions();
  } catch {
    toast("❌ 失敗しました");
  }
};

window.onCloseUserSymbol = async (userId, symbol) => {
  if (!confirm(`⚠ ${symbol} を決済しますか？`)) return;

  try {
    await closeUserSymbol(userId, symbol);
    toast(`${symbol} を決済しました`);
    loadPositions();
  } catch {
    toast("❌ 失敗しました");
  }
};

/* ---------- init ---------- */
await loadGroups();
loadPositions();
