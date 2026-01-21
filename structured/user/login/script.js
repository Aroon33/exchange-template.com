// ========================================
// Login Page Script
// ========================================

// ---------- Import ----------
import { CONFIG } from "../config.js";

// ---------- DOM Elements ----------
const emailInput    = document.getElementById("login-email");
const passwordInput = document.getElementById("login-password");
const messageEl     = document.getElementById("login-message");
const loginBtn      = document.getElementById("login-button");

// ---------- Event Binding ----------
loginBtn.addEventListener("click", handleLogin);
[emailInput, passwordInput].forEach((el) => {
  el.addEventListener("keydown", handleEnterSubmit);
});

// ========================================
// Event Handlers
// ========================================

/**
 * ログイン処理のメイン入口
 */
async function handleLogin(e) {
  if (e) e.preventDefault();

  clearMessage();

  const credentials = collectLoginForm();
  if (!validateLogin(credentials)) return;

  setLoading(true);

  try {
    const user = await login(credentials.email, credentials.password);
showSuccess("ログイン成功");

// ユーザーは必ずユーザー画面へ
window.location.href = "mypage.html";

  } catch (err) {
    showError(err.message || "ログインに失敗しました");
  } finally {
    setLoading(false);
  }
}

/**
 * Enterキー送信
 */
function handleEnterSubmit(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    handleLogin();
  }
}

// ========================================
// Form Handling
// ========================================

function collectLoginForm() {
  return {
    email: emailInput.value.trim(),
    password: passwordInput.value.trim(),
  };
}

// ========================================
// Validation
// ========================================

function validateLogin({ email, password }) {
  if (!email || !password) {
    showError("メールアドレスとパスワードを入力してください。");
    return false;
  }
  return true;
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
  loginBtn.disabled = isLoading;
  loginBtn.textContent = isLoading ? "ログイン中..." : "ログイン";
}


