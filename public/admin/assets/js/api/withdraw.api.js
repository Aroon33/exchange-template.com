import { apiAdminGet, apiAdminPost } from "./apiAdmin.js";

export const getAllWithdraws = () =>
  apiAdminGet("/withdraw/all");

export const approveWithdraw = (id) =>
  apiAdminPost("/withdraw/approve", { transferId: id });

export const cancelWithdraw = (id) =>
  apiAdminPost("/withdraw/cancel", { transferId: id });
