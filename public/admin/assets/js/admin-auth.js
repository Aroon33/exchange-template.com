// admin-auth.js
(async function () {
  try {
    const res = await fetch(
      "https://api.exchange-template.com/auth/me",
      { credentials: "include" }
    );

    if (!res.ok) throw new Error();

  } catch {
    location.href = "/admin/login.html";
  }
})();
