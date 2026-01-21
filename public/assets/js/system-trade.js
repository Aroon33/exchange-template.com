import {
  fetchSystemOverview,
  requestSystemStop
} from "./api/system-trade.api.js";

/* ======================================
   DOM
====================================== */
const elMsg        = document.getElementById("sys-message");
const elGroupId    = document.getElementById("sys-group-id");
const elStatusPill = document.getElementById("sys-status-pill");
const elBalTotal   = document.getElementById("sys-balance-total");
const elTotalPnl   = document.getElementById("sys-total-pnl");

const elPcBody = document.getElementById("sys-positions-body");
const elSpBody = document.getElementById("sys-positions-sp-body");
const btnStop  = document.getElementById("sys-stop-btn");
const modal    = document.getElementById("trade-modal");

/* ======================================
   State
====================================== */
let currentPositions = [];
let currentDays = null;      // ★ デフォルトは「全て」
let displayCount = 10;       // ★ 初期表示数
const LOAD_COUNT = 10;

/* ======================================
   Utils
====================================== */
function isMobile() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function fmtNum(n) {
  if (n == null || isNaN(n)) return "-";
  return Number(n).toLocaleString("en-US", { maximumFractionDigits: 4 });
}

function fmtDate(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("ja-JP", { hour12: false });
}

function symbol(s) {
  return s ? s.replace("USDT", "") : "-";
}

function getSide(p) {
  if (p.side) return p.side;
  if (p.positionSide) return p.positionSide === "LONG" ? "BUY" : "SELL";
  if (p.direction) return p.direction;
  return "-";
}

/* ======================================
   Filter
====================================== */
function filterPositions(list = []) {
  let filtered = [...list];

  // 日付フィルター（選択時のみ）
  if (currentDays !== null) {
    const limit = Date.now() - currentDays * 24 * 60 * 60 * 1000;
    filtered = filtered.filter(p =>
      p.openedAt && new Date(p.openedAt).getTime() >= limit
    );
  }

  // 表示件数制限
  return filtered.slice(0, displayCount);
}

/* ======================================
   Init
====================================== */
document.addEventListener("DOMContentLoaded", initPage);
btnStop.addEventListener("click", handleStopClick);

async function initPage() {
  try {
    const overview = await fetchSystemOverview();
    currentPositions = overview.positions || [];

    renderOverview(overview);
    renderPositions();

    elMsg.textContent = "システム情報を取得しました。";
    elMsg.style.color = "green";
  } catch (e) {
    elMsg.textContent = "情報取得に失敗しました。";
    elMsg.style.color = "red";
    console.error(e);
  }
}

/* ======================================
   Overview
====================================== */
function renderOverview(data) {
  elGroupId.textContent    = data.groupId ?? "-";
  elStatusPill.textContent = data.systemStatus ?? "-";
  elBalTotal.textContent   = fmtNum(data.balanceTotal);

  const total = (data.positions || []).reduce(
    (sum, p) => sum + Number(p.unrealizedPnl || 0), 0
  );

  elTotalPnl.textContent = fmtNum(total);
  elTotalPnl.className =
    "info-value " + (total >= 0 ? "pnl-plus" : "pnl-minus");
}

/* ======================================
   Render
====================================== */
function renderPositions() {
  const list = filterPositions(currentPositions);

  elPcBody.innerHTML = "";
  elSpBody.innerHTML = "";

  if (!list.length) {
    elPcBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center;color:#888;">
          該当するポジションはありません
        </td>
      </tr>`;
    return;
  }

  list.forEach(p => {
    const pnl = Number(p.unrealizedPnl);
    const cls = pnl >= 0 ? "pnl-plus" : "pnl-minus";
    const side = getSide(p);

    // PC
    elPcBody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${fmtDate(p.openedAt)}</td>
        <td>${symbol(p.symbol)}</td>
        <td>${side}</td>
        <td>${fmtNum(p.size)}</td>
        <td>${fmtNum(p.entryPrice)}</td>
        <td>${fmtNum(p.currentPrice)}</td>
        <td class="${cls}">${fmtNum(pnl)}</td>
      </tr>
    `);

    // SP
    elSpBody.insertAdjacentHTML("beforeend", `
      <tr data-trade='${JSON.stringify(p)}'>
        <td>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong>${symbol(p.symbol)} ${side}</strong>
            <span style="font-size:18px;color:#bbb;">›</span>
          </div>
          <div class="${cls}" style="margin-top:4px;">
            損益 ${fmtNum(pnl)}
          </div>
          <div style="font-size:11px;color:#888;margin-top:2px;">
            ${fmtDate(p.openedAt)}
          </div>
        </td>
      </tr>
    `);
  });
}

/* ======================================
   Filter Buttons
====================================== */
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");

    currentDays = Number(btn.dataset.days);
    displayCount = 10;

    renderPositions();
  });
});

/* ======================================
   SP → Modal
====================================== */
elSpBody.addEventListener("click", e => {
  if (!isMobile()) return;
  const row = e.target.closest("tr[data-trade]");
  if (!row) return;
  openModal(JSON.parse(row.dataset.trade));
});

/* ======================================
   Modal
====================================== */
function openModal(p) {
  document.getElementById("m-symbol").textContent = symbol(p.symbol);
  document.getElementById("m-side").textContent   = getSide(p);
  document.getElementById("m-size").textContent   = fmtNum(p.size);
  document.getElementById("m-entry").textContent  = fmtNum(p.entryPrice);
  document.getElementById("m-close").textContent  = fmtNum(p.currentPrice);
  document.getElementById("m-profit").textContent = fmtNum(p.unrealizedPnl);
  document.getElementById("m-date").textContent   = fmtDate(p.openedAt);

  modal.classList.add("show");
}

modal.addEventListener("click", e => {
  if (e.target === modal || e.target.classList.contains("modal-close")) {
    modal.classList.remove("show");
  }
});

/* ======================================
   Actions
====================================== */
async function handleStopClick() {
  try {
    await requestSystemStop();
    showToast("停止依頼を送信しました");
  } catch {
    showToast("停止依頼に失敗しました");
  }
}

/* ======================================
   Toast
====================================== */
function showToast(message) {
  const toast = document.getElementById("toast");
  document.getElementById("toast-text").textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}
