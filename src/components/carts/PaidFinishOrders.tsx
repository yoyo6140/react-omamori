"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchCustomerOrder, type CustomerOrderDetail } from "@/hooks/useClientCarts";
import Loading from "@/components/common/Loading";

type Props = {
  orderId: string;
  onClose: () => void;
};

export default function PaidFinishOrders({ orderId, onClose }: Props) {
  const [detail, setDetail] = useState<CustomerOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const d = await fetchCustomerOrder(orderId);
        if (!cancelled) setDetail(d);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "無法載入訂單");
          setDetail(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const user = detail?.user;
  const products = Array.isArray(detail?.products) ? detail.products : [];
  const total =
    typeof detail?.total === "number"
      ? detail.total
      : typeof detail?.final_total === "number"
        ? detail.final_total
        : undefined;
  const displayId = detail?.id ?? orderId;
  const orderNum = typeof detail?.num === "number" ? detail.num : undefined;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="關閉"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-receipt-title"
        className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-black/10 bg-[var(--off-white)] p-6 shadow-xl"
      >
        <h2 id="cart-receipt-title" className="mb-4 font-serif text-xl font-bold">
          訂單完成
        </h2>

        {loading ? (
          <div className="py-10">
            <Loading label="載入訂單資料中…" className="w-full" />
          </div>
        ) : error ? (
          <div className="space-y-4">
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
            >
              {error}
            </div>
            <Button type="button" variant="outline" className="w-full" onClick={onClose}>
              關閉
            </Button>
          </div>
        ) : detail ? (
          <div className="space-y-6 text-sm">
            <div className="rounded-lg border border-black/10 bg-white/80 p-4">
              <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-black/45">
                訂單編號
              </div>
              <div className="font-mono font-semibold text-[var(--sumi-black)]">{displayId}</div>
              {orderNum != null ? (
                <div className="mt-2 text-xs text-black/55">序號：{orderNum}</div>
              ) : null}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className={
                    detail.is_paid
                      ? "rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800"
                      : "rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-900"
                  }
                >
                  {detail.is_paid ? "已付款" : "未付款"}
                </span>
              </div>
            </div>

            {user && typeof user === "object" ? (
              <div className="rounded-lg border border-black/10 bg-white/80 p-4">
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
              <div className="rounded-lg border border-black/10 bg-white/80 p-4">
                <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-black/45">
                  留言
                </div>
                <p className="text-black/75">{detail.message}</p>
              </div>
            ) : null}

            {products.length > 0 ? (
              <div className="rounded-lg border border-black/10 bg-white/80 p-4">
                <div className="mb-3 text-[10px] font-bold uppercase tracking-widest text-black/45">
                  商品明細
                </div>
                <ul className="space-y-3">
                  {products.map((line, idx) => {
                    const p = line.product;
                    const title =
                      p && typeof p === "object" && typeof p.title === "string"
                        ? p.title
                        : (typeof line.product_id === "string" && line.product_id) ||
                          `品項 ${idx + 1}`;
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

            <Button type="button" className="w-full" onClick={onClose}>
              關閉
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
