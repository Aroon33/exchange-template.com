import { CONFIG } from "/assets/js/config.js";

/* 共通 request */
async function request(path, options = {}) {
  const res = await fetch(CONFIG.API_BASE_URL + path, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (res.status === 401) {
    window.location.href = "/admin/login.html";
    return;
  }

  const text = await res.text();
  if (!res.ok) throw new Error(text || "API Error");
  return text ? JSON.parse(text) : null;
}

export const apiAdminGet = (path) => request(path);
export const apiAdminPost = (path, body, method = "POST") =>
  request(path, {
    method,
    body: body ? JSON.stringify(body) : undefined,
  });

