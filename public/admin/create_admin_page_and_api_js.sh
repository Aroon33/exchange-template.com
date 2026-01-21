#!/bin/bash

ADMIN_DIR="/var/www/exchange-template.com/public/admin"
JS_DIR="$ADMIN_DIR/assets/js"
API_DIR="$JS_DIR/api"

echo "▶ admin JS / API JS 作成開始"

mkdir -p "$JS_DIR"
mkdir -p "$API_DIR"

for html in "$ADMIN_DIR"/*.html; do
  filename=$(basename "$html")
  name="${filename%.html}"

  # 対象外ページ（必要に応じて追加）
  if [[ "$name" == "index" || "$name" == "login" || "$name" == "logout" ]]; then
    continue
  fi

  PAGE_JS="$JS_DIR/admin-$name.js"
  API_JS="$API_DIR/$name.api.js"

  # ===== ページ JS =====
  if [ -f "$PAGE_JS" ]; then
    echo "⏭ 既存: admin-$name.js"
  else
    echo "🆕 作成: admin-$name.js"
    cat <<EOF > "$PAGE_JS"
/**
 * admin-$name.js
 * 対応ページ: $filename
 */

import { CONFIG } from "/assets/js/config.js";
import * as api from "./api/$name.api.js";

// TODO: 初期化処理
console.log("admin-$name loaded");

// document.addEventListener("DOMContentLoaded", () => {
//   init();
// });

// function init() {
//   // ページ固有処理
// }
EOF
  fi

  # ===== API JS =====
  if [ -f "$API_JS" ]; then
    echo "⏭ 既存: $name.api.js"
  else
    echo "🆕 作成: $name.api.js"
    cat <<EOF > "$API_JS"
/**
 * $name.api.js
 * admin API for $name
 */

import { apiAdminGet, apiAdminPost } from "./apiAdmin.js";

// export function get${name^}List() {
//   return apiAdminGet("/$name");
// }

// export function create${name^}(data) {
//   return apiAdminPost("/$name", data);
// }
EOF
  fi

done

echo "✅ admin ページ JS & API JS 作成完了"
