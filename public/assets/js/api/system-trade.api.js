// ========================================
// System Trade API
// ========================================

const API_BASE = "https://api.exchange-template.com";

/**
 * システム概要を取得
 * GET /system/overview
 */
export async function fetchSystemOverview() {
  const res = await fetch(API_BASE + "/system/overview", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("システム情報の取得に失敗しました");
  }

  return res.json();
}

/**
 * システム停止依頼
 * POST /system/stop
 */
export async function requestSystemStop() {
  const res = await fetch(API_BASE + "/system/stop", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("停止依頼に失敗しました");
  }
}
