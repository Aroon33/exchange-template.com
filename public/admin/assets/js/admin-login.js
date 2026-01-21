import { CONFIG } from "/assets/js/config.js";

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("login-btn");
  const error = document.getElementById("login-error");

  if (!btn) {
    console.error("login-btn not found");
    return;
  }

  btn.onclick = async () => {
    error.style.display = "none";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      error.textContent = "メールとパスワードを入力してください";
      error.style.display = "block";
      return;
    }

    try {
      const res = await fetch(
  CONFIG.API_BASE_URL + "/auth/login",
  {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }
);



      if (!res.ok) throw new Error("LOGIN_FAILED");

      // ★ ここでは role 判定しない
      location.href = "/admin/index.html";

    } catch (e) {
      error.textContent = "ログインに失敗しました";
      error.style.display = "block";
    }
  };
});
