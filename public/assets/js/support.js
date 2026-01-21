import { apiFetch } from "./api/apiClient.js";

/* =========================
   DOM
========================= */
const newTitleEl = document.getElementById("new-title");
const newBodyEl = document.getElementById("new-body");
const threadListEl = document.getElementById("thread-list");
const threadCountEl = document.getElementById("thread-count");

const chatWindow = document.getElementById("chat-window");
const chatTitle = document.getElementById("chat-title");
const chatInput = document.getElementById("chat-input");
const chatInputArea = document.getElementById("chat-input-area");

const btnCreateThread = document.getElementById("btn-create-thread");
const btnSendMsg = document.getElementById("btn-send-msg");

/* =========================
   State
========================= */
let currentTicketId = null;

/* =========================
   Tickets
========================= */
async function loadTickets() {
  const tickets = await apiFetch("/tickets");

  // CLOSED は非表示
  const visible = tickets.filter(t => t.status !== "CLOSED");

  threadListEl.innerHTML = "";
  threadCountEl.textContent = `${visible.length}件`;

  if (!visible.length) {
    threadListEl.innerHTML =
      `<div style="padding:12px;color:#888;">問い合わせはありません</div>`;
    return;
  }

  visible.forEach(t => {
    const row = document.createElement("div");
    row.className = "thread-row" + (t.unread ? " unread" : "");

    row.innerHTML = `
      <div class="thread-title">
        ${t.title}
        ${t.unread ? `<span class="unread-badge">NEW</span>` : ""}
      </div>
      <div class="thread-meta">
        ID:${t.id} ／ ${new Date(t.updatedAt).toLocaleString("ja-JP")}
      </div>
    `;

    row.onclick = async () => {
      currentTicketId = t.id;
      await loadMessages();

      // UI上でも即既読
      row.classList.remove("unread");
      row.querySelector(".unread-badge")?.remove();
    };

    threadListEl.appendChild(row);
  });
}


/* =========================
   Messages
========================= */
async function loadMessages() {
  if (!currentTicketId) return;

  const msgs = await apiFetch(`/tickets/${currentTicketId}/messages`);

  chatWindow.innerHTML = "";

  msgs.forEach(m => {
    const div = document.createElement("div");
    div.className = "chat-msg " + (m.sender === "ADMIN" ? "admin" : "user");

    div.innerHTML = `
      <div class="chat-meta">
        ${m.sender} ／ ${new Date(m.createdAt).toLocaleString("ja-JP")}
      </div>
      <div>${m.message}</div>
    `;

    chatWindow.appendChild(div);
  });

  chatTitle.textContent = `スレッド #${currentTicketId}`;
  chatInputArea.style.display = "flex";
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/* =========================
   Create Thread
========================= */
btnCreateThread.onclick = async () => {
  if (!newTitleEl.value || !newBodyEl.value) return;

  await apiFetch("/tickets", {
    method: "POST",
    body: JSON.stringify({
      title: newTitleEl.value,
      message: newBodyEl.value,
    }),
  });

  newTitleEl.value = "";
  newBodyEl.value = "";

  loadTickets();
};

/* =========================
   Send Message
========================= */
btnSendMsg.onclick = async () => {
  if (!currentTicketId) return;
  if (!chatInput.value) return;

  await apiFetch(`/tickets/${currentTicketId}/reply`, {
    method: "POST",
    body: JSON.stringify({
      message: chatInput.value,
    }),
  });

  chatInput.value = "";
  loadMessages();
};

/* =========================
   Init
========================= */
(async function init() {
  try {
    await loadTickets();
  } catch (e) {
    console.error("チケット取得失敗", e);
  }
})();
