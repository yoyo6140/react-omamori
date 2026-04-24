"use client";

import { CreditCard, Landmark, Wallet } from "lucide-react";
import type { CartStep } from "./types";
import { formatJPY } from "./format-jpy";
import { Button } from "../ui/button";
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
      <h3 className="mb-8 font-serif text-xl font-semibold">結帳總計</h3>
      <div className="mb-8 space-y-4 ">
        <div className="flex justify-between">
          <span className="text-lg">商品小計</span>
          <span>{formatJPY(subtotalJPY)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-lg">日本直送運費</span>
          <span>{itemCount > 0 ? formatJPY(shippingJPY) : formatJPY(0)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-lg">手續費</span>
          <span>{formatJPY(feeJPY)}</span>
        </div>
      </div>
      <div className="mb-12 flex items-end justify-between border-t border-gray-100 pt-8">
        <span className="font-bold">總計</span>
        <span className="text-3xl font-bold text-[var(--torii-red)]">{formatJPY(totalJPY)}</span>
      </div>

      <Button
        type="button"
        className="w-full"
        disabled={itemCount === 0 || step !== 3}
        onClick={onConfirmPay}
      >
        確認結緣並支付
      </Button>
    </div>
  );
}
