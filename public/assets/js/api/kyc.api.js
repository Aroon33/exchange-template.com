import { apiFetch } from "./apiClient.js";

export function getKycStatus() {
  return apiFetch("/kyc/status");
}

export function submitKyc(formData) {
  return apiFetch("/kyc/submit", {
    method: "POST",
    body: formData,
  });
}
