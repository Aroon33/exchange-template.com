import { CONFIG } from "../config.js";


async function apiGet(p){
  const r = await fetch(CONFIG.API_BASE_URL + p, { credentials:"include" });
  const t = await r.text();
  if(!r.ok) throw new Error(t);
  return JSON.parse(t);
}
async function apiPost(p, body){
  const r = await fetch(CONFIG.API_BASE_URL + p, {
    method:"POST",
    credentials:"include",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify(body),
  });
  const t = await r.text();
  if(!r.ok) throw new Error(t);
  return JSON.parse(t);
}

let CURRENT_GROUP = null;
let CURRENT_DATA = null;

const tbody = document.getElementById("sys-body");
const msgbox = document.getElementById("sys-msg");

/* ▼ グループ一覧読み込み */
async function loadGroups(){
  const groups = await apiGet("/admin/groups");
  const sel = document.getElementById("group-select");
  sel.innerHTML = "";

  groups.forEach(g=>{
    sel.innerHTML += `<option value="${g.id}">${g.name}（${g.code}）</option>`;
  });

  CURRENT_GROUP = groups[0]?.id || null;

  if (CURRENT_GROUP) loadSettings();
}

document.getElementById("group-select").onchange = (e)=>{
  CURRENT_GROUP = Number(e.target.value);
  loadSettings();
};

/* ▼ 設定をロード */
async function loadSettings(){
  const data = await apiGet(`/system/config/${CURRENT_GROUP}`);
  CURRENT_DATA = data;
  renderTable();
}

/* ▼ UI描画 */
function renderTable(){
  tbody.innerHTML = "";

  Object.keys(CURRENT_DATA).forEach(symbol=>{
    const s = CURRENT_DATA[symbol];

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${symbol}</td>

      <td>
        <select data-field="direction" data-s="${symbol}">
          <option value="BUY" ${s.direction==="BUY"?"selected":""}>BUY</option>
          <option value="SELL" ${s.direction==="SELL"?"selected":""}>SELL</option>
        </select>
      </td>

      <td>
        <input data-field="size" data-s="${symbol}" type="number" step="0.0001" value="${s.size}">
      </td>

      <td>
        <input data-field="holdMinutes" data-s="${symbol}" type="number" value="${s.holdMinutes}">
      </td>

      <td>
        <input data-field="pips" data-s="${symbol}" type="number" step="0.1" value="${s.pips}">
      </td>

      <td>
        <select data-field="status" data-s="${symbol}">
          <option value="ACTIVE" ${s.status==="ACTIVE"?"selected":""}>ACTIVE</option>
          <option value="PENDING" ${s.status==="PENDING"?"selected":""}>PENDING</option>
          <option value="STOP" ${s.status==="STOP"?"selected":""}>STOP</option>
        </select>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/* ▼ 保存 */
document.getElementById("btn-save").onclick = async ()=>{
  document.querySelectorAll("[data-field]").forEach(el=>{
    const sym = el.dataset.s;
    const field = el.dataset.field;
    let v = el.value;
    if (field !== "direction" && field !== "status") v = Number(v);
    CURRENT_DATA[sym][field] = v;
  });

  await apiPost(`/system/config/${CURRENT_GROUP}`, CURRENT_DATA);

  msgbox.textContent = "保存しました";
  msgbox.style.color = "green";
  setTimeout(()=> msgbox.textContent="", 1500);
};

/* ▼ トレードループ実行 */
async function runTradeLoop(){
  try {
    const res = await fetch(CONFIG.API_BASE_URL + "/system/trade-loop", {
      method:"POST",
      credentials:"include"
    });
    const txt = await res.text();
    showToast("トレードループを実行しました");
    console.log("trade-loop result:", txt);
  } catch(err){
    showToast("失敗しました: " + err.message);
  }
}

document.getElementById("runLoopBtn").onclick = ()=>{
  if(confirm("トレードループを実行しますか？")){
    runTradeLoop();
  }
};

/* 初期ロード */
loadGroups();
