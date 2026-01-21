// /admin/assets/js/admin-settings.js
import {
  getGroups,
  getSystemConfig,
  saveSystemConfig,
  runTradeLoop
} from "./api/settings.api.js";

let CURRENT_GROUP = null;
let CURRENT_DATA = null;

const tbody = document.getElementById("sys-body");
const msgbox = document.getElementById("sys-msg");
const groupSelect = document.getElementById("group-select");

/* =============================
   グループ一覧読み込み
============================= */
async function loadGroups() {
  const groups = await getGroups();
  groupSelect.innerHTML = "";

  groups.forEach(g => {
    groupSelect.innerHTML +=
      `<option value="${g.id}">${g.name}（${g.code}）</option>`;
  });

  CURRENT_GROUP = groups[0]?.id || null;
  if (CURRENT_GROUP) loadSettings();
}

groupSelect.onchange = (e) => {
  CURRENT_GROUP = Number(e.target.value);
  loadSettings();
};

/* =============================
   設定をロード
============================= */
async function loadSettings() {
  const data = await getSystemConfig(CURRENT_GROUP);
  CURRENT_DATA = data;
  renderTable();
}

/* =============================
   UI描画
============================= */
function renderTable() {
  tbody.innerHTML = "";

  Object.keys(CURRENT_DATA).forEach(symbol => {
    const s = CURRENT_DATA[symbol];

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${symbol}</td>

      <td>
        <select data-field="direction" data-s="${symbol}">
          <option value="BUY" ${s.direction==="BUY"?"selected":""}>BUY</option>
          <option value="SELL" ${s.direction==="SELL"?"selected":""}>SELL</option>
        </select>
      </td>

      <td>
        <input data-field="size" data-s="${symbol}"
               type="number" step="0.0001" value="${s.size}">
      </td>

      <td>
        <input data-field="holdMinutes" data-s="${symbol}"
               type="number" value="${s.holdMinutes}">
      </td>

      <td>
        <input data-field="pips" data-s="${symbol}"
               type="number" step="0.1" value="${s.pips}">
      </td>

      <td>
        <select data-field="status" data-s="${symbol}">
          <option value="ACTIVE" ${s.status==="ACTIVE"?"selected":""}>ACTIVE</option>
          <option value="PENDING" ${s.status==="PENDING"?"selected":""}>PENDING</option>
          <option value="STOP" ${s.status==="STOP"?"selected":""}>STOP</option>
        </select>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/* =============================
   保存
============================= */
document.getElementById("btn-save").onclick = async () => {
  document.querySelectorAll("[data-field]").forEach(el => {
    const sym = el.dataset.s;
    const field = el.dataset.field;
    let v = el.value;
    if (field !== "direction" && field !== "status") v = Number(v);
    CURRENT_DATA[sym][field] = v;
  });

  await saveSystemConfig(CURRENT_GROUP, CURRENT_DATA);

  msgbox.textContent = "保存しました";
  msgbox.style.color = "green";
  setTimeout(() => msgbox.textContent = "", 1500);
};

/* =============================
   トレードループ実行
============================= */
document.getElementById("runLoopBtn").onclick = () => {
  if (confirm("トレードループを実行しますか？")) {
    execTradeLoop();
  }
};

async function execTradeLoop() {
  try {
    await runTradeLoop();
    window.showToast?.("トレードループを実行しました");
  } catch (err) {
    window.showToast?.("失敗しました: " + err.message);
  }
}

/* =============================
   初期ロード
============================= */
loadGroups();
