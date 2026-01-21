import { apiAdminGet } from "./apiAdmin.js";

export const getTrades = (params = {}) => {
  const q = [];

  if (params.status)    q.push(`status=${params.status}`);
  if (params.userName)  q.push(`userName=${encodeURIComponent(params.userName)}`);
  if (params.groupName) q.push(`groupName=${encodeURIComponent(params.groupName)}`);
  if (params.symbol)    q.push(`symbol=${params.symbol}`);

  return apiAdminGet(
    "/admin/trades" + (q.length ? "?" + q.join("&") : "")
  );
};
