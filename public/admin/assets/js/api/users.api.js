import { apiAdminGet, apiAdminPost } from "./apiAdmin.js";

/* 管理者：全ユーザー取得 */
export function getAllUsers() {
  return apiAdminGet("/admin/users");
}

/* 元 apiGet */
export const apiGetAdminUserDetail = (userId) =>
  apiAdminGet(`/admin/users/${userId}`);

/* 元 apiPost */
export const apiPostAdminUserGroup = (userId, groupId) =>
  apiAdminPost(`/admin/users/${userId}/group`, { groupId });

/* 元 apiPost */
export const apiPostAdminUserSystemStatus = (userId, status) =>
  apiAdminPost(`/admin/users/${userId}/system-status`, { status });
