import { getMe } from "./api/auth.api.js";
import {
  getUserProfile,
  createUserProfile,
  getBankAccount,
  saveBankAccount,
  getCryptoAddresses,
  saveCryptoAddresses,
} from "./api/profile.api.js";
import { getKycStatus } from "./api/kyc.api.js";

/* =========================
   STATE
========================= */
let currentUser = null;

/* =========================
   AUTH GUARD
========================= */
async function guardUser() {
  try {
    const res = await getMe();

    if (res.user?.role === "ADMIN") {
      location.href = "/admin/index.html";
      return;
    }

    currentUser = res.user;
  } catch {
    location.href = "/login.html";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     DOM
  ========================= */
  const elMsg = document.getElementById("mypage-message");

  /* --- account --- */
  const elEmail = document.getElementById("my-email");
  const elName  = document.getElementById("my-name");
  const elKycPill = document.getElementById("my-kyc-pill");

  /* --- modal --- */
  const modal = document.getElementById("profile-modal");
  const openModalBtn = document.getElementById("open-profile-modal");
  const closeModalBtn = document.getElementById("close-profile-modal");

  const bankSection   = document.getElementById("bank-section");
  const cryptoSection = document.getElementById("crypto-section");


  const modalEmail = document.getElementById("modal-email");
  const modalName  = document.getElementById("modal-name");
  const modalKyc   = document.getElementById("modal-kyc");

  /* --- modal withdraw info --- */
const modalBank = document.getElementById("modal-bank");
const modalBtc  = document.getElementById("modal-btc");
const modalEth  = document.getElementById("modal-eth");
const modalUsdt = document.getElementById("modal-usdt");


  /* --- UserProfile view --- */
  const elDob     = document.getElementById("profile-dob");
  const elGender  = document.getElementById("profile-gender");
  const elAddress = document.getElementById("profile-address");
  const elPhone   = document.getElementById("profile-phone");

  /* --- UserProfile setup --- */
  const profileSetup = document.getElementById("profile-setup");
  const pDob     = document.getElementById("p-dob");
  const pGender  = document.getElementById("p-gender");
  const pAddress = document.getElementById("p-address");
  const pCity    = document.getElementById("p-city");
  const pPostal  = document.getElementById("p-postal");
  const pCountry = document.getElementById("p-country");
  const pPhone   = document.getElementById("p-phone");
  const saveProfileBtn = document.getElementById("save-profile");
  const profileMsg = document.getElementById("profile-msg");



  /* =========================
     Loaders
  ========================= */
  async function loadMe() {
    if (!currentUser) return;

    elEmail.textContent = currentUser.email ?? "-";
    elName.textContent  = currentUser.name ?? "-";

    modalEmail.textContent = currentUser.email ?? "-";
    modalName.textContent  = currentUser.name ?? "-";
  }

  async function loadKyc() {
    const k = await getKycStatus();
    const lv = Number(k.level ?? 0);

    elKycPill.textContent = `レベル ${lv}`;
    elKycPill.className = `kyc-pill kyc-${lv}`;
    modalKyc.textContent = `レベル ${lv}`;
  }

  async function loadUserProfile() {
  let profile = null;

  try {
    profile = await getUserProfile();
  } catch {
    profile = null;
  }

  // 未登録（正常）
  if (!profile || Object.keys(profile).length === 0) {
    profileSetup.classList.remove("hidden");

    elMsg.textContent =
      "はじめにプロフィール情報を登録してください。";
    elMsg.style.color = "#b45309";

    return;
  }

  // 登録済み
  profileSetup.classList.add("hidden");

  elDob.textContent = profile.dateOfBirth
    ? new Date(profile.dateOfBirth).toLocaleDateString("ja-JP")
    : "-";

  elGender.textContent = profile.gender ?? "-";
  elAddress.textContent =
    [profile.postalCode, profile.country, profile.city, profile.address]
      .filter(Boolean)
      .join(" ");

  elPhone.textContent = profile.phone ?? "-";
}



  async function loadBank() {
  const bank = await getBankAccount();

  // 未登録
  if (!bank) {
    modalBank.textContent = "未登録";
    bankSection.classList.remove("hidden");
    return;
  }

  // 登録済み → フォーム非表示
  bankSection.classList.add("hidden");

  // モーダル表示
  modalBank.textContent =
    `${bank.bankName} ${bank.branchName} / ${bank.accountType} ${bank.accountNumber}`;
}



  async function loadCrypto() {
  const list = await getCryptoAddresses();

  // 未登録
  if (!list || !list.length) {
    modalBtc.textContent  = "未登録";
    modalEth.textContent  = "未登録";
    modalUsdt.textContent = "未登録";
    cryptoSection.classList.remove("hidden");
    return;
  }

  // 登録済み → フォーム非表示
  cryptoSection.classList.add("hidden");

  list.forEach(c => {
    if (c.currency === "BTC")  modalBtc.textContent  = c.address;
    if (c.currency === "ETH")  modalEth.textContent  = c.address;
    if (c.currency === "USDT") modalUsdt.textContent = c.address;
  });
}



  /* =========================
     Save handlers
  ========================= */
  saveProfileBtn?.addEventListener("click", async () => {
    try {
      await createUserProfile({
        dateOfBirth: pDob.value,
        gender: pGender.value,
        address: pAddress.value,
        city: pCity.value,
        postalCode: pPostal.value,
        country: pCountry.value,
        phone: pPhone.value,
      });

      profileMsg.textContent = "プロフィールを登録しました。";
      profileMsg.style.color = "green";

      await loadUserProfile();
    } catch {
      profileMsg.textContent = "登録に失敗しました。";
      profileMsg.style.color = "red";
    }
  });

  document.getElementById("save-bank").onclick = async () => {
    try {
      await saveBankAccount({
        bankName: document.getElementById("bank-name").value,
        branchName: document.getElementById("bank-branch").value,
        accountType: document.getElementById("bank-type").value,
        accountNumber: document.getElementById("bank-number").value,
        accountHolder: document.getElementById("bank-holder").value,
      });

      document.getElementById("bank-msg").textContent =
        "銀行情報を保存しました";
    } catch {
      document.getElementById("bank-msg").textContent =
        "保存に失敗しました";
    }
  };

  document.getElementById("save-crypto").onclick = async () => {
    try {
      const payload = {
        addresses: [
          { currency: "BTC",  address: document.getElementById("crypto-btc").value },
          { currency: "ETH",  address: document.getElementById("crypto-eth").value },
          { currency: "USDT", address: document.getElementById("crypto-usdt").value },
        ].filter(a => a.address),
      };

      if (!payload.addresses.length) return;

      await saveCryptoAddresses(payload);

      document.getElementById("crypto-msg").textContent =
        "暗号通貨アドレスを保存しました";
    } catch {
      document.getElementById("crypto-msg").textContent =
        "保存に失敗しました";
    }
  };

  document.getElementById("edit-profile-btn")?.addEventListener("click", () => {
  modal.classList.add("hidden");
  document.getElementById("profile-setup")?.scrollIntoView({ behavior: "smooth" });
});

document.getElementById("edit-withdraw-btn")?.addEventListener("click", () => {
  modal.classList.add("hidden");
  document.getElementById("bank-section")?.scrollIntoView({ behavior: "smooth" });
});


  /* =========================
     Modal
  ========================= */
  openModalBtn.onclick = () => modal.classList.remove("hidden");
  closeModalBtn.onclick = () => modal.classList.add("hidden");
  modal.querySelector(".modal-overlay").onclick = () =>
    modal.classList.add("hidden");

  /* =========================
     Init
  ========================= */
  (async function init() {
    await guardUser();

    try {
      await Promise.all([
        loadMe(),
        loadKyc(),
        loadUserProfile(),
        loadBank(),
        loadCrypto(),
      ]);

      elMsg.textContent = "最新のアカウント情報を取得しました。";
      elMsg.style.color = "green";
    } catch (e) {
      console.error(e);
      elMsg.textContent =
        "情報取得に失敗しました。再ログインしてください。";
      elMsg.style.color = "red";
    }
  })();
});
