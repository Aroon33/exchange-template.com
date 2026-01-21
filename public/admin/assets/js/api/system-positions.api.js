import { apiAdminGet, apiAdminPost } from "./apiAdmin.js";

/* ===== 取得 ===== */
export const getGroups = () =>
  apiAdminGet("/admin/groups");

export const getSystemPositions = (groupId) =>
  apiAdminGet(`/admin/system/positions/${groupId}`);

/* ===== 決済（★ここが間違っていた） ===== */
export const closeGroupAll = (groupId) =>
  apiAdminPost(`/system/close-group/${groupId}`);

export const closeGroupSymbol = (groupId, symbol) =>
  apiAdminPost(`/system/close-group/${groupId}/${symbol}`);

export const closeUserAll = (userId) =>
  apiAdminPost(`/system/close-user/${userId}`);

export const closeUserSymbol = (userId, symbol) =>
  apiAdminPost(`/system/close-user/${userId}/${symbol}`);
