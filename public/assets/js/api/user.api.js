import { apiFetch } from "./apiClient.js";

export function getMe() {
  return apiFetch("/auth/me");
}
