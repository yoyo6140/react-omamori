"use client";

import type { CartItem, CartStep } from "./types";
import { Button } from "../ui/button";
type Props = {
  step: CartStep;
  items: CartItem[];
  isSubmitting?: boolean;
  onConfirmPay: () => void | Promise<void>;
};

export default function CartSummaryPanel({
  step,
  items,
  isSubmitting = false,
  onConfirmPay,
}: Props) {
  const itemCount = items.reduce((n, i) => n + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  return (
    <div className="sticky top-32 border border-gray-50 bg-white p-8 shadow-sm">
      <h3 className="mb-6 font-serif text-xl font-semibold">商品明細</h3>

      <div className="mb-10 space-y-3">
        {items.length === 0 ? (
          <div className="text-sm text-black/60">目前沒有商品</div>
        ) : (
          <ul className="space-y-3">
            {items.map((i) => (
              <li key={i.id} className="flex items-baseline justify-between gap-4">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-[var(--sumi-black)]">
                    {i.title}
                  </div>
                </div>
                <div className="shrink-0 tabular-nums text-sm font-semibold text-[var(--sumi-black)]">
                  {i.price * i.qty}元
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-10 flex items-end justify-between border-t border-gray-100 pt-6">
        <span className="font-bold">商品總計</span>
        <span className="text-2xl font-bold text-[var(--torii-red)] tabular-nums">
          {totalPrice}元
        </span>
      </div>

      <Button
        type="button"
        className="w-full"
        disabled={itemCount === 0 || step !== 3 || isSubmitting}
        onClick={() => void onConfirmPay()}
      >
        {isSubmitting ? "送出中…" : "送出訂單"}
      </Button>
    </div>
  );
}
