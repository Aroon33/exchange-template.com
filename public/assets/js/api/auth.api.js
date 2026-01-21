// ========================================
// Auth API（最終版）
// ========================================

import { CONFIG } from "../config.js";

const API_BASE_URL = CONFIG.API_BASE_URL;


/**
 * 新規登録
 */
export async function signup(payload) {
  const res = await fetch(API_BASE_URL + "/auth/register", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "登録に失敗しました");
  }

  return json;
}

/**
 * ログイン
 */
export async function login(email, password) {
  const res = await fetch(API_BASE_URL + "/auth/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "ログインに失敗しました");
  }

  return json;
}

/**
 * ログインユーザー取得
 */
export async function getMe() {
  const res = await fetch(API_BASE_URL + "/auth/me", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("UNAUTHORIZED");
  }

  return res.json();
}

/**
 * ログアウト
 */
export async function logout() {
  await fetch(API_BASE_URL + "/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}
