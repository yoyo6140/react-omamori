"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useClientCarts";

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
  const router = useRouter();
  const { addItem } = useCart();
  const maxBuy = Math.max(0, stock);
  const [qty, setQty] = useState(1);

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => (maxBuy > 0 ? Math.min(maxBuy, q + 1) : q));

  const handleAdd = async () => {
    if (maxBuy <= 0) return;
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
      <Button className="w-full" disabled={maxBuy <= 0} type="button" onClick={handleAdd}>
        加入購物車
      </Button>
    </div>
  );
}
