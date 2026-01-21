import {
  apiGetAdminUserDetail,
  apiPostAdminUserGroup,
  apiPostAdminUserSystemStatus
} from "./api/users.api.js";

const msg = l => {
  const el = document.getElementById("msg");
  el.textContent = l;
  el.style.color = "green";
};
const err = l => {
  const el = document.getElementById("msg");
  el.textContent = l;
  el.style.color = "red";
};

function fmtNum(value, digits = 8) {
  const n = Number(value ?? 0);
  return n.toLocaleString("ja-JP", {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits
  });
}

/* ▼ 種別（入金 / 出金） */
function fmtTransferType(type) {
  switch (type) {
    case "DEPOSIT": return "入金";
    case "WITHDRAW": return "出金";
    default: return type;
  }
}

/* ▼ ステータス */
function fmtTransferStatus(status) {
  switch (status) {
    case "PENDING": return "申請中";
    case "CONFIRMING": return "確認中";
    case "COMPLETED": return "完了";
    case "CANCELED": return "キャンセル";
    default: return status;
  }
}

/* ▼ 金額フォーマット（JPY） */
function fmtJPY(value) {
  const n = Number(value ?? 0);
  return Math.floor(n).toLocaleString("ja-JP") + " 円";
}

function fmtDate(i) {
  return new Date(i).toLocaleString("ja-JP", { hour12:false });
}

/* ▼ ID パラメータ取得 */
const params = new URLSearchParams(window.location.search);
const userId = Number(params.get("id"));

if (!userId) {
  err("ユーザーIDが指定されていません");
}

/* ▼ ユーザー詳細読み込み */
async function loadDetail() {
  try {
    const u = await apiGetAdminUserDetail(userId);

    document.getElementById("u-id").textContent = u.id;
    document.getElementById("u-name").textContent = u.name;
    document.getElementById("u-email").textContent = u.email;
    document.getElementById("u-created").textContent = fmtDate(u.createdAt);
    document.getElementById("u-kyc").textContent = u.kycRequests[0]?.status ?? 0;

    document.getElementById("u-group").value = u.groupId ?? "";
    document.getElementById("u-status").value = u.systemStatus;

    document.getElementById("p-birth").textContent = u.UserProfile?.dateOfBirth ?? "-";
    document.getElementById("p-address").textContent = u.UserProfile?.address ?? "-";
    document.getElementById("p-phone").textContent = u.UserProfile?.phone ?? "-";

    document.getElementById("w-total").textContent = fmtJPY(u.wallet?.balanceTotal);
    document.getElementById("w-avail").textContent = fmtJPY(u.wallet?.balanceAvailable);
    document.getElementById("w-lock").textContent  = fmtJPY(u.wallet?.balanceLocked);

    /* 入出金履歴 */
    const tBody = document.getElementById("transfer-body");
    tBody.innerHTML = "";
    u.transfers.forEach(t => {
      tBody.innerHTML += `
        <tr>
          <td>${t.id}</td>
          <td>${fmtTransferType(t.type)}</td>
          <td>${fmtJPY(t.amount)}</td>
          <td>${fmtTransferStatus(t.status)}</td>
          <td>${fmtDate(t.createdAt)}</td>
        </tr>`;
    });

    /* 取引履歴 */
    const tradeBody = document.getElementById("trade-body");
    tradeBody.innerHTML = "";
    u.trades?.forEach(tr => {
      tradeBody.innerHTML += `
        <tr>
          <td>${tr.id}</td>
          <td>${tr.symbol}</td>
          <td>${tr.side}</td>
          <td>${fmtNum(tr.size)}</td>
          <td>${fmtJPY(tr.profit)}</td>
          <td>${fmtDate(tr.openedAt)}</td>
        </tr>`;
    });

    msg("ユーザー情報を読み込みました。");

  } catch (e) {
    console.error(e);
    err("ユーザー情報の取得に失敗しました");
  }
}

/* ▼ グループ変更 */
document.getElementById("btn-update-group").onclick = async () => {
  try {
    const groupId = Number(document.getElementById("u-group").value);
    await apiPostAdminUserGroup(userId, groupId);
    msg("グループを更新しました");
  } catch {
    err("グループ更新に失敗");
  }
};

/* ▼ systemStatus 更新 */
document.getElementById("btn-update-status").onclick = async () => {
  try {
    const status = document.getElementById("u-status").value;
    await apiPostAdminUserSystemStatus(userId, status);
    msg("ステータスを更新しました");
  } catch {
    err("ステータス更新に失敗");
  }
};

/* ▼ 初期読み込み */
loadDetail();
