import { CONFIG } from "../config.js";

const btn = document.getElementById("btn-login");
const error = document.getElementById("error-msg");

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
    const res = await fetch(CONFIG.API_BASE_URL + "/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) throw new Error();

    const user = await res.json();

    // 🔴 ADMIN 以外は拒否
    if (user.role !== "ADMIN") {
      throw new Error("NOT_ADMIN");
    }

    // 管理画面へ
    location.href = "/admin/index.html";

  } catch (e) {
    error.textContent =
      e.message === "NOT_ADMIN"
        ? "管理者権限がありません"
        : "ログインに失敗しました";

    error.style.display = "block";
  }
};
