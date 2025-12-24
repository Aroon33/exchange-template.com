import { apiFetch } from "./apiClient.js";

export function getWallet() {
  return apiFetch("/wallet");
}
