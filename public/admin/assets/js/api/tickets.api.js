import { apiAdminGet, apiAdminPost } from "./apiAdmin.js";

/* 元 apiGet */
export const apiGetTicketsAdminAll = () =>
  apiAdminGet("/tickets/admin/all");

/* 元 apiGet */
export const apiGetTicketMessages = (ticketId) =>
  apiAdminGet(`/tickets/${ticketId}/messages`);

/* 元 apiPost */
export const apiPostTicketStatus = (ticketId, status) =>
  apiAdminPost(`/tickets/admin/${ticketId}/status`, { status });

/* 元 apiPost */
export const apiPostTicketReply = (ticketId, message) =>
  apiAdminPost(`/tickets/admin/${ticketId}/reply`, { message });
