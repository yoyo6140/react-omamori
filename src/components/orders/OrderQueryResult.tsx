"use client";

import { Button } from "@/components/ui/button";
import { formatJPY } from "@/components/carts/format-jpy";
import type { CustomerOrderDetail } from "@/hooks/useClientCarts";

type Props = {
  detail: CustomerOrderDetail;
  /** 呼叫付款 API 時使用的 id（與查詢輸入一致） */
  apiOrderId: string;
  onPay?: () => void | Promise<void>;
  payLoading?: boolean;
  payError?: string | null;
};

export default function OrderQueryResult({
  detail,
  apiOrderId,
  onPay,
  payLoading = false,
  payError,
}: Props) {
  const user = detail.user;
  const products = Array.isArray(detail.products) ? detail.products : [];
  const total =
    typeof detail.total === "number"
      ? detail.total
      : typeof detail.final_total === "number"
        ? detail.final_total
        : undefined;
  const displayId = detail.id ?? apiOrderId;
  const orderNum = typeof detail.num === "number" ? detail.num : undefined;
  const unpaid = detail.is_paid !== true;

  return (
    <div className="space-y-6 text-sm">
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-black/45">
          訂單編號
        </div>
        <div className="font-mono font-semibold text-[var(--sumi-black)]">{displayId}</div>
        {orderNum != null ? (
          <div className="mt-2 text-xs text-black/55">序號：{orderNum}</div>
        ) : null}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span
            className={
              detail.is_paid
                ? "rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800"
                : "rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-900"
            }
          >
            {detail.is_paid ? "已付款" : "未付款"}
          </span>
          {unpaid && onPay ? (
            <Button
              type="button"
              size="sm"
              disabled={payLoading}
              onClick={() => void onPay()}
            >
              {payLoading ? "付款處理中…" : "立即付款"}
            </Button>
          ) : null}
        </div>
        {payError ? (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          >
            {payError}
          </div>
        ) : null}
      </div>

      {user && typeof user === "object" ? (
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="mb-3 text-[10px] font-bold uppercase tracking-widest text-black/45">
            收件資料
          </div>
          <ul className="space-y-2 text-black/80">
            {typeof user.name === "string" && user.name ? (
              <li>
                <span className="text-black/50">姓名：</span>
                {user.name}
              </li>
            ) : null}
            {typeof user.tel === "string" && user.tel ? (
              <li>
                <span className="text-black/50">電話：</span>
                {user.tel}
              </li>
            ) : null}
            {typeof user.email === "string" && user.email ? (
              <li className="break-all">
                <span className="text-black/50">Email：</span>
                {user.email}
              </li>
            ) : null}
            {typeof user.address === "string" && user.address ? (
              <li className="break-words">
                <span className="text-black/50">地址：</span>
                {user.address}
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}

      {typeof detail.message === "string" && detail.message ? (
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-black/45">
            留言
          </div>
          <p className="text-black/75">{detail.message}</p>
        </div>
      ) : null}

      {products.length > 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="mb-3 text-[10px] font-bold uppercase tracking-widest text-black/45">
            商品明細
          </div>
          <ul className="space-y-3">
            {products.map((line, idx) => {
              const p = line.product;
              const title =
                p && typeof p === "object" && typeof p.title === "string"
                  ? p.title
                  : (typeof line.product_id === "string" && line.product_id) || `品項 ${idx + 1}`;
              const price =
                p && typeof p === "object" && typeof p.price === "number" ? p.price : 0;
              const qty = typeof line.qty === "number" ? line.qty : 1;
              return (
                <li
                  key={line.id ?? line.product_id ?? idx}
                  className="flex justify-between gap-3 border-b border-black/5 pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <div className="font-medium text-[var(--sumi-black)]">{title}</div>
                    <div className="text-xs text-black/50">
                      {formatJPY(price)} × {qty}
                    </div>
                  </div>
                  <div className="shrink-0 tabular-nums font-semibold">{formatJPY(price * qty)}</div>
                </li>
              );
            })}
          </ul>
          {total != null ? (
            <div className="mt-4 flex justify-between border-t border-black/10 pt-3 font-bold">
              <span>總計</span>
              <span className="text-[var(--torii-red)]">{formatJPY(total)}</span>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
