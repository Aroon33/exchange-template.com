import { getMe } from "./api/user.api.js";
import { getWallet } from "./api/wallet.api.js";
import { getKycStatus } from "./api/kyc.api.js";
import {
  getBankAccount,
  saveBankAccount,
  getCryptoAddresses,
  saveCryptoAddresses,
} from "./api/profile.api.js";

/* =========================
   DOM
========================= */
const elMsg = document.getElementById("mypage-message");

const elEmail = document.getElementById("my-email");
const elName = document.getElementById("my-name");
const elGroup = document.getElementById("my-group");

const elKycPill = document.getElementById("my-kyc-pill");

const elBalTotal = document.getElementById("my-balance-total");
const elBalAvail = document.getElementById("my-balance-available");
const elBalLock = document.getElementById("my-balance-locked");

/* =========================
   util
========================= */
function fmtAmount(n) {
  return (
    Number(n ?? 0).toLocaleString("en-US", {
      maximumFractionDigits: 0,
    }) + " JPY"
  );
}

/* =========================
   Loaders
========================= */
async function loadMe() {
  const data = await getMe();

  // ★ ここが重要
  const u = data.user || data;

  elEmail.textContent = u.email ?? "-";
  elName.textContent  = u.name ?? "-";
  elGroup.textContent = u.groupId ?? "-";
}


async function loadKyc() {
  const k = await getKycStatus();
  const lv = Number(k.level ?? 0);
  elKycPill.textContent = `レベル ${lv}`;
  elKycPill.className = `kyc-pill kyc-${lv}`;
}

async function loadWallet() {
  const d = await getWallet();
  const w = d.wallet || {};
  elBalTotal.textContent = fmtAmount(w.balanceTotal);
  elBalAvail.textContent = fmtAmount(w.balanceAvailable);
  elBalLock.textContent = fmtAmount(w.balanceLocked);
}

async function loadBank() {
  const bank = await getBankAccount();
  if (!bank) return;

  document.getElementById("bank-name").value = bank.bankName || "";
  document.getElementById("bank-branch").value = bank.branchName || "";
  document.getElementById("bank-type").value = bank.accountType || "普通";
  document.getElementById("bank-number").value = bank.accountNumber || "";
  document.getElementById("bank-holder").value = bank.accountHolder || "";
}

async function loadCrypto() {
  const list = await getCryptoAddresses();
  if (!list) return;

  list.forEach(c => {
    if (c.currency === "BTC")
      document.getElementById("crypto-btc").value = c.address;
    if (c.currency === "ETH")
      document.getElementById("crypto-eth").value = c.address;
    if (c.currency === "USDT")
      document.getElementById("crypto-usdt").value = c.address;
  });
}

/* =========================
   Save handlers
========================= */
document.getElementById("save-bank").onclick = async () => {
  try {
    await saveBankAccount({
      bankName: document.getElementById("bank-name").value,
      branchName: document.getElementById("bank-branch").value,
      accountType: document.getElementById("bank-type").value,
      accountNumber: document.getElementById("bank-number").value,
      accountHolder: document.getElementById("bank-holder").value,
    });

    document.getElementById("bank-msg").textContent = "銀行情報を保存しました";
  } catch {
    document.getElementById("bank-msg").textContent = "保存に失敗しました";
  }
};

document.getElementById("save-crypto").onclick = async () => {
  const payload = {
    addresses: [
      { currency: "BTC", address: document.getElementById("crypto-btc").value },
      { currency: "ETH", address: document.getElementById("crypto-eth").value },
      { currency: "USDT", address: document.getElementById("crypto-usdt").value },
    ].filter(a => a.address),
  };

  if (!payload.addresses.length) return;

  await saveCryptoAddresses(payload);
  document.getElementById("crypto-msg").textContent =
    "暗号通貨アドレスを保存しました";
};

/* =========================
   Init
========================= */
(async function init() {
  try {
    await Promise.all([
      loadMe(),
      loadKyc(),
      loadWallet(),
      loadBank(),
      loadCrypto(),
    ]);

    elMsg.textContent = "最新情報を取得しました。";
    elMsg.style.color = "green";
  } catch (e) {
    console.error(e);
    elMsg.textContent =
      "情報取得に失敗しました。ログイン状態を確認してください。";
    elMsg.style.color = "red";
  }
})();
