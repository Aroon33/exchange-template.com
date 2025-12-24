import { getKycStatus, submitKyc } from "./api/kyc.api.js";

/* =========================
   DOM
========================= */
const pill = document.getElementById("kyc-level-pill");
const statusEl = document.getElementById("kyc-status");
const msgEl = document.getElementById("kyc-msg");
const formEl = document.getElementById("kyc-form");
const submitBtn = document.getElementById("submit-kyc");

/* =========================
   KYC状態表示
========================= */
async function loadKycStatus() {
  const data = await getKycStatus();
  const status = data.status;
  const level = data.level ?? 0;

  pill.textContent = `レベル ${level}`;
  pill.className = `kyc-pill kyc-${level}`;

  switch (status) {
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

/* =========================
   KYC提出
========================= */
submitBtn.onclick = async () => {
  const front = document.getElementById("front-file").files[0];
  const back = document.getElementById("back-file").files[0];

  if (!front || !back) {
    msgEl.textContent = "両方の画像を選択してください。";
    msgEl.style.color = "red";
    return;
  }

  const form = new FormData();
  form.append("files", front);
  form.append("files", back);

  try {
    await submitKyc(form);
    msgEl.textContent = "提出しました。審査中です。";
    msgEl.style.color = "green";
    loadKycStatus();
  } catch {
    msgEl.textContent = "提出に失敗しました。";
    msgEl.style.color = "red";
  }
};

/* =========================
   初期ロード
========================= */
loadKycStatus().catch(() => {
  msgEl.textContent = "KYC情報の取得に失敗しました。";
});
