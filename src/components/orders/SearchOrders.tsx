"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import type { CustomerOrderDetail } from "@/hooks/useClientCarts";

type Props = {
  detail: CustomerOrderDetail;
  apiOrderId: string;
  onPay?: () => void | Promise<void>;
  payLoading?: boolean;
  payError?: string | null;
};

export default function SearchOrders({ detail, apiOrderId, onPay, payLoading, payError }: Props) {
  const user = detail?.user;
  const products = Array.isArray(detail?.products) ? detail.products : [];

  const total = useMemo(() => {
    if (typeof detail?.final_total === "number") return detail.final_total;
    if (typeof detail?.total === "number") return detail.total;
    return undefined;
  }, [detail]);

  const paid = detail?.is_paid === true;
  const paidDateText = useMemo(() => {
    const ts = detail?.paid_date;
    if (typeof ts !== "number" || !Number.isFinite(ts) || ts <= 0) return null;
    return new Date(ts * 1000).toLocaleString();
  }, [detail]);

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-black/10 bg-white shadow-sm p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-widest text-black/45">
              訂單編號
            </div>
            <div className="mt-2 font-mono text-sm font-semibold break-all">{apiOrderId}</div>
            {typeof detail?.num === "number" ? (
              <div className="mt-2 text-xs text-black/55">序號：{detail.num}</div>
            ) : null}
          </div>

          <div className="shrink-0 flex flex-col items-end gap-2">
            <span
              className={
                paid
                  ? "rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800"
                  : "rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-900"
              }
            >
              {paid ? "已付款" : "未付款"}
            </span>
            {paidDateText ? (
              <div className="text-xs text-black/55">付款時間：{paidDateText}</div>
            ) : null}
          </div>
        </div>

        {!paid && onPay ? (
          <div className="mt-5 space-y-3">
            {payError ? (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
              >
                {payError}
              </div>
            ) : null}
            <Button type="button" className="w-full" disabled={Boolean(payLoading)} onClick={onPay}>
              {payLoading ? "付款中…" : "立即付款"}
            </Button>
            <p className="text-xs text-black/50">
              若你已在其他地方完成付款，可重新查詢更新付款狀態。
            </p>
          </div>
        ) : null}
      </div>

      {user && typeof user === "object" ? (
        <div className="rounded-2xl border border-black/10 bg-white shadow-sm p-6">
          <div className="mb-3 text-[10px] font-bold uppercase tracking-widest text-black/45">
            收件資料
          </div>
          <ul className="space-y-2 text-sm text-black/80">
            {"name" in user && typeof (user as any).name === "string" && (user as any).name ? (
              <li>
                <span className="text-black/50">姓名：</span>
                {(user as any).name}
              </li>
            ) : null}
            {"tel" in user && typeof (user as any).tel === "string" && (user as any).tel ? (
              <li>
                <span className="text-black/50">電話：</span>
                {(user as any).tel}
              </li>
            ) : null}
            {"email" in user && typeof (user as any).email === "string" && (user as any).email ? (
              <li className="break-all">
                <span className="text-black/50">Email：</span>
                {(user as any).email}
              </li>
            ) : null}
            {"address" in user &&
            typeof (user as any).address === "string" &&
            (user as any).address ? (
              <li className="break-words">
                <span className="text-black/50">地址：</span>
                {(user as any).address}
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}

      {typeof detail?.message === "string" && detail.message ? (
        <div className="rounded-2xl border border-black/10 bg-white shadow-sm p-6">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-black/45">
            留言
          </div>
          <p className="text-sm text-black/75 whitespace-pre-wrap">{detail.message}</p>
        </div>
      ) : null}

      {products.length ? (
        <div className="rounded-2xl border border-black/10 bg-white shadow-sm p-6">
          <div className="mb-3 text-[10px] font-bold uppercase tracking-widest text-black/45">
            商品明細
          </div>
          <ul className="space-y-3">
            {products.map((line: any, idx: number) => {
              const p = line?.product;
              const title =
                p && typeof p === "object" && typeof p.title === "string"
                  ? p.title
                  : (typeof line?.product_id === "string" && line.product_id) || `品項 ${idx + 1}`;
              const price = p && typeof p === "object" && typeof p.price === "number" ? p.price : 0;
              const qty = typeof line?.qty === "number" ? line.qty : 1;
              return (
                <li
                  key={line?.id ?? line?.product_id ?? idx}
                  className="flex justify-between gap-3 border-b border-black/5 pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <div className="font-medium text-[var(--sumi-black)]">{title}</div>
                    <div className="text-xs text-black/50">
                      {price}元 × {qty}
                    </div>
                  </div>
                  <div className="shrink-0 tabular-nums font-semibold">{price * qty}元</div>
                </li>
              );
            })}
          </ul>
          {total != null ? (
            <div className="mt-4 flex justify-between border-t border-black/10 pt-3 font-bold">
              <span>總計</span>
              <span className="text-[var(--torii-red)]">{total}元</span>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
