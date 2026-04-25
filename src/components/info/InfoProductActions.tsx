"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useClientCarts";
import SuccessModal from "@/components/common/SuccessModal";
import ErrorModal from "@/components/common/ErrorModal";

type Props = {
  productId: string;
  category: string;
  title: string;
  content: string;
  price: number;
  imageUrl: string;
  stock: number;
  description?: string;
  unit?: string;
};

export default function InfoProductActions({
  productId,
  category,
  title,
  content,
  price,
  imageUrl,
  stock,
  description,
  unit,
}: Props) {
  const { addItem } = useCart();
  const maxBuy = Math.max(0, stock);
  const [qty, setQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => (maxBuy > 0 ? Math.min(maxBuy, q + 1) : q));

  const handleAdd = async () => {
    if (maxBuy <= 0) return;
    if (isAdding) return;
    setIsAdding(true);
    try {
      await addItem({
        id: productId,
        category,
        title,
        content,
        price,
        imageUrl,
        qty,
        maxStock: maxBuy,
        description: description?.trim() || undefined,
        unit: unit?.trim() || undefined,
      });

      setIsSuccessOpen(true);
    } catch (err) {
      setIsErrorOpen(true);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="pt-8">
      <div className="mb-8 flex flex-wrap items-center gap-6">
        <div className="flex items-center rounded-sm border border-gray-200">
          <button
            type="button"
            className="px-4 py-2 transition hover:bg-gray-100 disabled:opacity-40"
            disabled={maxBuy <= 0 || qty <= 1}
            onClick={dec}
            aria-label="減少數量"
          >
            <Minus className="h-6 w-6 cursor-pointer" />
          </button>
          <span className="min-w-[3rem] border-x border-gray-200 px-6 py-2 text-center tabular-nums">
            {qty}
          </span>
          <button
            type="button"
            className="px-4 py-2 transition hover:bg-gray-100 disabled:opacity-40"
            disabled={maxBuy <= 0 || qty >= maxBuy}
            onClick={inc}
            aria-label="增加數量"
          >
            <Plus className="h-6 w-6 cursor-pointer" />
          </button>
        </div>
        <p className="italic text-gray-400">
          {maxBuy <= 0 ? "目前無庫存" : `庫存僅剩 ${maxBuy} 枚`}
        </p>
      </div>
      <Button
        className="w-full"
        disabled={maxBuy <= 0 || isAdding}
        type="button"
        onClick={handleAdd}
      >
        {isAdding ? "加入中…" : "加入購物車"}
      </Button>

      <SuccessModal open={isSuccessOpen} title="已加入" onConfirm={() => setIsSuccessOpen(false)} />
      <ErrorModal
        open={isErrorOpen}
        title="失敗"
        onClose={() => setIsErrorOpen(false)}
      />
    </div>
  );
}
