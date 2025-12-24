/**
 * CSS Duplicate Checker
 * - 同一セレクタの重複
 * - セレクタ内プロパティの重複
 */

const fs = require("fs");
const path = require("path");

// ===== 対象CSS =====
const CSS_PATH = path.resolve(
  __dirname,
  "../css/style.css"
);

// ===== 出力先 =====
const OUTPUT_JSON = path.resolve(
  __dirname,
  "css-duplicate-report.json"
);

const OUTPUT_TXT = path.resolve(
  __dirname,
  "css-duplicate-report.txt"
);

// ===== CSS読み込み =====
const css = fs.readFileSync(CSS_PATH, "utf8");

// ===== セレクタ抽出 =====
const blocks = css.match(/[^{}]+{[^}]+}/g) || [];

const selectorMap = new Map();

// ===== パース =====
blocks.forEach(block => {
  const [rawSelector, rawBody] = block.split("{");
  const selector = rawSelector.trim();
  const body = rawBody.replace("}", "").trim();

  const props = body
    .split(";")
    .map(l => l.trim())
    .filter(Boolean);

  if (!selectorMap.has(selector)) {
    selectorMap.set(selector, []);
  }

  selectorMap.get(selector).push(props);
});

// ===== 重複チェック =====
const report = [];

for (const [selector, entries] of selectorMap.entries()) {
  if (entries.length <= 1) continue;

  const propCount = {};
  entries.flat().forEach(p => {
    const key = p.split(":")[0].trim();
    propCount[key] = (propCount[key] || 0) + 1;
  });

  const duplicatedProps = Object.entries(propCount)
    .filter(([_, c]) => c > 1)
    .map(([k, c]) => `${k} (${c} times)`);

  report.push({
    selector,
    occurrences: entries.length,
    duplicatedProperties: duplicatedProps
  });
}

// ===== 保存 =====
fs.writeFileSync(
  OUTPUT_JSON,
  JSON.stringify(report, null, 2),
  "utf8"
);

fs.writeFileSync(
  OUTPUT_TXT,
  report.map(r => {
    return [
      `Selector: ${r.selector}`,
      `Occurrences: ${r.occurrences}`,
      r.duplicatedProperties.length
        ? `Duplicated Properties: ${r.duplicatedProperties.join(", ")}`
        : "Duplicated Properties: none",
      "-".repeat(40)
    ].join("\n");
  }).join("\n"),
  "utf8"
);

// ===== 結果 =====
console.log("CSS duplicate check completed.");
console.log(`JSON: ${OUTPUT_JSON}`);
console.log(`TXT : ${OUTPUT_TXT}`);
