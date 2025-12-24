const API_BASE_URL = "https://api.exchange-template.com";

export async function apiFetch(path, options = {}) {
  const res = await fetch(API_BASE_URL + path, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (res.status === 401) {
    location.href = "/login.html";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}
