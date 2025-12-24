import { apiFetch } from "./apiClient.js";

export function requestDeposit(payload) {
  return apiFetch("/deposit/request", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
