import { CONFIG } from "../config.js";

const btn = document.getElementById("logout-btn");

btn.addEventListener("click", logout);

async function logout() {
  btn.disabled = true;

  try {
    await fetch(CONFIG.API_BASE_URL + "/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // 失敗しても続行
  } finally {
    // 必ずログイン画面へ
    location.href = "/admin/login.html";
  }
}
