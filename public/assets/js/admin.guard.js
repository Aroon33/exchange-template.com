import { getMe } from "./api/auth.api.js";

export async function requireAdmin() {
  try {
    const me = await getMe();

    if (!me.user || me.user.role !== "ADMIN") {
      location.href = "/admin/login.html";
      return false;
    }

    return true;
  } catch {
    location.href = "/admin/login.html";
    return false;
  }
}
