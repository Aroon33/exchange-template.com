import { CONFIG } from "../config.js";

    const API_BASE_URL = "https://api.exchange-template.com";
    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");
    const messageEl = document.getElementById("login-message");
    const btn = document.getElementById("login-button");

    async function login() {
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      if (!email || !password) {
        messageEl.textContent = "メールアドレスとパスワードを入力してください。";
        messageEl.style.color = "red";
        return;
      }

      btn.disabled = true;
      btn.textContent = "ログイン中...";

      try {
        const res = await fetch(API_BASE_URL + "/auth/login", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "ログインに失敗しました");

        messageEl.textContent = "ログイン成功: " + data.user.email;
        messageEl.style.color = "green";
        setTimeout(() => window.location.href = "mypage.html", 1200);
      } catch (err) {
        messageEl.textContent = err.message;
        messageEl.style.color = "red";
      } finally {
        btn.disabled = false;
        btn.textContent = "ログイン";
      }
    }

    btn.addEventListener("click", e => { e.preventDefault(); login(); });
    [emailInput, passwordInput].forEach(el => {
      el.addEventListener("keydown", e => {
        if (e.key === "Enter") {
          e.preventDefault();
          login();
        }
      });
    });
