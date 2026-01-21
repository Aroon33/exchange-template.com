import { apiAdminGet, apiAdminPost } from "./apiAdmin.js";

export function getKycList() {
  return apiAdminGet("/kyc/admin/list");
}

export function updateKycStatus(id, level) {
  return apiAdminPost("/kyc/admin/set-status", { id, level });
}
