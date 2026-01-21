import { CONFIG } from "../config.js";


async function apiGet(path) {
  const res = await fetch(CONFIG.API_BASE_URL + path, { credentials:"include" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function apiPostForm(path, form) {
  const res = await fetch(CONFIG.API_BASE_URL + path, {
    method:"POST",
    credentials:"include",
    body: form,
  });
  const txt = await res.text();
  if (!res.ok) throw new Error(txt);
  return JSON.parse(txt);
}

/* -------------------------
    KYC ステータス読み込み
--------------------------*/
async function loadKycStatus(){
  const data = await apiGet("/kyc/status");
  const status = data.status;
  const level  = data.level ?? 0;

  const pill = document.getElementById("kyc-level-pill");
  pill.textContent = `レベル ${level}`;
  pill.className = `kyc-pill kyc-${level}`;

  const statusEl = document.getElementById("kyc-status");
  const msgEl    = document.getElementById("kyc-msg");
  const formEl   = document.getElementById("kyc-form");

  switch(status){
    case 0:
      statusEl.textContent = "ステータス：未提出";
      msgEl.textContent = "下記より本人確認書類を提出してください。";
      formEl.style.display = "block";
      break;

    case 1:
      statusEl.textContent = "ステータス：提出済み（確認待ち）";
      msgEl.textContent = "審査中です。";
      formEl.style.display = "none";
      break;

    case 2:
      statusEl.textContent = "ステータス：審査中";
      msgEl.textContent = "審査結果をお待ちください。";
      formEl.style.display = "none";
      break;

    case 3:
      statusEl.textContent = "ステータス：承認（一次）";
      msgEl.textContent = "最終確認中です。";
      formEl.style.display = "none";
      break;

    case 4:
      statusEl.textContent = "ステータス：否認";
      msgEl.textContent = "問題がありました。書類を再提出してください。";
      formEl.style.display = "block";
      break;

    case 5:
      statusEl.textContent = "ステータス：KYC 完了";
      msgEl.textContent = "本人確認が完了しました。すべての機能が利用できます。";
      formEl.style.display = "none";
      break;

    default:
      statusEl.textContent = "ステータス";
      formEl.style.display = "block";
  }
}

/* -------------------------
       KYC 提出
--------------------------*/
document.getElementById("submit-kyc").onclick = async ()=>{

  const front = document.getElementById("front-file").files[0];
  const back  = document.getElementById("back-file").files[0];
  const msg   = document.getElementById("kyc-msg");

  const header = document.getElementById("header-area");
if (!header) return;


  if(!front || !back){
    msg.textContent = "両方の画像を選択してください。";
    msg.style.color = "red";
    return;
  }

  const form = new FormData();
  form.append("files", front);
  form.append("files", back);

  try{
    await apiPostForm("/kyc/submit", form);
    msg.textContent = "提出しました。審査中です。";
    msg.style.color = "green";
    loadKycStatus();
  } catch(e){
    msg.textContent = "提出に失敗しました。";
    msg.style.color = "red";
  }
};

/* -------------------------
       初期ロード
--------------------------*/
loadKycStatus().catch(()=>{
  document.getElementById("kyc-msg").textContent = "KYC情報の取得に失敗しました。";
});

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



/* =========================
   ヘッダー：ログイン状態反映
========================= */
async function updateHeaderUserState() {
  const headerActions = document.querySelector(".header-actions");
  if (!headerActions) return;

  try {
    const res = await fetch(CONFIG.API_BASE_URL + "/auth/me", {
      credentials: "include",
    });
    if (!res.ok) return; // 未ログイン

    const data = await res.json();
    const user = data.user || data;

    // ヘッダー右側を差し替え
    headerActions.innerHTML = "";

    const userBtn = document.createElement("a");
    userBtn.href = "users.html";
    userBtn.className = "btn btn-outline btn-sm";
    userBtn.textContent = user.name + " さん";
    headerActions.appendChild(userBtn);

    const logoutBtn = document.createElement("a");
    logoutBtn.href = "#";
    logoutBtn.className = "btn btn-primary btn-sm";
    logoutBtn.textContent = "ログアウト";
    logoutBtn.onclick = async () => {
      await fetch(CONFIG.API_BASE_URL + "/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      location.href = "../login.html";
    };
    headerActions.appendChild(logoutBtn);

  } catch (e) {
    console.warn("ログイン状態取得失敗", e);
  }
}

/* 初期化 */
document.addEventListener("DOMContentLoaded", updateHeaderUserState);
