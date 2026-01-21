import { CONFIG } from "../config.js";


/* ------------------------
      API UTIL
------------------------ */
async function apiGet(path){
  const r = await fetch(CONFIG.API_BASE_URL + path, { credentials:"include" });
  const t = await r.text();
  if(!r.ok) throw new Error(t);
  return JSON.parse(t);
}
async function apiPost(path){
  const r = await fetch(CONFIG.API_BASE_URL + path, { method:"POST", credentials:"include" });
  const t = await r.text();
  if(!r.ok) throw new Error(t);
  return JSON.parse(t);
}

function toast(msg){
  const t = document.getElementById("toast");
  document.getElementById("toast-text").textContent = msg;
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"), 1800);
}

/* ------------------------
      FORMATTERS
------------------------ */
function fmtDate(iso){
  if(!iso) return "-";
  return new Date(iso).toLocaleString("ja-JP",{hour12:false});
}

function fmt3(n){
  return Number(n).toFixed(3);
}

/* ------------------------
      GROUP LOAD
------------------------ */
async function loadGroups(){
  const list = await apiGet("/admin/groups");
  const sel = document.getElementById("groupSelect");
  sel.innerHTML = "";
  list.forEach(g=>{
    sel.innerHTML += `<option value="${g.id}">${g.name} (ID:${g.id})</option>`;
  });
}

/* ------------------------
      POSITION LOAD
------------------------ */
async function loadPositions(){
  const gid = document.getElementById("groupSelect").value;
  if(!gid) return;

  const res = await apiGet(`/admin/system/positions/${gid}`);

  renderParent(res.parent);
  renderChildren(res.children);
}

/* ----------------------------------------------------
   親口座レンダリング（日時 + 小数点3桁対応）
---------------------------------------------------- */
function renderParent(list, groupId){
  const body = document.getElementById("parentBody");
  body.innerHTML = "";

  document.getElementById("metaParent").textContent = `${list.length}件`;

  if (!list.length) {
    body.innerHTML = `<tr><td colspan="8" class="muted">なし</td></tr>`;
    return;
  }

  list.forEach(p => {
    const pnlClass = p.unrealizedPnl >= 0 ? "profit" : "loss";

    body.innerHTML += `
      <tr>
        <td>${fmtDate(p.openedAt)}</td>
        <td>${groupId}</td>
        <td>${p.symbol}</td>
        <td>${fmt3(p.size)}</td>
        <td>${fmt3(p.entryPrice)}</td>
        <td>${fmt3(p.currentPrice)}</td>
        <td class="${pnlClass}">${fmt3(p.unrealizedPnl)}</td>
        <td>
          <button class="btn-mini btn-danger"
                  onclick="closeGroupSymbol(${groupId}, '${p.symbol}')">
            決済
          </button>
        </td>
      </tr>
    `;
  });
}


/* ----------------------------------------------------
      子口座レンダリング（★日時 + 小数点3桁対応）
---------------------------------------------------- */
function renderChildren(list){
  const body = document.getElementById("childBody");
  body.innerHTML = "";
  document.getElementById("metaChildren").textContent = `${list.length}件`;

  if(!list.length){
    body.innerHTML = `<tr><td colspan="8" class="muted">なし</td></tr>`;
    return;
  }

  list.forEach(c=>{
    const pnlClass = c.unrealizedPnl >= 0 ? "profit" : "loss";

    body.innerHTML += `
      <tr>
        <td>${fmtDate(c.openedAt)}</td>
        <td>${c.userName} (ID:${c.userId})</td>
        <td>${c.symbol}</td>
        <td>${fmt3(c.size)}</td>
        <td>${fmt3(c.entryPrice)}</td>
        <td>${fmt3(c.currentPrice)}</td>
        <td class="${pnlClass}">${fmt3(c.unrealizedPnl)}</td>
        <td>
          <button class="btn-mini btn-danger" onclick="closeUserSymbol(${c.userId}, '${c.symbol}')">
            決済
          </button>
          <button class="btn-mini btn-warning" onclick="closeUser(${c.userId})">
            全決済
          </button>
        </td>
        
      </tr>
    `;
  });
}

/* ----------------------------------------------------
      決済機能
---------------------------------------------------- */
async function closeGroupAll(){
  const gid = document.getElementById("groupSelect").value;
  if(!gid) return;
  if(!confirm("⚠ グループ全ポジションを決済しますか？")) return;

  await apiPost(`/system/close-group/${gid}`);
  toast("グループ全決済しました");
  loadPositions();
}

async function closeGroupSymbol(symbol){
  const gid = document.getElementById("groupSelect").value;
  if(!gid) return;
  if(!confirm(`⚠ ${symbol} を決済しますか？`)) return;

  await apiPost(`/system/close-group/${gid}/${symbol}`);
  toast(`${symbol} を決済しました`);
  loadPositions();
}

async function closeUser(userId){
  if(!confirm(`⚠ ユーザー ${userId} の全通貨を決済しますか？`)) return;

  await apiPost(`/system/close-user/${userId}`);
  toast(`ユーザー ${userId} 全決済しました`);
  loadPositions();
}

async function closeUserSymbol(userId, symbol){
  if(!confirm(`⚠ ユーザー ${userId} の ${symbol} を決済しますか？`)) return;

  await apiPost(`/system/close-user/${userId}/${symbol}`);
  toast(`ユーザー ${userId} の ${symbol} を決済しました`);
  loadPositions();
}

/* 初期化 */
loadGroups().then(loadPositions);
