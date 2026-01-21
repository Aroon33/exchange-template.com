// ========================================
// Signup Page Script（FINAL / User + Profile）
// ========================================

// ---------- Import ----------
import { signup } from "../api/auth.api.js";
import { createUserProfile } from "../api/profile.api.js";

// ---------- DOM ----------
const btnSignup = document.getElementById("signup-button");
const messageEl = document.getElementById("signup-message");

// ---------- Event ----------
btnSignup.addEventListener("click", handleSignup);

// ========================================
// Main Handler
// ========================================
async function handleSignup(e) {
  if (e) e.preventDefault();

  clearMessage();

  const form = collectSignupForm();
  if (!validateSignup(form)) return;

  setLoading(true);

  try {
    // ① User 登録
    await signup(buildUserPayload(form));

    // ② UserProfile 作成（ログインCookieが付く前提）
    await createUserProfile(buildProfilePayload(form));

    showSuccess("登録が完了しました。ログイン画面へ移動します。");
    redirectToLogin();
  } catch (err) {
    showError(err.message || "登録に失敗しました");
  } finally {
    setLoading(false);
  }
}

// ========================================
// Form Handling
// ========================================
function collectSignupForm() {
  const lastname  = document.getElementById("signup-lastname").value.trim();
  const firstname = document.getElementById("signup-firstname").value.trim();

  return {
    // account
    email: document.getElementById("signup-email").value.trim(),
    password: document.getElementById("signup-password").value.trim(),
    name: `${lastname} ${firstname}`.trim(),

    // profile
    dateOfBirth: document.getElementById("profile-dob").value,
    gender: document.getElementById("profile-gender").value,
    postalCode: document.getElementById("profile-postal").value.trim(),
    city: document.getElementById("profile-city").value.trim(),
    address: document.getElementById("profile-address").value.trim(),
    country: document.getElementById("profile-country").value.trim(),
    phone: document.getElementById("profile-phone").value.trim(),
  };
}

// ========================================
// Validation
// ========================================
function validateSignup(form) {
  if (!form.email || !form.password || !form.name) {
    showError("必須項目が入力されていません。");
    return false;
  }

  if (!form.dateOfBirth || !form.gender) {
    showError("プロフィール情報を入力してください。");
    return false;
  }

  return true;
}

// ========================================
// Payload Builders
// ========================================
function buildUserPayload(form) {
  return {
    email: form.email,
    password: form.password,
    name: form.name,
  };
}

function buildProfilePayload(form) {
  return {
    dateOfBirth: form.dateOfBirth,
    gender: form.gender,
    address: form.address,
    city: form.city,
    postalCode: form.postalCode,
    country: form.country,
    phone: form.phone,
  };
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
  btnSignup.textContent = isLoading
    ? "送信中..."
    : "口座開設を申し込む";
}

// ========================================
// Navigation
// ========================================
function redirectToLogin() {
  setTimeout(() => {
    window.location.href = "/login.html";
  }, 1500);
}
