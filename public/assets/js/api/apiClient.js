// ========================================
// 共通 API Client（最終版）
// ========================================

import { CONFIG } from "../config.js";

const API_BASE_URL = CONFIG.API_BASE_URL;

export async function apiFetch(path, options = {}) {
  const res = await fetch(API_BASE_URL + path, {
    credentials: "include",

    // options を先に展開
    ...options,

    // headers は必ず 1 回だけ合成
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  // 認証切れ
  if (res.status === 401) {
    location.href = "/login.html";
    throw new Error("UNAUTHORIZED");
  }

  // その他エラー
  if (!res.ok) {
    let message = "API Error";
    try {
      const json = await res.json();
      message = json.message || message;
    } catch {
      message = await res.text();
    }
    throw new Error(message);
  }

  return res.json();
}
