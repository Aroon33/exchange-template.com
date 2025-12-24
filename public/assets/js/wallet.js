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
const elLock = document.getElementById("wallet-locked");
const elHistBody = document.getElementById("wallet-history");
const toast = document.getElementById("wallet-message");

/* =========================
   util
========================= */
function showToast(msg, color = "green") {
  if (!toast) return;
  toast.textContent = msg;
  toast.style.color = color;
}

function formatJPY(v) {
  return Math.floor(Number(v ?? 0)).toLocaleString("ja-JP") + " 円";
}

function typeJP(type) {
  return type === "DEPOSIT" ? "入金" :
         type === "WITHDRAW" ? "出金" : "-";
}

function statusJP(status) {
  return status === "PENDING" ? "申請中" :
         status === "COMPLETED" ? "完了" :
         status === "CANCELED" ? "キャンセル" : "-";
}

/* =========================
   Wallet 表示
========================= */
async function loadWalletPage() {
  const data = await getWallet();
  const w = data.wallet || {};
  const trs = data.transfers || [];

  elTotal.textContent = formatJPY(w.balanceTotal);
  elAvail.textContent = formatJPY(w.balanceAvailable);
  elLock.textContent = formatJPY(w.balanceLocked);

  elHistBody.innerHTML = "";
  if (!trs.length) {
    elHistBody.innerHTML =
      `<tr><td colspan="6" style="text-align:center;">履歴はありません</td></tr>`;
    return;
  }

  trs.forEach(t => {
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
}

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
      if (!list.length) throw new Error();
    } catch {
      showToast("暗号資産アドレスが未登録です。マイページで登録してください。", "red");
      setTimeout(() => location.href = "/mypage.html", 1500);
      return false;
    }
  }

  return true;
}

/* =========================
   入金タブ切替
========================= */
const tabJPY = document.getElementById("tab-jpy");
const tabCRYPTO = document.getElementById("tab-crypto");
const formJPY = document.getElementById("jpy-form");
const formCRYPTO = document.getElementById("crypto-form");

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
  } catch (e) {
    showToast("ウォレット情報の取得に失敗しました", "red");
  }
})();

/* =========================================================
   入金（日本円）
========================================================= */
const btnJpySubmit = document.getElementById("jpy-submit");

if (btnJpySubmit) {
  btnJpySubmit.onclick = async () => {
    const amount = Number(document.getElementById("jpy-amount").value);

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
    } catch (e) {
      showToast("入金申請に失敗しました", "red");
    }
  };
}

/* =========================================================
   入金（暗号資産）：レート計算
========================================================= */
const cryptoJPY = document.getElementById("crypto-jpy");
const cryptoCurrency = document.getElementById("crypto-currency");
const cryptoAmountEl = document.getElementById("crypto-amount");

const depositRateInfo = document.getElementById("deposit-rate-info");

depositRateInfo.textContent =
  `${cryptoCurrency.value} レート: ${price.toLocaleString()} JPY`;





async function updateDepositRate() {
  const jpy = Number(cryptoJPY.value);

  if (!jpy || jpy <= 0) {
    cryptoAmountEl.value = "";
    return;
  }

  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=jpy"
    );
    const r = await res.json();

    const price =
      cryptoCurrency.value === "BTC"
        ? r.bitcoin.jpy
        : r.ethereum.jpy;

    cryptoAmountEl.value = (jpy / price).toFixed(8);
  } catch {
    cryptoAmountEl.value = "";
  }
}

if (cryptoJPY) cryptoJPY.oninput = updateDepositRate;
if (cryptoCurrency) cryptoCurrency.onchange = updateDepositRate;

/* =========================================================
   入金（暗号資産）：申請
========================================================= */
const btnCryptoSubmit = document.getElementById("crypto-submit");

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
        currency: cryptoCurrency.value,
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

    // 出金先（銀行口座）チェック
    if (!(await checkWithdrawDestination("JPY"))) return;

    try {
      await requestWithdraw({
        method: "JPY",
        amount,
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

withdrawRateInfo.textContent =
  `${withdrawCryptoCurrency.value} レート: ${price.toLocaleString()} JPY`;



async function updateWithdrawRate() {
  const jpy = Number(withdrawCryptoJPY.value);

  if (!jpy || jpy <= 0) {
    withdrawCryptoAmount.value = "";
    return;
  }

  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=jpy"
    );
    const r = await res.json();

    const price =
      withdrawCryptoCurrency.value === "BTC"
        ? r.bitcoin.jpy
        : r.ethereum.jpy;

    withdrawCryptoAmount.value = (jpy / price).toFixed(8);
  } catch {
    withdrawCryptoAmount.value = "";
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

    // 出金先（暗号資産アドレス）チェック
    if (!(await checkWithdrawDestination("CRYPTO"))) return;

    try {
      await requestWithdraw({
        method: "CRYPTO",
        currency: withdrawCryptoCurrency.value,
        amount: jpy,
        cryptoAmount,
      });

      showToast("出金申請を受け付けました");
      loadWalletPage();
    } catch {
      showToast("暗号資産出金に失敗しました", "red");
    }
  };
}


