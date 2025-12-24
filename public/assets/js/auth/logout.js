// assets/js/auth/logout.js
import { logout } from "../api/auth.api.js";

(async () => {
  await logout();
  location.href = "/login.html";
})();
