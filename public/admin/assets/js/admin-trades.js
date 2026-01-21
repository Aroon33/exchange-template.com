import { getTrades } from "./api/trades.api.js";

/* ===== 表示用ユーティリティ ===== */
function fmt4(v){
  if(v === null || v === undefined) return "-";
  const n = Number(v);
  if(isNaN(n)) return "-";
  return n.toFixed(4);
}

function fDate(v){
  if(!v) return "-";
  return new Date(v).toLocaleString("ja-JP",{hour12:false});
}

function symbolLabel(s){
  return s ? s.replace("USDT","") : "-";
}

/* ===== 取引ロード ===== */
async function loadTrades(){

  const status    = document.getElementById("f-status").value;
  const userName  = document.getElementById("f-userName").value;
  const groupName = document.getElementById("f-groupName").value;
  const symbol    = document.getElementById("f-symbol").value;

  const list = await getTrades({
    status,
    userName,
    groupName,
    symbol,
  });

  const tbody = document.getElementById("trade-body");
  tbody.innerHTML = "";

  list.forEach(t=>{
    tbody.insertAdjacentHTML("beforeend",`
      <tr>
        <td>${t.id}</td>
        <td>${t.user.name}</td>
        <td>${t.user.group?.name ?? "-"}</td>
        <td>${symbolLabel(t.symbol)}</td>
        <td>${t.side}</td>
        <td>${fmt4(t.size)}</td>
        <td>${fmt4(t.entryPrice)}</td>
        <td>${fmt4(t.closePrice)}</td>
        <td>${fmt4(t.profit)}</td>
        <td>${fDate(t.openedAt)}</td>
        <td>${fDate(t.closedAt)}</td>
      </tr>
    `);
  });
}

/* ===== イベント ===== */
document.getElementById("btn-search").onclick = loadTrades;
document.getElementById("btn-clear").onclick = ()=>{
  ["f-status","f-userName","f-groupName","f-symbol"].forEach(id=>{
    document.getElementById(id).value="";
  });
  loadTrades();
};

/* 初期表示 */
loadTrades();
