import { CONFIG } from "../config.js";

/* ----------------------
      API BASE
---------------------- */

/* ----------------------
      DOM 取得
---------------------- */
const elMsg       = document.getElementById("sys-message");
const elGroupId   = document.getElementById("sys-group-id");
const elStatusPill= document.getElementById("sys-status-pill");
const elBalTotal  = document.getElementById("sys-balance-total");
const elPosBody   = document.getElementById("sys-positions-body");
const btnStop     = document.getElementById("sys-stop-btn");

/* ----------------------
      API GET / POST
---------------------- */
async function apiGet(path){
  const r = await fetch(CONFIG.API_BASE_URL + path, { credentials:"include" });
  if(!r.ok) throw new Error(await r.text());
  return r.json();
}
async function apiPost(path, body){
  const r = await fetch(CONFIG.API_BASE_URL + path,{
    method:"POST",
    credentials:"include",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(body||{})
  });
  const txt = await r.text();
  if(!r.ok) throw new Error(txt);
  return txt ? JSON.parse(txt) : {};
}

/* ----------------------
      便利関数
---------------------- */
function toast(msg){
  const t = document.getElementById("toast");
  document.getElementById("toast-text").textContent = msg;
  t.classList.add("show");
  setTimeout(()=> t.classList.remove("show"), 1800);
}

function fmtDate(iso){
  if(!iso) return "-";
  return new Date(iso).toLocaleString("ja-JP",{hour12:false});
}
function fmtNum(n){
  return Number(n).toLocaleString("en-US",{
    minimumFractionDigits: 0,
    maximumFractionDigits: 3
  });
}

  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");
  const overlay = document.getElementById("menu-overlay");
  const closeBtn = document.getElementById("menu-close");

  toggle.onclick = () => {
    menu.classList.add("open");
    overlay.classList.add("show");
  };

  closeBtn.onclick = () => {
    menu.classList.remove("open");
    overlay.classList.remove("show");
  };

  overlay.onclick = () => {
    menu.classList.remove("open");
    overlay.classList.remove("show");
  };


/* ----------------------
      ステータス表示
---------------------- */
function setStatusPill(status){
  elStatusPill.textContent = status;
  elStatusPill.className = "status-pill status-" + status;
}

/* ----------------------
      表示レンダリング
---------------------- */
function renderOverview(ov){
  elGroupId.textContent = ov.groupId ?? "-";
  setStatusPill(ov.systemStatus);
  elBalTotal.textContent = fmtNum(ov.balanceTotal);

  elPosBody.innerHTML = "";

  if(!ov.positions?.length){
    elPosBody.innerHTML =
      `<tr><td colspan="6" style="text-align:center;color:#888;">保有中ポジションはありません。</td></tr>`;
    return;
  }

  ov.positions.forEach(p=>{
    const profit = Number(p.unrealizedPnl);
    const sign = profit >= 0 ? "+" : "-";
    const absVal = Math.abs(profit);

    elPosBody.innerHTML += `
      <tr>
        <td>${p.symbol}</td>
        <td>${fmtNum(p.size)}</td>
        <td>${fmtNum(p.entryPrice)}</td>
        <td>${fmtNum(p.currentPrice)}</td>
        <td class="${profit>=0?'pnl-plus':'pnl-minus'}">
          <div class="pnl-cell">
            <span class="pnl-sign">${sign}</span>
            <span class="pnl-value">${fmtNum(absVal)}</span>
          </div>
        </td>
        <td>${fmtDate(p.openedAt)}</td>
      </tr>`;
  });
}

/* ----------------------
      停止依頼
---------------------- */
async function onStopClick(){
  try{
    await apiPost("/system/stop");
    toast("停止依頼を送信しました");
  }catch(e){
    toast("停止依頼に失敗しました");
  }
}
btnStop.addEventListener("click", onStopClick);

/* ----------------------
      初期ロード
---------------------- */
(async function init(){
  try{
    const ov = await apiGet("/system/overview");
    renderOverview(ov);
    elMsg.textContent = "システム情報を取得しました。";
    elMsg.style.color = "green";
  }catch(e){
    elMsg.textContent = "情報取得に失敗しました。ログインを確認してください。";
    elMsg.style.color = "red";
  }
})();

/* ----------------------
      ヘッダー切替（ログイン状態）
---------------------- */
async function updateHeaderUserState() {
  const headerActions = document.querySelector(".header-actions");
  if (!headerActions) return;

  try {
    const res = await fetch(CONFIG.API_BASE_URL + "/auth/me", { credentials:"include" });
    if (!res.ok) return;

    const data = await res.json();
    const user = data.user || data;

    headerActions.innerHTML = `
      <a href="mypage.html" class="btn btn-outline btn-sm">${user.name} さん</a>
      <a href="#" id="logoutBtn" class="btn btn-primary btn-sm">ログアウト</a>
    `;

    document.getElementById("logoutBtn").addEventListener("click", async () => {
      await fetch(CONFIG.API_BASE_URL + "/auth/logout",{method:"POST",credentials:"include"});
      location.href = "login.html";
    });

  } catch(e) {}
}
document.addEventListener("DOMContentLoaded", updateHeaderUserState);

