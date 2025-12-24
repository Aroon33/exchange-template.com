import { apiFetch } from "./apiClient.js";

export function getBankAccount() {
  return apiFetch("/user/bank-account");
}

export function saveBankAccount(data) {
  return apiFetch("/user/bank-account", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getCryptoAddresses() {
  return apiFetch("/user/crypto");
}

export function saveCryptoAddresses(payload) {
  return apiFetch("/user/crypto", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
