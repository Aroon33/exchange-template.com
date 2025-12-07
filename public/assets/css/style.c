/* ==============================
   共通変数
============================== */
:root {
  --bg: #f5f7fb;
  --bg-soft: #ffffff;
  --primary: #1652f0;
  --primary-soft: #e5edff;
  --text-main: #1f2933;
  --text-muted: #7b8794;
  --border-soft: #e4e7eb;
  --danger: #e02424;
  --success: #1ca36a;
  --pending: #f97316;
}

/* ==============================
   RESET / グローバル
============================== */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

body {
  background: var(--bg);
  color: var(--text-main);
}

a {
  text-decoration: none;
  color: inherit;
}

main {
  max-width: 1280px;
  margin: 0 auto;
}

/* ==============================
   共通ボタン
============================== */
.btn {
  border-radius: 999px;
  padding: 7px 14px;
  font-size: 13px;
  cursor: pointer;
  border: 1px solid transparent;
  background: transparent;
}

.btn-sm {
  padding: 4px 10px;
  font-size: 12px;
}

.btn-xs {
  padding: 4px 9px;
  border-radius: 999px;
  font-size: 11px;
  border: 1px solid var(--border-soft);
  background: #fff;
  cursor: pointer;
}

.btn-xs-outline {
  padding: 4px 9px;
  border-radius: 999px;
  font-size: 11px;
  border: 1px solid var(--border-soft);
  background: #fff;
  cursor: pointer;
}

.btn-xs-primary {
  padding: 4px 9px;
  border-radius: 999px;
  font-size: 11px;
  border: 1px solid var(--primary);
  background: var(--primary);
  color: #fff;
}

.btn-outline {
  background: #fff;
  border-color: var(--border-soft);
  color: var(--text-main);
}

.btn-primary {
  background: var(--primary);
  color: #fff;
}

/* ==============================
   ユーザー側ヘッダー（site-header）
============================== */
.site-header {
  background: #ffffff;
  border-bottom: 1px solid var(--border-soft);
  padding: 10px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 20;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 20px;
}

/* ユーザー・管理共通ロゴバッジ */
.logo-badge,
.admin-logo-badge {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
}

.site-nav {
  display: flex;
  gap: 16px;
  font-size: 14px;
}

.site-nav .nav-link {
  color: var(--text-muted);
}

.site-nav .nav-link.active {
  color: var(--primary);
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

/* ログインフォームなどで使う muted テキスト */
.muted {
  font-size: 11px;
  color: var(--text-muted);
}

/* ==============================
   共通カード / テーブル
============================== */
.card {
  background: var(--bg-soft);
  border-radius: 12px;
  border: 1px solid var(--border-soft);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
  padding: 12px 14px;
  font-size: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
}

.card-sub,
.card-sub-small {
  font-size: 11px;
  color: var(--text-muted);
}

.card-title-small {
  font-size: 13px;
  font-weight: 600;
}

/* テーブル共通 */
.table-wrapper {
  border-radius: 10px;
  border: 1px solid var(--border-soft);
  overflow: hidden;
  background: #fff;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
}

th,
td {
  padding: 6px 4px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
  white-space: nowrap;
}

th {
  color: var(--text-muted);
  font-weight: 600;
}

td.amount {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

/* ==============================
   ユーザー用コンポーネント（マイページ / 履歴 / サポート etc）
============================== */

/* マイページ */
.grid-main {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.4fr);
  gap: 14px;
}
@media (max-width: 900px) {
  .grid-main {
    grid-template-columns: 1fr;
  }
}

.user-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: linear-gradient(135deg, #1652f0, #4f46e5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
}

.user-email {
  font-size: 11px;
  color: var(--text-muted);
}

.user-meta {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 4px;
}

.flex-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 6px;
}

.pill {
  border-radius: 999px;
  border: 1px solid var(--border-soft);
  padding: 3px 8px;
  font-size: 11px;
  background: #fff;
  color: var(--text-muted);
}

.pill-strong {
  background: var(--primary-soft);
  border-color: var(--primary-soft);
  color: var(--primary);
}

/* サマリーカード（マイページ・ダッシュボードなど） */
.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  margin-top: 2px;
}

.summary-main-label {
  font-size: 11px;
  color: var(--text-muted);
}

.summary-main-value {
  font-size: 22px;
  font-weight: 700;
}

.summary-sub {
  font-size: 11px;
  color: var(--text-muted);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 10px;
}
@media (max-width: 780px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
}

.summary-card {
  border-radius: 10px;
  border: 1px solid var(--border-soft);
  padding: 8px 9px 7px;
  background: #f9fafb;
}

.summary-card-label {
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 2px;
}

.summary-card-value {
  font-size: 13px;
  font-weight: 600;
}

/* 2カラムレイアウト用 */
.two-cols {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  gap: 14px;
}
@media (max-width: 900px) {
  .two-cols {
    grid-template-columns: 1fr;
  }
}

/* ステータス点・バッジ系 */
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  display: inline-block;
  margin-right: 4px;
}

.dot-on {
  background: var(--success);
}

.dot-off {
  background: #d1d5db;
}

.dot-warn {
  background: var(--pending);
}

.badge {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  display: inline-flex;
  align-items: center;
}

.badge-level {
  background: var(--primary-soft);
  color: var(--primary);
}

.badge-kyc {
  background: #e5e7eb;
  color: var(--text-main);
}

.badge-group {
  background: var(--primary-soft);
  color: var(--primary);
}

/* ステータスバッジ */
.status-active {
  background: #dcfce7;
  color: var(--success);
}

.status-pending {
  background: #ffedd5;
  color: var(--pending);
}

.status-suspended {
  background: #fee2e2;
  color: var(--danger);
}

.chip-status-open {
  background: #ffedd5;
  color: var(--pending);
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 11px;
}

.chip-status-none {
  background: #e5e7eb;
  color: var(--text-muted);
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 11px;
}

/* 共通 note テキスト */
.note {
  font-size: 10px;
  color: var(--text-muted);
  margin-top: 4px;
}

/* リンク風 */
.link {
  color: var(--primary);
  font-size: 11px;
}

/* 履歴フィルタ（history.html） */
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-muted);
}

.chips {
  display: inline-flex;
  border-radius: 999px;
  border: 1px solid var(--border-soft);
  overflow: hidden;
  font-size: 11px;
}

.chip-btn {
  padding: 4px 10px;
  border: none;
  background: #fff;
  color: var(--text-muted);
  cursor: pointer;
}

.chip-btn.active {
  background: var(--primary);
  color: #fff;
}

/* テーブルの no-data メッセージ */
.no-data {
  font-size: 12px;
  color: var(--text-muted);
  text-align: center;
  padding: 18px 0 10px;
}

/* サポート（support.html） */
.thread-list {
  max-height: 420px;
  overflow-y: auto;
  border-radius: 8px;
  border: 1px solid var(--border-soft);
  background: #f9fafb;
}

.thread-title,
.ticket-title,
.item-title {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 2px;
}

.thread-meta,
.ticket-meta,
.item-meta,
message-meta,
support-ticket-meta,
support-message-meta {
  font-size: 11px;
  color: var(--text-muted);
}

.support-ticket-title,
support-ticket-meta,
support-message-body {
  font-size: 11px;
}

/* チャットウィンドウ */
.chat-window {
  border-radius: 8px;
  border: 1px solid var(--border-soft);
  background: #f9fafb;
  height: 260px;
  overflow-y: auto;
  padding: 7px 8px 5px;
  margin-bottom: 6px;
}

.chat-empty {
  font-size: 12px;
  color: var(--text-muted);
  text-align: center;
  margin-top: 80px;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.chat-thread-title {
  font-size: 13px;
  font-weight: 600;
}

.chat-status {
  font-size: 11px;
  color: var(--text-muted);
}

.chat-input-row {
  display: flex;
  gap: 6px;
  margin-top: 2px;
}

.chat-input-row textarea {
  flex: 1;
  resize: vertical;
  min-height: 44px;
  border-radius: 6px;
  border: 1px solid var(--border-soft);
  padding: 6px 7px;
  font-size: 12px;
  outline: none;
}

.chat-input-row textarea:focus {
  border-color: var(--primary);
}

.msg-meta,
.message-meta {
  font-size: 10px;
  color: #6b7280;
  margin-top: 2px;
  text-align: right;
}

/* システム取引UI（旧版のクラス） */
.pill-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.switch-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.switch {
  width: 34px;
  height: 18px;
  border-radius: 999px;
  background: #d1d5db;
  position: relative;
  cursor: pointer;
}

.switch-knob {
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: #fff;
  position: absolute;
  top: 1px;
  left: 1px;
  transition: all 0.15s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
}

.switch.on {
  background: var(--primary);
}

.switch.on .switch-knob {
  left: 17px;
}

.system-log {
  max-height: 260px;
  overflow-y: auto;
  border-radius: 6px;
  border: 1px solid var(--border-soft);
  padding: 6px 8px;
  background: #f9fafb;
  font-family: "SF Mono", Menlo, Consolas, monospace;
  font-size: 10px;
  color: #4b5563;
}

/* 入出金（wallet.html） */
.wallet-summary {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 12px;
}

.wallet-total-label {
  font-size: 12px;
  color: var(--text-muted);
}

.wallet-total-value {
  font-size: 22px;
  font-weight: 700;
}

.wallet-sub {
  font-size: 12px;
  color: var(--text-muted);
}

.wallet-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  margin-top: 6px;
}

.wallet-table th,
.wallet-table td {
  padding: 6px 4px;
  text-align: right;
  white-space: nowrap;
}

.wallet-table th:first-child,
.wallet-table td:first-child {
  text-align: left;
}

.wallet-actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.wallet-actions .btn-sm {
  flex: 1;
}

/* QR ボックス */
.qr-box {
  border-radius: 8px;
  border: 1px dashed var(--border-soft);
  padding: 10px;
  text-align: center;
  font-size: 11px;
  color: var(--text-muted);
  background: #f9fafb;
}

.fake-qr {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  border: 8px solid #e5e7eb;
  margin: 4px auto 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: var(--text-muted);
  background: #fff;
}

/* signup / login 用 */
.form-row {
  margin-bottom: 10px;
}

.form-row label {
  display: block;
  font-size: 12px;
  margin-bottom: 4px;
}

.form-row input,
.form-row select {
  width: 100%;
  border-radius: 6px;
  border: 1px solid var(--border-soft);
  padding: 8px 9px;
  font-size: 13px;
  outline: none;
}

.form-row input:focus,
.form-row select:focus {
  border-color: var(--primary);
}

.row-inline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  margin-bottom: 10px;
  color: var(--text-muted);
}

/* tos / tips */
.tos {
  font-size: 11px;
  color: var(--text-muted);
  margin: 6px 0 10px;
}

.tips {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 8px;
}

/* ==============================
   Toast
============================== */
.toast {
  position: fixed;
  right: 16px;
  bottom: 16px;
  background: #111827;
  color: #f9fafb;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 11px;
  display: none;
  z-index: 50;
}

.toast.show {
  display: block;
}

/* ==============================
   管理画面共通（admin）
============================== */
.admin-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 52px;
  background: #ffffff;
  border-bottom: 1px solid var(--border-soft);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px 0 60px;
  z-index: 30;
}

.admin-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 管理用ロゴ（ユーザー側と同じ見た目に統一） */
.admin-logo-badge {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
}

.admin-logo-text {
  font-weight: 700;
  font-size: 16px;
}

.admin-logo-sub {
  font-size: 11px;
  color: var(--text-muted);
}

.admin-header-right {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  color: var(--text-muted);
}

/* サイドバー */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 200px;
  background: #0f172a;
  color: #e5e7eb;
  padding-top: 52px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #020617;
  z-index: 20;
}

.sidebar-title {
  padding: 10px 14px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6b7280;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0 8px 12px;
}

.nav-item {
  margin-bottom: 4px;
}

/* 管理側ナビ用 */
.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 8px;
  border-radius: 8px;
  font-size: 12px;
  color: #9ca3af;
  cursor: pointer;
}

.nav-link:hover {
  background: rgba(148, 163, 184, 0.15);
  color: #e5e7eb;
}

.nav-link.active {
  background: #111827;
  color: #e5e7eb;
  border: 1px solid rgba(129, 140, 248, 0.5);
}

.nav-icon {
  width: 14px;
  text-align: center;
  font-size: 12px;
}

.sidebar-footer {
  margin-top: auto;
  padding: 10px 14px 12px;
  font-size: 11px;
  color: #6b7280;
  border-top: 1px solid rgba(31, 41, 55, 0.9);
}

/* 管理メインエリア */
.admin-main {
  margin-left: 200px;
  padding-top: 52px;
}

.admin-main-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 16px 18px 24px;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.page-sub {
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 10px;
}

/* フィルターカード */
.filters-card {
  background: #fff;
  border-radius: 10px;
  border: 1px solid var(--border-soft);
  padding: 10px 12px 8px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
  margin-bottom: 10px;
}

.filters-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.filters-title {
  font-size: 13px;
  font-weight: 600;
}

.filters-meta {
  font-size: 11px;
  color: var(--text-muted);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
@media (max-width: 960px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 11px;
}

.field label {
  color: var(--text-muted);
}

.field input,
.field select {
  border-radius: 6px;
  border: 1px solid var(--border-soft);
  padding: 6px 7px;
  font-size: 11px;
  outline: none;
  background: #fff;
}

.field input:focus,
.field select:focus {
  border-color: var(--primary);
}

/* ペインレイアウト（左リスト + 右詳細） */
.pane-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.3fr);
  gap: 10px;
}
@media (max-width: 900px) {
  .pane-grid {
    grid-template-columns: 1fr;
  }
}

/* リストボックス */
.list-box {
  max-height: 420px;
  overflow-y: auto;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
}

/* チケット・KYCリスト用の行 */
.ticket-list,
.kyc-list,
.user-list {
  max-height: 420px;
  overflow-y: auto;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
}

/* detail セクション */
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 6px;
}

.detail-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 2px;
}

.detail-meta {
  font-size: 11px;
  color: var(--text-muted);
}

.detail-meta span {
  margin-right: 8px;
}

/* info パネル */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin-top: 4px;
}
@media (max-width: 800px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}

.info-block {
  border-radius: 8px;
  border: 1px solid var(--border-soft);
  padding: 8px 9px;
  background: #f9fafb;
  font-size: 11px;
}

.info-label {
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 3px;
}

.info-value {
  font-size: 12px;
  font-weight: 600;
}

.info-row {
  font-size: 11px;
  margin-top: 2px;
}

/* ステータスセレクト */
.status-select {
  font-size: 11px;
  padding: 4px 6px;
  border-radius: 6px;
  border: 1px solid var(--border-soft);
  outline: none;
}

.status-select:focus {
  border-color: var(--primary);
}

/* ステータスタブ */
.status-tabs {
  display: inline-flex;
  border-radius: 999px;
  border: 1px solid var(--border-soft);
  overflow: hidden;
  font-size: 11px;
}

.status-tab-btn {
  padding: 4px 10px;
  border: none;
  background: #fff;
  color: var(--text-muted);
  cursor: pointer;
}

.status-tab-btn.active {
  background: var(--primary);
  color: #fff;
}

/* チケット返信 */
.reply-area {
  margin-top: 2px;
}

.reply-row {
  display: flex;
  gap: 6px;
  margin-bottom: 4px;
}

.reply-row textarea {
  flex: 1;
  min-height: 48px;
  resize: vertical;
  border-radius: 6px;
  border: 1px solid var(--border-soft);
  padding: 6px 7px;
  font-size: 12px;
  outline: none;
}

.reply-row textarea:focus {
  border-color: var(--primary);
}

.toolbar {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
  margin-top: 8px;
}

/* withdraw/deposit用 wallet-row */
.wallet-row {
  font-size: 11px;
  margin-top: 2px;
}

/* 行タイトル */
.item-title {
  font-size: 12px;
  font-weight: 600;
}

/* 管理 index のサマリー */
.summary-card .summary-value {
  font-size: 16px;
  font-weight: 600;
}

/* その他細かいところは、必要に応じてこの下に追加で書き足してください */
