import { apiFetch } from "./apiClient.js";

export function requestWithdraw(payload) {
  return apiFetch("/withdraw/request", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
