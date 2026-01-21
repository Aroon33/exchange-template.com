import { getTradeHistory } from "./api/history.api.js";

/* =========================
   DOM
========================= */
const elMsg = document.getElementById("history-message");
const elTradeBody = document.getElementById("trade-history-body");
const btnLoadMore = document.getElementById("btn-loadmore");
const filterButtons = document.querySelectorAll(".filter-btn");
const modal = document.getElementById("trade-modal");

/* =========================
   State
========================= */
let trades = [];
let displayCount = 20;
const LOAD_COUNT = 20;
let currentDays = 1;

/* =========================
   util
========================= */
function isMobile() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function fmtDate(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("ja-JP", { hour12: false });
}

function fmtNum(n) {
  if (n == null) return "-";
  return Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 });
}

/* =========================
   日数フィルタ
========================= */
function getFilteredTrades() {
  const now = Date.now();
  const limit = now - currentDays * 24 * 60 * 60 * 1000;
  return trades.filter(t => t.closedAt && new Date(t.closedAt).getTime() >= limit);
}

/* =========================
   タブ操作
========================= */
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentDays = Number(btn.dataset.days);
    displayCount = LOAD_COUNT;
    renderTrades();
  });
});

/* =========================
   モーダル制御
========================= */
function openModal(trade) {
  document.getElementById("m-symbol").textContent = trade.symbol;
  document.getElementById("m-side").textContent = trade.side;
  document.getElementById("m-size").textContent = fmtNum(trade.size);
  document.getElementById("m-entry").textContent = fmtNum(trade.entryPrice);
  document.getElementById("m-close").textContent = fmtNum(trade.closePrice);
  document.getElementById("m-profit").textContent = fmtNum(trade.profit);
  document.getElementById("m-date").textContent = fmtDate(trade.closedAt);
  modal.classList.add("show");
}

modal.addEventListener("click", e => {
  if (e.target === modal || e.target.classList.contains("modal-close")) {
    modal.classList.remove("show");
  }
});

/* =========================
   描画
========================= */
function renderTrades() {
  elTradeBody.innerHTML = "";

  const filtered = getFilteredTrades();
  const colCount = isMobile() ? 1 : 8;

  if (!filtered.length) {
    elTradeBody.innerHTML = `
      <tr>
        <td colspan="${colCount}" style="text-align:center;padding:20px;color:#888;">
          取引履歴はありません
        </td>
      </tr>`;
    btnLoadMore.style.display = "none";
    return;
  }

  const limit = isMobile() ? LOAD_COUNT : displayCount;
  const slice = filtered.slice(0, limit);

  slice.forEach(t => {
    const cls = Number(t.profit) >= 0 ? "profit" : "loss";

    if (isMobile()) {
      elTradeBody.insertAdjacentHTML("beforeend", `
        <tr class="trade-row-sp" data-trade='${JSON.stringify(t)}'>
          <td>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <strong>${t.symbol} ${t.side}</strong>
              <span style="color:#bbb;font-size:18px;">›</span>
            </div>
            <div class="${cls}" style="margin-top:4px;">
              損益 ${fmtNum(t.profit)}
            </div>
            <div style="font-size:11px;color:#888;margin-top:2px;">
              ${fmtDate(t.closedAt)}
            </div>
          </td>
        </tr>
      `);
    } else {
      elTradeBody.insertAdjacentHTML("beforeend", `
        <tr>
          <td>${t.id}</td>
          <td>${t.symbol}</td>
          <td>${t.side}</td>
          <td>${fmtNum(t.size)}</td>
          <td>${fmtNum(t.entryPrice)}</td>
          <td>${fmtNum(t.closePrice)}</td>
          <td class="${cls}">${fmtNum(t.profit)}</td>
          <td>${fmtDate(t.closedAt)}</td>
        </tr>
      `);
    }
  });

  btnLoadMore.style.display =
    isMobile() || displayCount >= filtered.length ? "none" : "inline-block";
}

/* =========================
   イベント委譲（スマホ行タップ）
========================= */
elTradeBody.addEventListener("click", e => {
  if (!isMobile()) return;
  const row = e.target.closest("tr[data-trade]");
  if (!row) return;
  openModal(JSON.parse(row.dataset.trade));
});

/* =========================
   続きを見る（PC）
========================= */
btnLoadMore.addEventListener("click", () => {
  displayCount += LOAD_COUNT;
  renderTrades();
});

/* =========================
   初期化
========================= */
(async function init() {
  try {
    trades = await getTradeHistory();
    elMsg.textContent = "取引履歴を更新しました。";
    elMsg.style.color = "green";
    renderTrades();
  } catch (e) {
    console.error(e);
    elMsg.textContent = "取引履歴の取得に失敗しました。";
    elMsg.style.color = "red";
  }
})();

window.addEventListener("resize", renderTrades);
