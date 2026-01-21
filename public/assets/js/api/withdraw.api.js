import { apiFetch } from "./apiClient.js";

export function requestWithdraw(payload) {
  return apiFetch("/withdraw/request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

