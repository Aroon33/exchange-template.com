/* =========================
   Number Format Utilities
========================= */

/** JPY：小数なし */
function fmtJPY(value) {
  if (value === null || value === undefined || isNaN(value)) return "0 JPY";
  return Math.floor(Number(value)).toLocaleString("ja-JP") + " JPY";
}

/** 通貨・数量：小数2〜4桁（末尾0なし） */
function fmtAmount(value, { min = 2, max = 4 } = {}) {
  if (value === null || value === undefined || isNaN(value)) return "-";
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  });
}
