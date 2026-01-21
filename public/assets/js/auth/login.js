import { login } from "../api/auth.api.js";

document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");
  const btn = document.getElementById("login-button");
  const message = document.getElementById("login-message");

  btn.addEventListener("click", handleLogin);
  [emailInput, passwordInput].forEach(el => {
    el.addEventListener("keydown", e => {
      if (e.key === "Enter") handleLogin(e);
    });
  });

  async function handleLogin(e) {
    if (e) e.preventDefault();
    message.textContent = "";

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      message.textContent = "メールアドレスとパスワードを入力してください";
      message.style.color = "red";
      return;
    }

    btn.disabled = true;
    btn.textContent = "ログイン中...";

    try {
      const data = await login(email, password);

      // UI用（任意）
      localStorage.setItem("tmp_user", JSON.stringify(data.user));

      // 🔑 roleで分岐
      if (data.user.role === "ADMIN") {
        location.href = "/admin/index.html";
      } else {
        location.href = "/kyc.html";
      }

    } catch (err) {
      message.textContent = err.message;
      message.style.color = "red";
    } finally {
      btn.disabled = false;
      btn.textContent = "ログイン";
    }
  }
});
