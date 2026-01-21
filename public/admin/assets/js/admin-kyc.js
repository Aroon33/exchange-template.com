import { getKycList, updateKycStatus } from "./api/kyc.api.js";

let allKyc = [];

/* ---------- util ---------- */
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2000);
}

function formatDate(v) {
  if (!v) return "-";
  return new Date(v).toLocaleString("ja-JP", { hour12: false });
}

/* ---------- actions ---------- */
async function changeStatus(id) {
  const level = Number(prompt("新しいステータス（0〜5）を入力："));
  if (isNaN(level) || level < 0 || level > 5) {
    showToast("無効なステータスです");
    return;
  }

  try {
    await updateKycStatus(id, level);
    showToast("更新しました");
    loadKyc();
  } catch {
    showToast("更新失敗");
  }
}

/* ---------- render ---------- */
function renderTable(list) {
  const tbody = document.getElementById("kyc-table-body");
  tbody.innerHTML = "";

  if (!list.length) {
    tbody.innerHTML =
      `<tr><td colspan="8" style="text-align:center;color:#777;">なし</td></tr>`;
    return;
  }

  list.forEach(k => {
    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${k.id}</td>
        <td>${formatDate(k.createdAt)}</td>
        <td>${k.name ?? "-"}</td>
        <td>${k.frontUrl ? `<a href="${k.frontUrl}" target="_blank">表示</a>` : "-"}</td>
        <td>${k.backUrl ? `<a href="${k.backUrl}" target="_blank">表示</a>` : "-"}</td>
        <td>${formatDate(k.updatedAt)}</td>
        <td>${k.statusText}</td>
        <td>
          <button class="btn-xs btn-xs-primary"
            data-id="${k.id}">
            更新
          </button>
        </td>
      </tr>
    `);
  });

  tbody.querySelectorAll("button").forEach(b =>
    b.onclick = () => changeStatus(+b.dataset.id)
  );
}

/* ---------- filter ---------- */
function applyFilter() {
  const f = document.getElementById("status-filter").value;
  if (f === "ALL") return renderTable(allKyc);
  renderTable(allKyc.filter(k => String(k.level) === f));
}

/* ---------- load ---------- */
async function loadKyc() {
  try {
    allKyc = await getKycList();
    applyFilter();
  } catch {
    showToast("取得失敗");
  }
}

/* ---------- init ---------- */
document.getElementById("status-filter").onchange = applyFilter;
document.getElementById("reload-btn").onclick = loadKyc;

loadKyc();
