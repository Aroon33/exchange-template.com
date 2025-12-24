// ========================================
// Exchange API
// ========================================

const API_BASE = "https://api.exchange-template.com";

/**
 * ログインユーザー取得
 */
export async function fetchMe() {
  const res = await fetch(API_BASE + "/auth/me", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("未ログイン");
  return res.json();
}

/**
 * ログアウト
 */
export async function logout() {
  await fetch(API_BASE + "/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}

/**
 * （将来用）マーケット取得
 */
export async function fetchMarkets() {
  // 今は固定データでもOK
  return [];
}
