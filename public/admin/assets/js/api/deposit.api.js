import { apiAdminGet, apiAdminPost } from "./apiAdmin.js";

export function getAllDeposits() {
  return apiAdminGet("/deposit/all");
}

export function approveDeposit(id) {
  return apiAdminPost("/deposit/approve", { id });
}

export function assignCryptoAddress(id) {
  return apiAdminPost("/deposit/assign-crypto", { id });
}
