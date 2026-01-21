import { apiAdminGet } from "./apiAdmin.js";

/* 管理者：全ユーザー取得 */
export function getAllUsers() {
  return apiAdminGet("/admin/users");
}
