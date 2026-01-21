import { CONFIG } from "/assets/js/config.js";


export async function signupApi(payload) {
  const res = await fetch(CONFIG.API_BASE_URL + "/auth/register", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "登録に失敗しました");
  }

  return json;
}
