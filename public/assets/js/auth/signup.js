// ========================================
// Signup Page Script
// ========================================

// ---------- Import ----------
import { signup } from "../api/auth.api.js";
import { API_BASE_URL } from "../config.js";

// ---------- DOM Elements ----------
const btnSignup = document.getElementById("signup-button");
const messageEl = document.getElementById("signup-message");

// ---------- Event Binding ----------
btnSignup.addEventListener("click", handleSignup);

// ========================================
// Event Handlers
// ========================================

/**
 * サインアップボタン押下時のメイン処理
 */
async function handleSignup() {
  clearMessage();

  const payload = collectSignupForm();

  if (!validateSignup(payload)) return;

  setLoading(true);

  try {
    await registerUser(payload);
    showSuccess("登録成功！ログイン画面へ移動します。");
    redirectToLogin();
  } catch (err) {
    showError(err.message);
  } finally {
    setLoading(false);
  }
}

// ========================================
// Form Handling
// ========================================

/**
 * フォームの入力値をまとめて取得
 */
function collectSignupForm() {
  const lastname  = document.getElementById("signup-lastname").value.trim();
  const firstname = document.getElementById("signup-firstname").value.trim();

  return {
    email: document.getElementById("signup-email").value.trim(),
    password: document.getElementById("signup-password").value.trim(),
    name: `${lastname} ${firstname}`.trim(),
    country: document.getElementById("signup-country").value,
    refcode: document.getElementById("signup-refcode").value.trim(),
    tosOK: document.getElementById("signup-tos").checked,
    referral: getReferralFromURL(),
  };
}

// ========================================
// Validation
// ========================================

/**
 * 入力チェック
 */
function validateSignup({ email, password, tosOK }) {
  if (!email || !password) {
    showError("メールアドレスとパスワードは必須です。");
    return false;
  }

  if (!tosOK) {
    showError("利用規約に同意してください。");
    return false;
  }

  return true;
}

// ========================================
// API Communication
// ========================================

/**
 * サインアップAPI呼び出し
 */
async function registerUser(data) {
  const payload = {
    email: data.email,
    password: data.password,
    name: data.name,
    country: data.country,
    referral: data.referral,
    code: data.refcode || null,
  };

  const res = await fetch(API_BASE_URL + "/auth/register", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "登録に失敗しました");
}

// ========================================
// UI Helpers
// ========================================

function showError(text) {
  messageEl.textContent = text;
  messageEl.style.color = "red";
}

function showSuccess(text) {
  messageEl.textContent = text;
  messageEl.style.color = "green";
}

function clearMessage() {
  messageEl.textContent = "";
}

function setLoading(isLoading) {
  btnSignup.disabled = isLoading;
  btnSignup.textContent = isLoading ? "送信中..." : "口座開設を申し込む";
}

// ========================================
// Utilities
// ========================================

function getReferralFromURL() {
  const url = new URL(window.location.href);
  const ref = url.searchParams.get("ref");
  return ref ? Number(ref) : null;
}

function redirectToLogin() {
  setTimeout(() => {
    window.location.href = "login.html";
  }, 1500);
}
