"use client";

import { Button } from "@/components/ui/button";

type Props = {
  orderId: string;
  totalFormatted?: string;
  isPaying: boolean;
  payError: string | null;
  onCancel: () => void;
  onConfirmPay: () => void | Promise<void>;
};

export default function CartPaymentConfirmDialog({
  orderId,
  totalFormatted,
  isPaying,
  payError,
  onCancel,
  onConfirmPay,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="關閉"
        disabled={isPaying}
        onClick={onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-pay-dialog-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-black/10 bg-[var(--off-white)] p-6 shadow-xl"
      >
        <h2 id="cart-pay-dialog-title" className="mb-2 font-serif text-xl font-bold">
          確認付款
        </h2>
        <p className="mb-3 text-sm text-black/75">
          訂單已建立，編號：
          <span className="ml-1 font-mono font-semibold text-[var(--sumi-black)]">{orderId}</span>
        </p>
        {totalFormatted ? (
          <p className="mb-4 text-sm text-black/70">
            應付金額：<span className="font-semibold text-[var(--torii-red)]">{totalFormatted}</span>
          </p>
        ) : null}
        <p className="mb-6 text-sm text-black/60">是否要立即完成線上付款？</p>
        {payError ? (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          >
            {payError}
          </div>
        ) : null}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            disabled={isPaying}
            onClick={onCancel}
          >
            稍後付款
          </Button>
          <Button
            type="button"
            className="flex-1"
            disabled={isPaying}
            onClick={() => void onConfirmPay()}
          >
            {isPaying ? "付款中…" : "立即付款"}
          </Button>
        </div>
      </div>
    </div>
  );
}
