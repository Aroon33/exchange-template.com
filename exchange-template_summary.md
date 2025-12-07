exchange-template

📘 プロジェクト引き継ぎメモ：CryptoX Exchange（NestJS + HTMLフロント）


このメモは、`exchange-template.com` のフロントと  
`api.exchange-template.com`（NestJS / Prisma / MariaDB）の API を連携済みの現在状態を、  
新しいチャットに引き継ぐためのまとめです。

---

## 1. サーバー & ディレクトリ構成

- ドメイン（フロント）  
  - `https://exchange-template.com`
  - ドキュメントルート: `/var/www/exchange-template.com/public`

- ドメイン（API）  
  - `https://api.exchange-template.com`
  - NestJS アプリ: `/var/www/exchange-api`
  - API ベースURL（フロントからの呼び先）: `https://api.exchange-template.com`

- CSS  
  - フロント共通: `/var/www/exchange-template.com/public/assets/css/style.css`
  - 管理画面用: `/var/www/exchange-template.com/public/assets/css/admin.css`

- Admin HTML  
  - `/var/www/exchange-template.com/public/admin/*.html`

---

## 2. バックエンド構成（NestJS + Prisma + MariaDB）

- 言語・FW
  - Node.js v24
  - NestJS
  - Prisma ORM
  - DB: MariaDB (DB名: `exchange_api`)

- Prisma 周り（概念的なスキーマ）
  - `User`
    - `id` (PK)
    - `email` (unique)
    - `password` (ハッシュ)
    - `name`
    - `role` (`USER` / `ADMIN` など)
    - `groupId` (Group FK, null許容)
    - `createdAt`, `updatedAt`
  - `Wallet`
    - `id`
    - `userId` (User FK)
    - `balanceTotal`
    - `balanceAvailable`
    - `balanceLocked`
  - `Transfer`（入出金のログ）
    - `id`
    - `userId`
    - `type` (`deposit` / `withdraw`)
    - `currency` (`BTC` / `ETH` / `USDT` / `JPY` etc.)
    - `amount`
    - `status` (`pending` / `completed` / `user_cancel` / `admin_cancel`)
    - `method` (`bank_transfer` / `crypto` など)
    - `createdAt`, `updatedAt`
    - ※ Admin の入出金画面では `cx_transfers` という localStorage データをデモ用に使用
  - `KycRequest`（KYC申請）
    - `id`
    - `userId`
    - `status` (`pending` / `approved` / `rejected` / カスタムステータス)
    - `level` (1/2/3)
    - `selfieStatus`, `idDocStatus`, `addressStatus` 等（UIではセルフィー/住所/IDごとの判定を表示）
    - `createdAt`, `updatedAt`
  - `Ticket`（サポート問い合わせ）
    - `id`
    - `userId`
    - `title`
    - `status` (`new` / `open` / `closed`)
    - `createdAt`, `updatedAt`
  - `TicketMessage`
    - `id`
    - `ticketId`
    - `from` (`user` / `admin`)
    - `body`
    - `createdAt`
  - `Group`
    - `id`
    - `code`（A/B/C/D など）
    - `name`
    - `description`

※ 上記は現在の UI と API 設計からの構造イメージ。実際の Prisma schema は必要に応じて微調整。

---

## 3. 認証 & API エンドポイント

### 認証（JWT + Cookie）

- `POST /auth/register`
  - 受け取り: `{ email, password, name }`
  - 新規ユーザー作成＋Wallet 初期化
  - 戻り値: `{ id, email, name, role }`（パスワードは返さない）
- `POST /auth/login`
  - 受け取り: `{ email, password }`
  - 成功時:
    - Cookie に `access_token`, `refresh_token` 設定（`httpOnly`）
    - 戻り値: `{ access, refresh, user: { id, email, name, role } }`
- `GET /auth/me`
  - Cookie の access_token からユーザー情報取得
  - 戻り値: `{ id, email, name, role, ... }`

---

## 4. ウォレット / 入出金 API

- `GET /wallet`
  - レスポンス例:
    ```json
    {
      "wallet": {
        "balanceTotal": "1000",
        "balanceAvailable": "800",
        "balanceLocked": "200"
      },
      "balances": [
        { "asset": "USDT", "amount": "1000", "available": "800", "locked": "200" },
        { "asset": "BTC",  "amount": "0.5",  "available": "0.3", "locked": "0.2" }
      ]
    }
    ```

- `POST /deposit/request`
  - 受け取り: `{ asset, amount }`
  - `Transfer` に `type="deposit"` & `status="pending"` で登録
  - Admin側（deposit.html）で `completed` に変更したタイミングで DB 上の `Wallet` に反映する想定。
  - ※ 現状 admin は localStorageベースのデモ実装

- `POST /withdraw/request`
  - 受け取り: `{ asset, amount }`
  - `Transfer` に `type="withdraw"` & `status="pending"` で登録
  - Admin側（withdraw.html）で `pending → completed` / `cancel` にしたタイミングで
    `Wallet` 残高を減算 / ロック解除する想定。

---

## 5. KYC API

- `GET /kyc/status`
  - ログイン中ユーザーのKYCステータスを返す
  - 例: `{ status: "pending", level: 2, selfieStatus: "PENDING", idStatus: "PENDING", addressStatus: "PENDING" }`

- `POST /kyc/submit`
  - 受け取り: `{ type: "driver_license" | "mynumber" | "passport" | ... }`
  - `KycRequest` に登録／更新し、`status="pending"` にする
  - Adminの `admin/kyc.html` は現在 localStorage `cx_kyc_requests` を使うデモ（API化予定）

---

## 6. サポート / 問い合わせ API

ユーザー側（support.html）と管理側（admin/tickets.html）で想定：

- `GET /tickets`
  - ログインユーザーの自分のチケット一覧
- `POST /tickets`
  - `{ title, body }` で新規スレッド作成
- `GET /tickets/:id/messages`
  - そのスレッドのメッセージ一覧
- `POST /tickets/:id/reply`
  - `{ body }` で返信
- Admin用：
  - `GET /tickets/admin/all`（あるいは `/tickets?scope=admin`）
  - `POST /tickets/admin/:id/status` （`new/open/closed` 変更）

**現状フロント実装：**

- `/public/support.html`
  - ユーザー側の問い合わせ画面。
  - 元は localStorage `cx_support_threads` を利用するデモとして実装済み
  - API 実装後は `/tickets` 系APIに差し替え予定。

- `/public/admin/tickets.html`
  - 管理者側の問い合わせ一覧・返信画面。
  - 同様に `cx_support_threads` を参照するデモ実装。
  - こちらも将来的に `/tickets` 管理APIにマッピングする想定。

---

## 7. フロント HTML と API 紐付け状況

### 7.1 ユーザー向けページ

- `signup.html`
  - 読み込むCSS: `assets/css/style.css`
  - API:
    - `POST https://api.exchange-template.com/auth/register`
  - JS:
    - `#signup-email`, `#signup-password`, `#signup-lastname`, `#signup-firstname`, `#signup-tos` 等から値を取り、
      成功時にログインページへ遷移。

- `login.html`
  - CSS: `assets/css/style.css`
  - API:
    - `POST /auth/login`
  - JS:
    - 成功時 `Set-Cookie` された JWT を利用し、
      メッセージ表示 or `mypage.html` へ遷移。

- `wallet.html`
  - CSS: `assets/css/style.css`
  - API:
    - `GET /wallet` → 残高一覧と総評価額表示
    - `POST /deposit/request` → 入金申請
    - `POST /withdraw/request` → 出金申請
  - UI:
    - 総残高表示 `#wallet-total`
    - 通貨別テーブル `#wallet-body`

- `mypage.html`
  - CSS: `assets/css/style.css`
  - API:
    - `GET /auth/me` → ユーザー情報（メール、roleなど）
  - UI:
    - プロフィールカード（メール・最終ログイン・KYC状況など）
    - 資産サマリー（現時点ではダミーデータ。あとで `/wallet` と連携可）

- `kyc.html`
  - CSS: `assets/css/style.css`
  - API:
    - `GET /kyc/status`
    - `POST /kyc/submit`
  - UI:
    - レベル1〜3のステップ表示
    - ボタンから `/kyc/submit` を叩き `pending` に変更する流れを想定（現在はデモ用）

- `support.html`
  - CSS: `assets/css/style.css`
  - 現状:
    - localStorage `cx_support_threads` ベースの問い合わせチャットデモ
  - 将来:
    - `/tickets` 系 API に置き換え

- `exchange.html`
  - CSS: `assets/css/style.css`（exchange用追加）
  - TradingView チャート & ローカル板デモ  
  - まだ本番取引APIには接続していない（今後 `/orders` エンドポイント追加予定）

- `history.html`
  - CSS: `assets/css/style.css`
  - 現在はダミーの約定履歴（フロントのみ）  
  - 将来: `/orders/history` などに接続予定

- `system-trade.html`
  - CSS: `assets/css/style.css`＋一部 system-trade用 CSS 追記
  - 現状: ランダムシグナルログ出力デモ
  - 将来: `/system/settings`, `/system/start`, `/system/stop` 等のAPIを引き当てる計画

- `campaign.html`
  - CSS: `assets/css/style.css`＋ campaign用 CSS
  - 完全フロントのみのキャンペーンページ（API連携なし）

---

### 7.2 管理者向けページ（/public/admin）

- `admin/index.html`（Dashboard）
  - CSS: `../assets/css/style.css`, `../assets/css/admin.css`
  - 現状: localStorage ダミーデータを使って、
    - ユーザー数 / 未対応問い合わせ / 入金申請数 / 出金申請数 を表示
  - 将来: API（`/admin/users/summary`, `/admin/deposit/pending`, `/admin/withdraw/pending` etc.）に置換予定。

- `admin/deposit.html`
  - 入金申請一覧
  - デモロジック:
    - localStorage `cx_transfers` にある `type="deposit"` のレコードを一覧表示
    - ステータス `pending → completed` 等への変更時に
      `cx_wallet_store` の総残高・利用可能残高を更新する仕組み（デモ）
  - 将来: `Transfer` + `Wallet` をDBで管理する `/admin/deposit` 系APIへ接続

- `admin/withdraw.html`
  - 出金申請一覧
  - デモロジック：
    - `cx_transfers` の `type="withdraw"` を基に、ステータス変更時（pending→completed/cancel）に
      `cx_wallet_store` の `total` / `available` を調整
  - 将来: `/admin/withdraw` 系APIに置換

- `admin/kyc.html`
  - KYC申請状況
  - デモ: localStorage `cx_kyc_requests` を使い、  
    `all_ng / selfie_ng / address_ng / id_ng / all_ok / steps_ok` などの判定ステータスを付与
  - 将来: `/admin/kyc` 系APIと Prisma の `KycRequest` に接続

- `admin/tickets.html`
  - 問い合わせ一覧＋チャット返信
  - デモ: `cx_support_threads`（ユーザー側 support.html と共通）  
  - 将来: `/tickets/admin/*` API と `Ticket` / `TicketMessage` へ

- `admin/group.html`
  - グループ A/B/C/D ごとのユーザー分布 & 一括移動デモ
  - デモ: メモリ上の `users` 配列のみ
  - 将来: `/admin/groups` + `/admin/users/group-move` 等のAPIを設計予定

- `admin/users.html`
  - ユーザー一覧
  - デモ: `users` 配列のみ
  - 将来: `/admin/users` API に置き換える想定

---

## 8. ローカルデモ用のストレージキー（Admin・ユーザー両方）

現状、本番DBの代わりに browser localStorage を一部使っている箇所があります。

- `cx_transfers`
  - deposit / withdraw 両方の申請データ

- `cx_wallet_store`
  - `{ [userId]: { [currency]: { total, available } } }`  
  - Admin入出金画面で残高反映のデモに使用

- `cx_support_threads`
  - ユーザー側のサポート画面（support.html）と Admin 側 tickets.html が共通利用
  - スレッドID、ユーザーID、タイトル、messages配列など

- `cx_kyc_requests`
  - Admin KYC画面（admin/kyc.html）のデモデータ

---

## 9. 今後の作業候補（次のチャットでやりたいこと）

1. **Prisma schema の確定 & DB migration の設計**
   - 上記の `User`, `Wallet`, `Transfer`, `KycRequest`, `Ticket`, `TicketMessage`, `Group` を Prisma schema として固める
   - すでに `exchange_api` DB にマイグレート済みの場合、その確認

2. **ローカルストレージでのデモ → 実DB + API への置換**
   - `cx_transfers` → `Transfer` テーブル
   - `cx_wallet_store` → `Wallet` テーブル
   - `cx_support_threads` → `Ticket` / `TicketMessage`
   - `cx_kyc_requests` → `KycRequest`

3. **Admin画面から Nest API を叩く実装**
   - admin/deposit.html → `/admin/deposit/pending`, `/admin/deposit/:id/status`
   - admin/withdraw.html → `/admin/withdraw/pending`, `/admin/withdraw/:id/status`
   - admin/kyc.html → `/admin/kyc/list`, `/admin/kyc/:id/status`
   - admin/tickets.html → `/tickets/admin/all`, `/tickets/admin/:id/reply`, `/tickets/admin/:id/status`

4. **exchange.html に本番注文APIを追加**
   - POST `/orders`（新規注文）
   - GET `/orderbook`（板）
   - GET `/trades/latest`（最近の約定）  
   （今は TradingView + ランダムデータ）

---

👆  
**このメモを新しいチャットの最初に貼ってもらえれば、「CryptoX Exchange 現在のAPI・DB・フロント連携」をすぐに再現した状態から続きができます。**  
次のチャットでは、やりたいこと（例：`Prisma schema を一緒に固めたい` / `AdminのdepositをAPIに繋ぎたい` など）だけ書いてもらえればOKです。
::contentReference[oaicite:0]{index=0}


 インフラ & 基本情報
■ サーバー


OS: Ubuntu


Webサーバー: Nginx


プロセス管理: pm2（exchange-api で常駐させる想定）


■ ドメイン


フロント（静的HTML）


https://exchange-template.com


DocumentRoot: /var/www/exchange-template.com/public




API（NestJS）


https://api.exchange-template.com


APIルート: /var/www/exchange-api


Nginx リバースプロキシ:


api.exchange-template.com:443 → http://127.0.0.1:3000




Let’s Encrypt 証明書:


/etc/letsencrypt/live/api.exchange-template.com/fullchain.pem


/etc/letsencrypt/live/api.exchange-template.com/privkey.pem






■ CORS / Cookie


NestJS main.ts：


app.use(cookieParser());


app.enableCors({ origin: ['https://exchange-template.com','https://www.exchange-template.com'], credentials: true });




フロント側 fetch は credentials: 'include' で Cookie を送信



2. DB（Prisma + MySQL/MariaDB）
■ DB 接続情報


DB名: exchange_api


Prisma schema: /var/www/exchange-api/prisma/schema.prisma


接続文字列: .env に DATABASE_URL="mysql://exchange_user:StrongPassword123!@localhost:3306/exchange_api"


■ 主なモデル（概略）
2-1. User


id, email, password, name, role (ADMIN/USER)


systemStatus (RUNNING / STOP_REQUESTED / STOPPED)


groupId → Group 参照


リレーション:


wallet: Wallet?


transfers: Transfer[]


kycRequests: KycRequest[]


tickets: Ticket[]


trades: Trade[]


group: Group?




2-2. Wallet


userId (unique)


balanceTotal（総残高）


balanceAvailable（利用可能）


balanceLocked（ロック）


2-3. Transfer（入出金）


userId


type: DEPOSIT / WITHDRAW


amount


status: PENDING / COMPLETED / CANCELED


createdAt, updatedAt


2-4. Group


id


name（とりあえず “Default Group” など）


2-5. KycRequest


userId


status (0〜5 をレベルとして利用)


documentFront, documentBack


createdAt, updatedAt


2-6. Ticket / TicketMessage（問い合わせ）


Ticket: id, userId, title, status (OPEN/CLOSED)


TicketMessage: ticketId, sender (USER/ADMIN), message, createdAt


2-7. Trade（取引履歴）


userId


symbol（BTCUSDT 等）


side（BUY/SELL）


size


entryPrice, closePrice


profit（確定損益）


openedAt, closedAt


groupId?



3. 使用言語・フレームワーク
■ バックエンド


TypeScript


NestJS


Prisma ORM


MySQL/MariaDB


主なモジュールとファイル


認証


src/auth/auth.service.ts


src/auth/auth.controller.ts


src/auth/jwt-access.strategy.ts


src/auth/guards/jwt-access.guard.ts




ユーザー情報 / me


src/auth/auth.controller.ts の /auth/me




ウォレット


src/wallet/wallet.controller.ts → /wallet




入金（Deposit）


src/deposit/deposit.controller.ts


POST /deposit/request


GET /deposit/pending


POST /deposit/approve






出金（Withdraw）


src/withdraw/withdraw.controller.ts


POST /withdraw/request


GET /withdraw/pending


POST /withdraw/approve


POST /withdraw/cancel






KYC


src/kyc/kyc.controller.ts


GET /kyc/status


POST /kyc/submit


GET /kyc/admin/list


POST /kyc/admin/set-status






チケット（サポート）


src/tickets/tickets.controller.ts


ユーザー:


GET /tickets


POST /tickets


GET /tickets/:id/messages


POST /tickets/:id/reply




管理者:


GET /tickets/admin/all


POST /tickets/admin/:id/reply


POST /tickets/admin/:id/status








グループ


src/groups/groups.controller.ts


GET /groups


POST /groups/change（User.systemStatus === STOPPED のときのみ）






システム状態


src/system/system.controller.ts


POST /system/stop（ユーザー停止）


POST /system/admin/stop-request（管理側停止リクエスト）


POST /system/close-complete（バッチによる一括決済完了 → STOPPED）


POST /system/admin/start（管理者による RUNNING への再開）


GET /system/overview（groupId, systemStatus, balanceTotal, positions[]）






取引履歴


src/trades/trades.controller.ts


GET /trades/history（ユーザー自身）


GET /trades/admin/all（管理用）






管理ダッシュボード


src/admin/admin.controller.ts


GET /admin/overview


totalUsers, totalBalance, pendingDeposits, pendingWithdraws, pendingKyc, openTickets









4. フロント側（HTML＋JS）との連携状況
■ 共通


ルート: /var/www/exchange-template.com/public


CSS:


assets/css/style.css


assets/css/admin.css




全ページで API_BASE_URL = "https://api.exchange-template.com"; を利用



4-1. ユーザー側ページ
ログイン（login.html）


JS:


POST /auth/login でログイン


成功時に cookie に access_token / refresh_token


ログイン成功後 mypage.html へ遷移




マイページ（mypage.html）


JSで取得するデータ：


/auth/me → メールアドレス / 名前 / role / groupId / systemStatus


/wallet → 残高（balanceTotal / Available）


/kyc/status → level


/wallet の transfers → 「入出金履歴」テーブル




HTML の主なID:


my-email, my-name, my-group, my-system-status


my-kyc-level


my-balance-total, my-balance-available


my-history-body（入出金履歴）


mypage-message（更新メッセージ）




ウォレット（wallet.html）


JS:


GET /wallet：


残高 → wallet-total, wallet-available, wallet-locked


transfers → wallet-history テーブル






取引履歴（history.html）


タブ構成：


入出金履歴（/wallet の transfers）


取引履歴（/trades/history）




主なID:


history-message


tab-transfer, tab-trade


section-transfer, section-trade


transfer-history-body


trade-history-body




システム取引（system-trade.html）


JS:


/auth/me で role / userId 取得


GET /system/overview → groupId, systemStatus, balanceTotal, positions[]


POST /system/stop → ユーザー停止リクエスト


POST /system/admin/start → 管理者による再開（role=ADMINのみボタン表示）




表示：


グループID → sys-group-id


システムステータス → sys-status


合計口座残高 → sys-balance-total


ポジション一覧（positions[]） → sys-positions-body（今は空の想定）


停止ボタン → sys-stop-btn


再開ボタン → sys-start-btn（管理者のみ表示）


メッセージ → sys-message




サポート（support.html）


JS:


GET /tickets → ユーザーのチケット一覧


POST /tickets → 新規チケット作成


GET /tickets/:id/messages → メッセージ一覧


POST /tickets/:id/reply → 返信




主なID:


support-ticket-list, support-messages


support-new-title, support-new-body, support-new-send


support-reply-body, support-reply-send


support-status





4-2. 管理者側ページ（/admin 以下）
ダッシュボード（admin/index.html）


JS:


GET /admin/overview




表示項目:


総ユーザー数 → admin-total-users


合計口座残高 → admin-total-balance


入金申請(PENDING) → admin-pending-deposits


出金申請(PENDING) → admin-pending-withdraws


KYC未処理件数 → admin-pending-kyc


未対応チケット数 → admin-open-tickets


メッセージ → admin-dashboard-message




入金管理（admin/deposit.html）


JS:


GET /deposit/pending


POST /deposit/approve（id指定 or 最新PENDING自動承認）




画面：


PENDING 入金一覧テーブル


選択した申請を「完了」にして Wallet に反映




出金管理（admin/withdraw.html）


JS:


GET /withdraw/pending


POST /withdraw/approve


POST /withdraw/cancel




画面：


PENDING 出金一覧


承認で locked → total 減算、キャンセルで戻す




KYC管理（admin/kyc.html）


JS:


GET /kyc/admin/list


POST /kyc/admin/set-status




画面：


ユーザーごとの KYC レベルとステータス表示


APPROVED / REJECT 更新




問い合わせ管理（admin/tickets.html）


JS:


GET /tickets/admin/all


GET /tickets/:id/messages


POST /tickets/admin/:id/reply


POST /tickets/admin/:id/status




左にチケット一覧、右にメッセージ＋返信フォーム


グループ管理（admin/group.html）


JS:


GET /groups → カード一覧


クリックしたカード → prompt で userId 入力 → POST /groups/change




条件:


User.systemStatus === STOPPED のときだけ変更可能（API側でチェック）




取引状況（admin/trades.html）


JS:


GET /trades/admin/all




テーブル（ID: admin-trades-body）に以下を表示：


ID


ユーザーID / email


銘柄


売買


数量


建値


決済値


損益


決済日時





5. 今後の作業 & 優先順位
現状、基本フロー（会員登録〜ログイン〜入金〜出金〜KYC〜サポート〜システム停止/グループ変更〜取引履歴閲覧）は実用レベルで動いている 状態です。
この先の優先順位は「運用」か「見せ方」かで変わりますが、
一般的なテストマーケ〜本番ローンチに向けての優先度をつけると：

優先度 ★★★★☆（高）
1. Trade データの“本番連携化”


今は seed_trades によるダミーデータ


実際の自動売買システム or トレーダー側から以下を連携：


新規建て → Trade or Position に記録


決済時 → Trade の closePrice/closedAt/profit 更新




連携方法:


外部からのWebhook（例: /system/trade-sync）


定期バッチでCSVなど読み込み




理由:
テストマーケで「実績」を見せるための一番重要な部分。

2. システム取引画面の情報充実（system-trade.html）


現在は：


groupId


systemStatus


balanceTotal


空の positions[]




これに：


現在の評価損益（未実現P/L）


累計確定損益（Trade.profit の合計）


当月 / 期間別の成績サマリー
を追加




理由:
ユーザーが「今、自分の口座がどう運用されているか」を一目で把握できるようにする。

3. セキュリティ・バリデーション


パスワードの最小長 / 強度チェック


入出金金額の上限・下限チェック


管理APIの認可確認（role=ADMIN のみ）


ログイン試行制限（Brute force 対策）


理由:
テストマーケでも「最低限の安全性」が必要。

優先度 ★★★☆☆（中）
4. メール通知機能


入金承認時 → ユーザーへメール


出金承認時 → ユーザーへメール


KYC 承認/否認 → ユーザーへメール


チケット返信 → ユーザーへメール


技術候補:


SMTP（ConoHa or SendGrid）


NestJS: @nestjs-modules/mailer 等



5. admin/users.html の API 化


現在、おそらくデモ用のダミー表示or未接続


目標:


GET /admin/users（簡易一覧）


各ユーザーの残高 / KYC / systemStatus をまとめて表示


ステータス / グループ変更 / 強制STOP などもここから操作




理由:
管理作業の効率化。

優先度 ★★☆☆☆（低〜中）
6. 設定画面（admin/settings.html）からの環境変更


手数料率


運用する銘柄リスト


PAM/MAM プランの切り替え etc.



7. 日次/週次レポート機能


Trade から日別・月別P/Lを集計


簡易グラフ（フロントで Chart.js 等）


CSV ダウンロード



6. まとめ（引き継ぐ人へのメッセージ）


システムは NestJS + Prisma + MySQL、フロントは静的 HTML+JS、API は HTTPS + Cookie ベースで構築されています。


ユーザー/管理者の基本フローは実装・連携済みで、残りは “トレード実績連携” と “UI/UXの肉付け” がメインフェーズです。


このドキュメントのパス・API名・ID名を見れば、
どこを触ればどの画面に影響が出るかが分かるようになっています。


このまま「トレード実績の自動連携」と「PAM/MAMの見せ方」を詰めれば、
テストマーケどころか、かなり本格的な運用まで持っていける状態です。