import { getAllUsers } from "./api/users.api.js";
import { apiAdminGet } from "./api/apiAdmin.js";

const tbody  = document.getElementById("table-body");
const fGroup = document.getElementById("f-group");
const fFrom  = document.getElementById("f-from");
const fTo    = document.getElementById("f-to");
const fText  = document.getElementById("f-text");
const metaEl = document.getElementById("table-meta");

let allUsers = [];
let groupMap = {};

/* ---------- util ---------- */
function fmtJPY(value) {
  const n = Number(value ?? 0);
  return Math.floor(n).toLocaleString("ja-JP") + " 円";
}

function fmtDate(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("ja-JP");
}

/* ---------- load ---------- */
async function loadGroups() {
  const groups = await apiAdminGet("/admin/groups");
  fGroup.innerHTML = `<option value="">すべて</option>`;

  groups.forEach(g => {
    groupMap[g.id] = g.name;
    fGroup.innerHTML += `<option value="${g.id}">${g.name}</option>`;
  });
}

async function loadUsers() {
  allUsers = await getAllUsers();
  renderTable(allUsers);
}

/* ---------- filter ---------- */
function applyFilters() {
  let list = [...allUsers];

  const group = Number(fGroup.value);
  const from  = fFrom.value ? new Date(fFrom.value) : null;
  const to    = fTo.value ? new Date(fTo.value) : null;
  const text  = fText.value.trim().toLowerCase();

  if (group > 0) list = list.filter(u => Number(u.groupId) === group);
  if (from) list = list.filter(u => new Date(u.createdAt) >= from);
  if (to)   list = list.filter(u => new Date(u.createdAt) <= to);

  if (text) {
    list = list.filter(u =>
      u.name.toLowerCase().includes(text) ||
      u.email.toLowerCase().includes(text)
    );
  }

  renderTable(list);
}

/* ---------- render ---------- */
function renderTable(list) {
  tbody.innerHTML = "";
  metaEl.textContent = `${list.length}件`;

  if (!list.length) {
    tbody.innerHTML =
      `<tr><td colspan="8" class="muted">データがありません。</td></tr>`;
    return;
  }

  list.forEach(u => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.id}</td>
      <td>${u.name}</td>
      <td>KYC${u.kycLevel ?? 0}</td>
      <td>${u.email}</td>
      <td>${groupMap[u.groupId] ?? "-"}</td>
      <td>${fmtDate(u.createdAt)}</td>
      <td>${fmtJPY(u.balanceTotal)}</td>
      <td>
        <a href="user-detail.html?id=${u.id}"
           class="btn-xs btn-xs-primary">
          詳細
        </a>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/* ---------- events ---------- */
document.getElementById("btn-search").onclick = applyFilters;
document.getElementById("btn-clear").onclick = () => {
  fGroup.value = "";
  fFrom.value = "";
  fTo.value = "";
  fText.value = "";
  renderTable(allUsers);
};

/* ---------- init ---------- */
(async () => {
  await loadGroups();
  await loadUsers();
})();
