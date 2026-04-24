"use client";

import { CreditCard, Landmark, Wallet } from "lucide-react";
import type { CartStep } from "./types";
import { formatJPY } from "./format-jpy";

type Props = {
  step: CartStep;
  itemCount: number;
  subtotalJPY: number;
  shippingJPY: number;
  feeJPY: number;
  totalJPY: number;
  onConfirmPay: () => void;
};

export default function CartSummaryPanel({
  step,
  itemCount,
  subtotalJPY,
  shippingJPY,
  feeJPY,
  totalJPY,
  onConfirmPay,
}: Props) {
  return (
    <div className="sticky top-32 border border-gray-50 bg-white p-8 shadow-sm">
      <h3 className="mb-8 font-serif text-xl font-bold">結帳總計</h3>
      <div className="mb-8 space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">商品小計</span>
          <span>{formatJPY(subtotalJPY)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">日本直送運費</span>
          <span>{itemCount > 0 ? formatJPY(shippingJPY) : formatJPY(0)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">手續費</span>
          <span>{formatJPY(feeJPY)}</span>
        </div>
      </div>
      <div className="mb-12 flex items-end justify-between border-t border-gray-100 pt-8">
        <span className="font-bold">總計</span>
        <span className="text-3xl font-bold text-[var(--torii-red)]">{formatJPY(totalJPY)}</span>
      </div>

      <button
        type="button"
        className="w-full bg-[var(--torii-red)] py-5 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all duration-500 hover:shadow-2xl disabled:opacity-50"
        disabled={itemCount === 0 || step !== 3}
        onClick={onConfirmPay}
      >
        確認結緣並支付
      </button>

      <div className="mt-8 flex items-center justify-center space-x-4 opacity-30">
        <CreditCard className="h-5 w-5" />
        <Landmark className="h-5 w-5" />
        <Wallet className="h-5 w-5" />
      </div>
    </div>
  );
}
