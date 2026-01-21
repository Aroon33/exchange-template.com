// /admin/assets/js/admin-group.js
import {
  getGroups,
  getUsers,
  moveUserGroup,
  getSystemPositionsByGroup,
  updateGroup,
  createGroup   // ★ 追加
} from "./api/group.api.js";

/* ===== DOM ===== */
const groupBody = document.getElementById("group-body");
const groupCount = document.getElementById("group-count");
const userBody = document.getElementById("user-body");
const filterGroup = document.getElementById("filter-group");
const moveGroupSelect = document.getElementById("move-group-select");
const bulkBtn = document.getElementById("btn-bulk-move");
const checkAll = document.getElementById("check-all");

const selectedUsers = new Set();
let groups = [];
let users = [];

/* =============================
   グループ一覧
============================= */
async function loadGroups() {
  groups = await getGroups();

  groupBody.innerHTML = "";
  groupCount.textContent = groups.length + "件";

  filterGroup.innerHTML = `<option value="">すべて</option>`;
  moveGroupSelect.innerHTML = `<option value="">移行先グループ</option>`;

  groups.forEach(g => {
    groupBody.innerHTML += `
<tr>
  <td>${g.id}</td>
  <td>${g.name}</td>

  <td>
    <button class="btn-xs" onclick="toggleInvite(${g.id})">表示</button>
    <div id="invite-${g.id}" style="display:none;">
      <input readonly value="${g.inviteLink}">
    </div>
  </td>

  <td>
  <button class="btn-xs" onclick="onEditGroup(${g.id})">編集</button>


    <button class="btn-xs btn-xs-primary"
            onclick="selectGroup(${g.id})">
      選択
    </button>
  </td>
</tr>`;
    filterGroup.innerHTML += `<option value="${g.id}">${g.name}</option>`;
    moveGroupSelect.innerHTML += `<option value="${g.id}">${g.name}</option>`;
  });
}

/* =============================
   グループ新規作成 ★追加
============================= */
async function onCreateGroup() {
  const name = prompt("新しいグループ名を入力してください");
  if (!name) return;

  try {
    await createGroup(name);
    window.showToast?.("グループを作成しました");
    loadGroups();
  } catch (e) {
    console.error(e);
    alert("グループ作成に失敗しました");
  }
}

async function onEditGroup(id) {
  const group = groups.find(g => g.id === id);
  if (!group) return;

  const name = prompt(
    "新しいグループ名を入力してください",
    group.name
  );
  if (!name || name === group.name) return;

  try {
    await updateGroup(id, { name });
    loadGroups();
  } catch (e) {
    console.error(e);
    alert("グループ名の更新に失敗しました");
  }
}



/* =============================
   招待リンク表示
============================= */
function toggleInvite(id) {
  const el = document.getElementById("invite-" + id);
  el.style.display = el.style.display === "none" ? "block" : "none";
}

/* =============================
   ユーザー一覧
============================= */
async function loadUsers(groupId) {
  users = await getUsers();
  const list = groupId
    ? users.filter(u => Number(u.groupId) === Number(groupId))
    : users;
  renderUsers(list);
}

function renderUsers(list) {
  userBody.innerHTML = "";
  selectedUsers.clear();
  bulkBtn.disabled = true;
  checkAll.checked = false;

  if (!list.length) {
    userBody.innerHTML =
      `<tr><td colspan="9" style="text-align:center;">ユーザーなし</td></tr>`;
    return;
  }

  list.forEach(u => {
    userBody.innerHTML += `
<tr>
  <td>
    <input type="checkbox"
           onchange="toggleUser(${u.id}, this.checked)">
  </td>
  <td>${u.id}</td>
  <td>${u.name}</td>
  <td>KYC${u.kycLevel ?? 0}</td>
  <td>${u.positionsCount ?? 0}</td>
  <td class="${(u.totalProfit ?? 0) >= 0 ? "profit-plus" : "profit-minus"}">
    ${(u.totalProfit ?? 0).toLocaleString()}
  </td>
  <td>${Math.floor(Number(u.balanceTotal ?? 0)).toLocaleString("ja-JP")} 円</td>
  <td>${u.email ?? "-"}</td>
  <td>
    <button class="btn-xs btn-xs-primary"
      onclick="location.href='/admin/users/${u.id}.html'">
      詳細
    </button>
  </td>
</tr>`;
  });
}

function toggleUser(id, checked) {
  checked ? selectedUsers.add(id) : selectedUsers.delete(id);
  bulkBtn.disabled = selectedUsers.size === 0;
}

checkAll.addEventListener("change", e => {
  document.querySelectorAll("#user-body input[type=checkbox]")
    .forEach(cb => {
      cb.checked = e.target.checked;
      toggleUser(
        Number(cb.closest("tr").children[1].textContent),
        cb.checked
      );
    });
});

/* =============================
   一括移動
============================= */
bulkBtn.onclick = async () => {
  const target = moveGroupSelect.value;
  if (!target || !selectedUsers.size) {
    alert("移行先グループとユーザーを選択してください");
    return;
  }

  if (!confirm("選択したユーザーをグループへ移動しますか？")) return;

  try {
    for (const userId of selectedUsers) {
      await moveUserGroup(userId, Number(target));
    }
    selectedUsers.clear();
    bulkBtn.disabled = true;
    loadUsers(filterGroup.value);
    loadGroups();
    alert("グループ移動が完了しました");
  } catch (e) {
    console.error(e);
    alert("グループ移動中にエラーが発生しました");
  }
};

/* =============================
   統計
============================= */
async function loadStats(groupId) {
  if (!groupId) return;

  const list = users.filter(u => Number(u.groupId) === Number(groupId));
  document.getElementById("stat-user-count").textContent = list.length;

  const balance = list.reduce(
    (s, u) => s + Math.floor(Number(u.balanceTotal ?? 0)),
    0
  );
  document.getElementById("stat-total-balance").textContent =
    balance.toLocaleString("ja-JP") + " 円";

  const pos = await getSystemPositionsByGroup(groupId);
  document.getElementById("stat-positions-count").textContent =
    (pos.parent?.length ?? 0) + (pos.children?.length ?? 0);
}

/* =============================
   グループ選択
============================= */
function selectGroup(id) {
  filterGroup.value = id;
  loadUsers(id);
  loadStats(id);
}

filterGroup.addEventListener("change", e => {
  loadUsers(e.target.value);
  loadStats(e.target.value);
});

/* =============================
   HTML から呼ばれる関数（重要）
============================= */
window.onCreateGroup = onCreateGroup;
window.toggleInvite = toggleInvite;
window.toggleUser = toggleUser;
window.selectGroup = selectGroup;
window.onEditGroup = onEditGroup;


/* =============================
   初期化
============================= */
loadGroups();
loadUsers();
