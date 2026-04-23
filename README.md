# react-omamori

以 **React / Next.js** 製作的後台管理作品，包含：
- **商品管理**：列表、分頁、新增、編輯、刪除、主圖上傳
- **訂單管理**：列表、分頁、編輯（付款狀態/留言）、刪除
- **優惠券管理**：列表、新增、編輯、刪除

## 開發環境
- Node.js（建議 18+）
- npm

## 安裝與啟動

```bash
npm install
npm run dev
```

啟動後開啟 `http://localhost:3000`

## 環境變數（.env）
在專案根目錄建立 `.env`：

```env
NEXT_PUBLIC_BASE_URL=https://vue3-course-api.hexschool.io
NEXT_PUBLIC_API_PATH=react-omamori-api
```

## 登入 / Token
後台 API 需要 `Authorization` token。
本專案會從瀏覽器 Cookie 讀取 `access_token`（由登入流程寫入）。

## 頁面路由
- `/products`：商品管理
- `/orders`：訂單管理
- `/coupons`：優惠券管理

## 備註
- API 路徑使用 `v2`：`{BASE_URL}/v2/api/{API_PATH}/admin/...`
