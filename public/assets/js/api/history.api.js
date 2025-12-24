import { apiFetch } from "./apiClient.js";

export function getTradeHistory() {
  return apiFetch("/trades/history");
}
