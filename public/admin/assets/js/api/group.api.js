// /admin/assets/js/api/group.api.js
import { apiAdminGet, apiAdminPost } from "./apiAdmin.js";

/* =====================
   Groups
===================== */

/** 一覧取得 */
export const getGroups = () =>
  apiAdminGet("/admin/groups");

/** 新規作成 */
export const createGroup = (name) =>
  apiAdminPost("/admin/groups/create", { name });

/** 編集（name / code） */
export const updateGroup = (groupId, payload) =>
  apiAdminPost(`/admin/groups/${groupId}`, payload, "PATCH");

/** 削除 */
export const deleteGroup = (groupId) =>
  apiAdminPost(`/admin/groups/${groupId}`, null, "DELETE");

/* =====================
   Users
===================== */

export const getUsers = () =>
  apiAdminGet("/admin/users");

export const moveUserGroup = (userId, groupId) =>
  apiAdminPost(`/admin/users/${userId}/group`, { groupId });

/* =====================
   Stats
===================== */

export const getSystemPositionsByGroup = (groupId) =>
  apiAdminGet(`/admin/system/positions/${groupId}`);
