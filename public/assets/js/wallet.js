import { getWallet } from "./api/wallet.api.js";
import { requestDeposit } from "./api/deposit.api.js";
import { requestWithdraw } from "./api/withdraw.api.js";

import {
  getBankAccount,
  getCryptoAddresses,
} from "./api/profile.api.js";

/* =========================
   DOM
========================= */
const elTotal = document.getElementById("wallet-total");
const elAvail = document.getElementById("wallet-available");
const elLock  = document.getElementById("wallet-locked");
const elHistBody = document.getElementById("wallet-history");
const toast = document.getElementById("wallet-message");

/* =========================
   History State
========================= */
let allTransfers = [];
let historyFilter = "ALL"; // ALL | DEPOSIT | WITHDRAW
let visibleCount = 10;

/* =========================
   util
========================= */
function showToast(msg, color = "green") {
  const targets = [
    "wallet-message",
    "jpy-message",
    "crypto-message",
    "withdraw-jpy-message",
    "withdraw-crypto-message",
  ];

  for (const id of targets) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = msg;
      el.style.color = color;
      return;
    }
  }

  alert(msg);
}

function formatJPY(v) {
  return Math.floor(Number(v ?? 0)).toLocaleString("ja-JP") + " 円";
}

function typeJP(type) {
  return type === "DEPOSIT" ? "入金"
       : type === "WITHDRAW" ? "出金"
       : "-";
}

function statusJP(status) {
  return status === "PENDING"   ? "申請中"
       : status === "COMPLETED" ? "完了"
       : status === "CANCELED"  ? "キャンセル"
       : "-";
}

/* =========================
   Wallet Load
========================= */
async function loadWalletPage() {
  const data = await getWallet();
  const w = data.wallet || {};

  elTotal.textContent = formatJPY(w.balanceTotal);
  elAvail.textContent = formatJPY(w.balanceAvailable);
  elLock.textContent  = formatJPY(w.balanceLocked);

  // ★ 全履歴を保存
  allTransfers = data.transfers || [];

  renderHistory();
}

/* =========================
   History Render
========================= */
function renderHistory() {
  elHistBody.innerHTML = "";

  let list = allTransfers;

  if (historyFilter !== "ALL") {
    list = list.filter(t => t.type === historyFilter);
  }

  const sliced = list.slice(0, visibleCount);

  if (!sliced.length) {
    elHistBody.innerHTML =
      `<tr><td colspan="6" style="text-align:center;">履歴はありません</td></tr>`;
    return;
  }

  sliced.forEach(t => {
    elHistBody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${t.id}</td>
        <td>${typeJP(t.type)}</td>
        <td>${t.method === "CRYPTO" ? t.currency : "JPY"}</td>
        <td>${formatJPY(t.amount)}</td>
        <td>${statusJP(t.status)}</td>
        <td>${new Date(t.createdAt).toLocaleString("ja-JP")}</td>
      </tr>
    `);
  });

  // もっと見る表示制御
  const btn = document.getElementById("history-load-more");
  if (btn) {
    btn.style.display = list.length > visibleCount ? "block" : "none";
  }
}

/* =========================
   History Tabs
========================= */
document.getElementById("tab-history-all")?.addEventListener("click", () => {
  historyFilter = "ALL";
  visibleCount = 10;
  setActiveTab("all");
  renderHistory();
});

document.getElementById("tab-history-deposit")?.addEventListener("click", () => {
  historyFilter = "DEPOSIT";
  visibleCount = 10;
  setActiveTab("deposit");
  renderHistory();
});

document.getElementById("tab-history-withdraw")?.addEventListener("click", () => {
  historyFilter = "WITHDRAW";
  visibleCount = 10;
  setActiveTab("withdraw");
  renderHistory();
});

function setActiveTab(type) {
  ["all", "deposit", "withdraw"].forEach(t => {
    document
      .getElementById(`tab-history-${t}`)
      ?.classList.remove("active");
  });

  document
    .getElementById(`tab-history-${type}`)
    ?.classList.add("active");
}

/* =========================
   Load More
========================= */
document.getElementById("history-load-more")?.addEventListener("click", () => {
  visibleCount += 10;
  renderHistory();
});

/* =========================
   Init
========================= */
loadWalletPage();


/* =========================
   出金前チェック
========================= */
async function checkWithdrawDestination(method) {
  if (method === "JPY") {
    try {
      await getBankAccount();
    } catch {
      showToast("銀行口座が未登録です。マイページで登録してください。", "red");
      setTimeout(() => location.href = "/mypage.html", 1500);
      return false;
    }
  }

  if (method === "CRYPTO") {
    try {
      const list = await getCryptoAddresses();
      const currency = normalizeCurrency(
        document.getElementById("withdraw-crypto-currency").value
      );

      const hasAddress = list.some(a => a.currency === currency);
      if (!hasAddress) throw new Error();
    } catch {
      showToast("選択した暗号資産の出金アドレスが未登録です。", "red");
      setTimeout(() => location.href = "/mypage.html", 1500);
      return false;
    }
  }

  return true;
}


/* =========================
   入金タブ切替
========================= */
const tabJPY = document.getElementById("tab-deposit-jpy");
const tabCRYPTO = document.getElementById("tab-deposit-crypto");
const formJPY = document.getElementById("deposit-jpy-form");
const formCRYPTO = document.getElementById("deposit-crypto-form");

if (tabJPY && tabCRYPTO) {
  tabJPY.onclick = () => {
    tabJPY.classList.add("active");
    tabCRYPTO.classList.remove("active");
    formJPY.style.display = "block";
    formCRYPTO.style.display = "none";
  };

  tabCRYPTO.onclick = () => {
    tabCRYPTO.classList.add("active");
    tabJPY.classList.remove("active");
    formCRYPTO.style.display = "block";
    formJPY.style.display = "none";
  };
}

/* =========================
   出金タブ切替
========================= */
const tabWithdrawJPY = document.getElementById("tab-withdraw-jpy");
const tabWithdrawCrypto = document.getElementById("tab-withdraw-crypto");
const withdrawJPYForm = document.getElementById("withdraw-jpy-form");
const withdrawCryptoForm = document.getElementById("withdraw-crypto-form");

if (tabWithdrawJPY && tabWithdrawCrypto) {
  tabWithdrawJPY.onclick = () => {
    tabWithdrawJPY.classList.add("active");
    tabWithdrawCrypto.classList.remove("active");
    withdrawJPYForm.style.display = "block";
    withdrawCryptoForm.style.display = "none";
  };

  tabWithdrawCrypto.onclick = () => {
    tabWithdrawCrypto.classList.add("active");
    tabWithdrawJPY.classList.remove("active");
    withdrawCryptoForm.style.display = "block";
    withdrawJPYForm.style.display = "none";
  };
}

/* =========================
   Init
========================= */
(async function init() {
  try {
    await loadWalletPage();
  } catch {
    showToast("ウォレット情報の取得に失敗しました", "red");
  }
})();

/* =========================================================
   入金（日本円）
========================================================= */
const btnJpySubmit = document.getElementById("deposit-jpy-submit");

if (btnJpySubmit) {
  btnJpySubmit.onclick = async () => {
    const amount = Number(document.getElementById("deposit-jpy-amount").value);
    if (!amount || amount <= 0) {
      showToast("入金金額を入力してください", "red");
      return;
    }

    try {
      await requestDeposit({
        method: "JPY",
        amount,
        currency: "JPY",
      });

      location.href = "/deposit-thanks.html";
    } catch {
      showToast("入金申請に失敗しました", "red");
    }
  };
}

/* =========================================================
   入金（暗号資産）：レート計算
========================================================= */
const cryptoJPY = document.getElementById("deposit-crypto-jpy");
const cryptoCurrency = document.getElementById("deposit-crypto-currency");
const cryptoAmountEl = document.getElementById("deposit-crypto-amount");
const depositRateInfo = document.getElementById("deposit-rate-info");

/* === FIX START : レート & 通貨正規化 === */
let rateCache = { BTC: null, ETH: null, updatedAt: 0 };
const RATE_EXPIRE = 60 * 1000;

function normalizeCurrency(v) {
  if (v === "bitcoin" || v === "BTC") return "BTC";
  if (v === "ethereum" || v === "ETH") return "ETH";
  return null;
}

async function getRates() {
  const now = Date.now();
  if (now - rateCache.updatedAt < RATE_EXPIRE) return rateCache;

  const res = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=jpy"
  );
  if (!res.ok) throw new Error();

  const r = await res.json();
  rateCache = {
    BTC: r.bitcoin.jpy,
    ETH: r.ethereum.jpy,
    updatedAt: now,
  };
  return rateCache;
}
/* === FIX END === */

async function updateDepositRate() {
  const jpy = Number(cryptoJPY.value);

  if (!jpy || jpy <= 0) {
    cryptoAmountEl.value = "";
    depositRateInfo.textContent = "";
    return;
  }

  try {
    const rates = await getRates();
    const key = normalizeCurrency(cryptoCurrency.value);
    const price = rates[key];
    if (!price) throw new Error();

    cryptoAmountEl.value = (jpy / price).toFixed(8);
    depositRateInfo.textContent =
      `${key} レート: ${price.toLocaleString()} JPY`;
  } catch {
    cryptoAmountEl.value = "";
    depositRateInfo.textContent = "";
  }
}

if (cryptoJPY) cryptoJPY.oninput = updateDepositRate;
if (cryptoCurrency) cryptoCurrency.onchange = updateDepositRate;

/* =========================================================
   入金（暗号資産）：申請
========================================================= */
const btnCryptoSubmit = document.getElementById("deposit-crypto-submit");

if (btnCryptoSubmit) {
  btnCryptoSubmit.onclick = async () => {
    const jpy = Number(cryptoJPY.value);
    const cryptoAmount = Number(cryptoAmountEl.value);

    if (!jpy || !cryptoAmount) {
      showToast("金額が正しくありません", "red");
      return;
    }

    try {
      await requestDeposit({
        method: "CRYPTO",
        currency: normalizeCurrency(cryptoCurrency.value),
        amount: jpy,
        cryptoAmount,
      });

      location.href = "/crypto-thanks.html";
    } catch {
      showToast("暗号資産入金に失敗しました", "red");
    }
  };
}

/* =========================================================
   出金（日本円）
========================================================= */
const btnWithdrawJPY = document.getElementById("withdraw-jpy-submit");

if (btnWithdrawJPY) {
  btnWithdrawJPY.onclick = async () => {
    const amount = Number(document.getElementById("withdraw-jpy-amount").value);

    if (!amount || amount <= 0) {
      showToast("出金額を入力してください", "red");
      return;
    }

    if (!(await checkWithdrawDestination("JPY"))) return;

    try {
      await requestWithdraw({
  method: "JPY",
  amount: String(amount), // ★
});


      showToast("出金申請を受け付けました");
      loadWalletPage();
    } catch {
      showToast("出金申請に失敗しました", "red");
    }
  };
}

/* =========================================================
   出金（暗号資産）：レート計算
========================================================= */
const withdrawCryptoJPY = document.getElementById("withdraw-crypto-jpy");
const withdrawCryptoCurrency = document.getElementById("withdraw-crypto-currency");
const withdrawCryptoAmount = document.getElementById("withdraw-crypto-amount");
const withdrawRateInfo = document.getElementById("withdraw-rate-info");

async function updateWithdrawRate() {
  const jpy = Number(withdrawCryptoJPY.value);

  if (!jpy || jpy <= 0) {
    withdrawCryptoAmount.value = "";
    withdrawRateInfo.textContent = "";
    return;
  }

  try {
    const rates = await getRates();
    const key = normalizeCurrency(withdrawCryptoCurrency.value);
    const price = rates[key];
    if (!price) throw new Error();

    withdrawCryptoAmount.value = (jpy / price).toFixed(8);
    withdrawRateInfo.textContent =
      `${key} レート: ${price.toLocaleString()} JPY`;
  } catch {
    withdrawCryptoAmount.value = "";
    withdrawRateInfo.textContent = "";
  }
}

if (withdrawCryptoJPY) withdrawCryptoJPY.oninput = updateWithdrawRate;
if (withdrawCryptoCurrency) withdrawCryptoCurrency.onchange = updateWithdrawRate;

/* =========================================================
   出金（暗号資産）：申請
========================================================= */
const btnWithdrawCrypto = document.getElementById("withdraw-crypto-submit");

if (btnWithdrawCrypto) {
  btnWithdrawCrypto.onclick = async () => {
    const jpy = Number(withdrawCryptoJPY.value);
    const cryptoAmount = Number(withdrawCryptoAmount.value);

    if (!jpy || !cryptoAmount) {
      showToast("金額が正しくありません", "red");
      return;
    }

    if (!(await checkWithdrawDestination("CRYPTO"))) return;

    try {
      await requestWithdraw({
  method: "CRYPTO",
  currency: normalizeCurrency(withdrawCryptoCurrency.value),
  amount: String(jpy),                 // ★ 文字列化
  cryptoAmount: String(cryptoAmount),  // ★ 文字列化
});


      showToast("出金申請を受け付けました");
      loadWalletPage();
    } catch {
      showToast("暗号資産出金に失敗しました", "red");
    }
  };
}
