// /admin/assets/js/api/system-settings.api.js
import { apiAdminGet, apiAdminPost } from "./apiAdmin.js";

/* ===== グループ一覧 ===== */
export const getGroups = () =>
  apiAdminGet("/admin/groups");

/* ===== システム設定 ===== */
export const getSystemConfig = (groupId) =>
  apiAdminGet(`/system/config/${groupId}`);

export const saveSystemConfig = (groupId, payload) =>
  apiAdminPost(`/system/config/${groupId}`, payload);

/* ===== トレードループ ===== */
export const runTradeLoop = () =>
  apiAdminPost("/system/trade-loop");
