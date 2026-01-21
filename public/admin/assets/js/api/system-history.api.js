import { apiAdminGet } from "./apiAdmin.js";

/* グループ一覧 */
export const getGroups = () => {
  return apiAdminGet("/admin/groups");
};

/* システム履歴取得 */
export const getSystemHistory = (groupId) => {
  return apiAdminGet(`/admin/system/history/${groupId}`);
};
