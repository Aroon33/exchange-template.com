// ========================================
// System Trade Page Script (FINAL COMPLETE)
// ========================================

import {
  fetchSystemOverview,
  requestSystemStop
} from "./api/system-trade.api.js";

/* ======================================
   DOM Elements
====================================== */
const elMsg        = document.getElementById("sys-message");
const elGroupId    = document.getElementById("sys-group-id");
const elStatusPill = document.getElementById("sys-status-pill");
const elBalTotal   = document.getElementById("sys-balance-total");
const elTotalPnl   = document.getElementById("sys-total-pnl");

const elPosBody    = document.getElementById("sys-positions-body");   // PC
const elHistoryBody= document.getElementById("trade-history-body");   // SP
const btnStop      = document.getElementById("sys-stop-btn");

/* ======================================
   State
====================================== */
let currentPositions = [];
const isMobile = window.matchMedia("(max-width: 768px)").matches;

/* ======================================
   Bootstrap
====================================== */
document.addEventListener("DOMContentLoaded", initPage);
btnStop.addEventListener("click", handleStopClick);

/* ======================================
   Init
====================================== */
async function initPage() {
  try {
    const overview = await fetchSystemOverview();
    currentPositions = overview.positions || [];
    renderOverview(overview);

    elMsg.textContent = "システム情報を取得しました。";
    elMsg.style.color = "green";
  } catch (e) {
    elMsg.textContent = e.message || "情報取得に失敗しました。";
    elMsg.style.color = "red";
  }
}

/* ======================================
   Format Utilities
====================================== */

/** 銘柄（USDT除外） */
function formatSymbol(symbol) {
  return symbol.replace("USDT", "");
}

/** 小数点4桁 */
function formatDecimal(value) {
  return Number(value).toFixed(4);
}

/** 日時：YYYY-MM-DD HH:mm */
function formatDateTime(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}

/* ======================================
   Calculations
====================================== */
function calcTotalPnl(positions = []) {
  return positions.reduce(
    (sum, p) => sum + Number(p.unrealizedPnl || 0),
    0
  );
}

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
   Render (Overview)
====================================== */
function renderOverview(data) {
  elGroupId.textContent    = data.groupId ?? "-";
  elStatusPill.textContent = data.systemStatus ?? "-";
  elBalTotal.textContent   = formatDecimal(data.balanceTotal);

  const totalPnl = calcTotalPnl(data.positions);
  elTotalPnl.textContent = formatDecimal(totalPnl);
  elTotalPnl.className =
    "info-value " + (totalPnl >= 0 ? "pnl-plus" : "pnl-minus");

  if (isMobile) {
    renderPositionsMobile(data.positions);
  } else {
    renderPositionsDesktop(data.positions);
  }
}

/* ======================================
   Render (Desktop)
====================================== */
function renderPositionsDesktop(positions = []) {
  elPosBody.innerHTML = "";

  if (!positions.length) {
    elPosBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;color:#888;">
          保有中ポジションはありません。
        </td>
      </tr>`;
    return;
  }

  positions.forEach(p => {
    const pnl = Number(p.unrealizedPnl);
    elPosBody.innerHTML += `
      <tr>
        <td>${formatDateTime(p.openedAt)}</td>
        <td>${formatSymbol(p.symbol)}</td>
        <td>${formatDecimal(p.size)}</td>
        <td>${formatDecimal(p.entryPrice)}</td>
        <td>${formatDecimal(p.currentPrice)}</td>
        <td class="${pnl >= 0 ? "pnl-plus" : "pnl-minus"}">
          ${formatDecimal(pnl)}
        </td>
      </tr>`;
  });
}

/* ======================================
   Render (Mobile)
====================================== */
function renderPositionsMobile(positions = []) {
  elHistoryBody.innerHTML = "";

  if (!positions.length) {
    elHistoryBody.innerHTML = `
      <tr>
        <td style="text-align:center;color:#888;">
          データがありません
        </td>
      </tr>`;
    return;
  }

  positions.forEach((p, index) => {
    const pnl = Number(p.unrealizedPnl);
    elHistoryBody.innerHTML += `
      <tr class="history-row" data-index="${index}">
        <td>
          <div class="history-main">
            <strong>${formatSymbol(p.symbol)}</strong>
            <span class="${pnl >= 0 ? "pnl-plus" : "pnl-minus"}">
              ${formatDecimal(pnl)}
            </span>
          </div>
          <div class="history-sub">
            ${formatDateTime(p.openedAt)}
          </div>
        </td>
      </tr>`;
  });
}

/* ======================================
   Mobile Modal
====================================== */
elHistoryBody.addEventListener("click", e => {
  const row = e.target.closest(".history-row");
  if (!row) return;
  openTradeModal(currentPositions[row.dataset.index]);
});

function openTradeModal(p) {
  if (!p) return;

  document.getElementById("m-symbol").textContent = formatSymbol(p.symbol);
  document.getElementById("m-side").textContent   = p.side || "-";
  document.getElementById("m-size").textContent   = formatDecimal(p.size);
  document.getElementById("m-entry").textContent  = formatDecimal(p.entryPrice);
  document.getElementById("m-close").textContent  = formatDecimal(p.currentPrice);
  document.getElementById("m-profit").textContent = formatDecimal(p.unrealizedPnl);
  document.getElementById("m-date").textContent   = formatDateTime(p.openedAt);

  document.getElementById("trade-modal").classList.add("show");
}

document.querySelector(".modal-close")
  .addEventListener("click", () => {
    document.getElementById("trade-modal").classList.remove("show");
  });

/* ======================================
   UI
====================================== */
function showToast(message) {
  const toast = document.getElementById("toast");
  document.getElementById("toast-text").textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}
