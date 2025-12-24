// ========================================
// Exchange Page Script
// ========================================

import { fetchMe, logout } from "./api/exchange.api.js";

/* ======================================
   Market Data（今は仮）
====================================== */
const markets = [
  { symbol:"BTC/USD", tv:"BINANCE:BTCUSDT", name:"Bitcoin", price:67420 },
  { symbol:"ETH/USD", tv:"BINANCE:ETHUSDT", name:"Ethereum", price:3120 },
  { symbol:"SOL/USD", tv:"BINANCE:SOLUSDT", name:"Solana", price:178 },
];

let currentMarket = markets[0];

/* ======================================
   Market UI
====================================== */
function renderMarketTabs() {
  const wrap = document.getElementById("market-tabs");
  wrap.innerHTML = "";

  markets.forEach(m => {
    const tab = document.createElement("div");
    tab.className = "market-tab" + (m === currentMarket ? " active" : "");
    tab.textContent = m.symbol.replace("/USD","");

    tab.onclick = () => selectMarket(m);
    wrap.appendChild(tab);
  });
}

function renderMarketList() {
  const list = document.getElementById("market-list");
  list.innerHTML = "";

  markets.forEach(m => {
    const item = document.createElement("div");
    item.className = "market-item" + (m === currentMarket ? " active" : "");
    item.innerHTML = `
      <div>
        <div>${m.symbol}</div>
        <div>${m.name}</div>
      </div>
      <div>${m.price}</div>
    `;
    item.onclick = () => selectMarket(m);
    list.appendChild(item);
  });
}

function selectMarket(market) {
  currentMarket = market;
  renderMarketTabs();
  renderMarketList();
  updateMarketInfo();
  initTradingView(market.tv);
  generateOrderbook();
  generateTrades();
}

/* ======================================
   Chart
====================================== */
function updateMarketInfo() {
  document.getElementById("chartSymbolMain").textContent =
    currentMarket.symbol.replace("/", " / ");
  document.getElementById("chartSymbolSub").textContent =
    `${currentMarket.name} · 現物`;
}

function initTradingView(symbol) {
  document.getElementById("tv_chart").innerHTML = "";
  new TradingView.widget({
    container_id:"tv_chart",
    symbol,
    interval:"15",
    timezone:"Asia/Tokyo",
    theme:"light",
    locale:"ja",
    autosize:true
  });
}

/* ======================================
   Mock Data（後でAPIに置換）
====================================== */
function generateOrderbook() {
  const el = document.getElementById("orderbook");
  el.innerHTML = "";
  for(let i=0;i<12;i++){
    el.innerHTML += `<div class="orderbook-row">${(Math.random()*1000).toFixed(2)}</div>`;
  }
}

function generateTrades() {
  const el = document.getElementById("recent-trades");
  el.innerHTML = "";
  for(let i=0;i<14;i++){
    el.innerHTML += `<div class="trade-row">${(Math.random()*1000).toFixed(2)}</div>`;
  }
}

/* ======================================
   System Trade Restriction
====================================== */
function showSystemTradeAlert() {
  alert(
    "この画面はシステム取引専用口座です。\n" +
    "手動での売買はできません。"
  );
}

function overrideOrderButtons() {
  document.querySelectorAll(".order-btn-buy, .order-btn-sell")
    .forEach(btn => {
      btn.onclick = e => {
        e.preventDefault();
        showSystemTradeAlert();
      };
    });
}


/* ======================================
   INIT
====================================== */
document.addEventListener("DOMContentLoaded", () => {
  renderMarketTabs();
  renderMarketList();
  updateMarketInfo();
  initTradingView(currentMarket.tv);
  generateOrderbook();
  generateTrades();
  overrideOrderButtons();
});
