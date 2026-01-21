import { updateHeaderUserState } from "./header-user.js";
import { initHeaderUI } from "./header-ui.js";

async function loadHeader() {
  const container = document.getElementById("header");
  if (!container) return;

  try {
    const res = await fetch("/common/header.html", { cache: "no-store" });
    container.innerHTML = await res.text();

    await updateHeaderUserState(container);
    initHeaderUI();
  } catch (e) {
    console.error("header load failed", e);
  }
}

document.addEventListener("DOMContentLoaded", loadHeader);
