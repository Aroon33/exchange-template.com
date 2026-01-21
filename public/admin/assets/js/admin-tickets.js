import {
  apiGetTicketsAdminAll,
  apiGetTicketMessages,
  apiPostTicketStatus,
  apiPostTicketReply
} from "./api/tickets.api.js";

let allTickets = [];
let currentTicketId = null;
let statusFilter = "OPEN";

document.getElementById("filter-status").value = statusFilter;
document.getElementById("filter-status").addEventListener("change", (e) => {
  statusFilter = e.target.value;
  applyFilters();
});

/* ===== Utils ===== */
function fmtDate(v) {
  if (!v) return "-";
  const d = new Date(String(v).replace(" ", "T"));
  return isNaN(d.getTime()) ? "-" : d.toLocaleString("ja-JP", { hour12:false });
}

/* ===== Tickets ===== */
async function loadTickets() {
  allTickets = await apiGetTicketsAdminAll();
  applyFilters();
}

function renderTickets(list) {
  const tbody = document.getElementById("ticket-table-body");
  tbody.innerHTML = "";

  list.forEach(t => {
    tbody.innerHTML += `
      <tr>
        <td>${t.id}</td>
        <td>${t.name ?? "-"}</td>
        <td>${fmtDate(t.updatedAt || t.createdAt)}</td>
        <td>${t.title}</td>
        <td>${t.status}</td>
        <td>
          <button class="btn btn-xs btn-outline"
            onclick="openChat(${t.id})">表示</button>
        </td>
      </tr>
    `;
  });
}

function applyFilters() {
  let filtered = [...allTickets];

  if (statusFilter !== "ALL") {
    filtered = filtered.filter(t => t.status === statusFilter);
  }

  renderTickets(filtered);
}

/* ===== Chat ===== */
async function openChat(ticketId) {
  currentTicketId = ticketId;
  document.getElementById("chat-panel").style.display = "block";

  const msgs = await apiGetTicketMessages(ticketId);
  const ticket = allTickets.find(t => t.id === ticketId);

  document.getElementById("chat-title").textContent =
    `#${ticketId} ${ticket.title}`;

  const btn = document.getElementById("btn-toggle-status");
  btn.textContent = ticket.status === "OPEN" ? "クローズ" : "再オープン";
  btn.onclick = () => toggleStatus(ticket);

  const win = document.getElementById("chat-window");
  win.innerHTML = "";

  msgs.forEach(m => {
    win.innerHTML += `
      <div class="chat-message ${m.sender === "ADMIN" ? "chat-admin" : "chat-user"}">
        <div class="chat-meta">${m.sender} / ${fmtDate(m.createdAt)}</div>
        <div>${m.message}</div>
      </div>
    `;
  });

  win.scrollTop = win.scrollHeight;

  document.getElementById("chat-input-area").style.display =
    ticket.status === "CLOSED" ? "none" : "flex";
}

/* ===== Close / Open ===== */
async function toggleStatus(ticket) {
  const next = ticket.status === "OPEN" ? "CLOSED" : "OPEN";
  if (!confirm(`チケットを${next === "CLOSED" ? "クローズ" : "再オープン"}しますか？`)) return;

  await apiPostTicketStatus(ticket.id, next);

  ticket.status = next;
  loadTickets();
  openChat(ticket.id);
}

/* ===== Send ===== */
document.getElementById("btn-send").onclick = async () => {
  const input = document.getElementById("chat-input");
  const msg = input.value.trim();
  if (!msg || !currentTicketId) return;

  await apiPostTicketReply(currentTicketId, msg);
  input.value = "";
  openChat(currentTicketId);
};

window.openChat = openChat;


/* Init */
loadTickets();
