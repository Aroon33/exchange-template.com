import { CONFIG } from "../config.js";


/* -----------------------------
   入金先情報取得
----------------------------- */
fetch(CONFIG.API_BASE_URL + "/deposit/config", { credentials: "include" })
  .then(res => res.json())
  .then(data => {

    document.getElementById("btc-address").textContent = data.crypto.BTC;
    document.getElementById("eth-address").textContent = data.crypto.ETH;

    document.getElementById("deposit-note").textContent= data.note;
  })
  .catch(() => {
    alert("入金先情報の取得に失敗しました");
  });

/* -----------------------------
   コピー
----------------------------- */
function copyText(id){
  const text = document.getElementById(id).textContent;
  navigator.clipboard.writeText(text);
  alert("コピーしました");
}
