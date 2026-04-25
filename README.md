# react-omamori

以 **React 19 / Next.js 16** 製作的御守電商與後台管理專案，串接六角 **Vue3 課程 API**（免驗證客戶端＋需 Token 的管理端）。

## 功能概覽

### 前台（使用者）

- **首頁／尋找祝福**：`/home`、首頁導向
- **商品詳情**：`/info/[id]`
- **購物車／結帳**：`/carts`（多步驟：願望清單 → 寄送資料 → 總計；同步 `POST /cart`、建立訂單 `POST /order`、可選 `POST /pay/:orderId`）
- **訂單查詢**：`/check`（依訂單編號查詢、顯示付款狀態；未付款可補付）。支援網址參數 `?id=訂單編號` 自動查詢

### 後台（管理）

- **商品管理**：`/products` — 列表、分頁、新增、編輯、刪除、主圖上傳
- **訂單管理**：`/orders` — 列表、分頁、編輯（付款狀態／留言）、刪除
- **優惠券管理**：`/coupons` — 列表、新增、編輯、刪除

後台選單經 **TopBar** 導覽；前台主要經 **Navbar**（含購物車數量、訂單查詢連結）。

## 資料夾結構（精簡）

```text
react-omamori/
├── public/                    # 靜態檔（圖示、圖片等）
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── page.tsx           # 根路徑導向
│   │   ├── layout.tsx         # 全站版面、Providers
│   │   ├── globals.css
│   │   ├── not-found.tsx
│   │   ├── home/              # 前台首頁
│   │   ├── info/[id]/         # 商品詳情
│   │   ├── carts/             # 購物車／結帳
│   │   ├── check/             # 訂單查詢
│   │   ├── login/             # 登入
│   │   ├── products/          # 後台｜商品
│   │   ├── orders/            # 後台｜訂單
│   │   └── coupons/           # 後台｜優惠券
│   ├── components/
│   │   ├── carts/             # 購物車步驟、付款／收據彈層、format-jpy
│   │   ├── common/            # Navbar、Footer、TopBar、Modal、providers
│   │   ├── coupons/
│   │   ├── effects/           # 視覺效果（例：櫻花）
│   │   ├── home/              # 首頁區塊
│   │   ├── info/              # 商品頁操作區
│   │   ├── orders/            # 後台編輯訂單、OrderQueryResult 等
│   │   ├── products/          # 後台商品表單／列表
│   │   └── ui/                # 按鈕、輸入、表格、分頁等基礎元件
│   ├── hooks/                 # useAuth、useClientCarts、useAdmin*、useClientProducts …
│   ├── lib/                   # 共用工具（例：utils）
│   └── asset/                 # icon、images 等資源
├── package.json
├── README.md
├── AGENTS.md                  #（可選）給 AI Agent 的說明
└── CLAUDE.md                  #（可選）指向 AGENTS.md
```

## 開發環境

- Node.js（建議 20+）
- npm

## 安裝與啟動

```bash
npm install
npm run dev
```

啟動後開啟 `http://localhost:3000`

其他指令：`npm run build`、`npm run start`、`npm run lint`、`npm run format`

## 環境變數（`.env`）

在專案根目錄建立 `.env`（未設定時程式內有與下列相同的預設值，仍建議明確設定）：

```env
NEXT_PUBLIC_BASE_URL=https://vue3-course-api.hexschool.io
NEXT_PUBLIC_API_PATH=react-omamori-api
```

客戶端購物車／訂單／付款 API 基底為：`{NEXT_PUBLIC_BASE_URL}/v2/api/{NEXT_PUBLIC_API_PATH}/...`

## Vercel 自動化部署（GitHub Actions）

本專案已包含 Vercel 自動部署設定檔：

- `vercel.json`：指定 Next.js 專案的安裝／建置指令
- `.github/workflows/vercel.yml`：
  - **Pull Request**：自動部署 **Preview**
  - **push 到 `main`**：自動部署 **Production**

### 需要的 GitHub Secrets

請到 GitHub Repo → Settings → Secrets and variables → Actions，新增以下 3 個 Secrets：

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

> 小提示：你可以在本機執行 `vercel link` 後從 `.vercel/project.json` 取得 `orgId` / `projectId`，再把值貼到 GitHub Secrets。請勿把 `.vercel/` 提交進 repo。

### Vercel 環境變數

Vercel 專案中也需要設定（Preview / Production 兩個環境都建議設定）：

- `NEXT_PUBLIC_BASE_URL`
- `NEXT_PUBLIC_API_PATH`

## 登入與 Token

後台管理 API 需帶 `Authorization`（Bearer 等依後端約定）。本專案自瀏覽器 Cookie 讀取 `access_token`（登入流程寫入）。登入頁：`/login`

## 主要路由一覽

| 路徑         | 說明                    |
| ------------ | ----------------------- |
| `/`          | 導向首頁                |
| `/home`      | 前台首頁                |
| `/info/[id]` | 商品詳情                |
| `/carts`     | 購物車與結帳            |
| `/check`     | 訂單查詢（可加 `?id=`） |
| `/login`     | 登入                    |
| `/products`  | 後台商品                |
| `/orders`    | 後台訂單                |
| `/coupons`   | 後台優惠券              |

## 備註

- 管理端 API 路徑形如：`{BASE_URL}/v2/api/{API_PATH}/admin/...`（見各 hook／服務實作）。
- 客戶端購物相關邏輯集中於 `src/hooks/useClientCarts.tsx`（含 `POST /cart`、`POST /order`、`POST /pay/:id`、`GET /order/:id` 等）。

## AI 輔助開發（可選）

- `AGENTS.md`：給編輯器／Agent 的專案提示（不影響建置）。
- `CLAUDE.md`：指向 `AGENTS.md`。
