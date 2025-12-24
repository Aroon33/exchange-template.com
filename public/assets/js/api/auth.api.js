// assets/js/api/auth.api.js
import { apiFetch } from "./apiClient.js";

/* ログイン */
export function login(email, password) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/* 新規登録 */
export function signup(payload) {
  return apiFetch("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/* ログアウト */
export function logout() {
  return apiFetch("/auth/logout", { method: "POST" });
}

/* 自分情報（ヘッダー用） */
export function getMe() {
  return apiFetch("/auth/me");
}
