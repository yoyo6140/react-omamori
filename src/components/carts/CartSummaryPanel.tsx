"use client";

import { CreditCard, Landmark, Wallet } from "lucide-react";
import type { CartStep } from "./types";
import { Button } from "../ui/button";
type Props = {
  step: CartStep;
  itemCount: number;
  subtotalJPY: number;
  shippingJPY: number;
  feeJPY: number;
  totalJPY: number;
  isSubmitting?: boolean;
  onConfirmPay: () => void | Promise<void>;
};

export default function CartSummaryPanel({
  step,
  itemCount,
  subtotalJPY,
  shippingJPY,
  feeJPY,
  totalJPY,
  isSubmitting = false,
  onConfirmPay,
}: Props) {
  return (
    <div className="sticky top-32 border border-gray-50 bg-white p-8 shadow-sm">
      <h3 className="mb-8 font-serif text-xl font-semibold">結帳總計</h3>
      <div className="mb-8 space-y-4 ">
        <div className="flex justify-between">
          <span className="text-lg">商品小計</span>
          <span>{subtotalJPY}元</span>
        </div>
      </div>
      <div className="mb-12 flex items-end justify-between border-t border-gray-100 pt-8">
        <span className="font-bold">總計</span>
        <span className="text-3xl font-bold text-[var(--torii-red)]">{totalJPY}元</span>
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
