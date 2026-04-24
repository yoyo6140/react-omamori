"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CartItem } from "./types";
import { formatJPY } from "./format-jpy";

const MAX_QTY = 99;

type Props = {
  items: CartItem[];
  onRemoveItem: (id: string) => void | Promise<void>;
  onQuantityChange: (id: string, quantity: number) => void | Promise<void>;
};

export default function CartWishlistStep({ items, onRemoveItem, onQuantityChange }: Props) {
  return (
    <section>
      <h2 className="mb-8 font-serif text-2xl font-bold">願望清單</h2>
      <div className="space-y-6">
        {items.length === 0 ? (
          <div className="text-sm text-black/60">
            目前沒有商品。你可以回到{" "}
            <Link href="/home" className="text-[var(--torii-red)] underline underline-offset-4">
              首頁
            </Link>
            繼續挑選。
          </div>
        ) : (
          <div className="min-w-0 overflow-x-auto overflow-y-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
            <Table className="max-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[220px] text-center font-bold text-black">
                    商品
                  </TableHead>
                  <TableHead className="w-24 text-center font-bold text-black">單價</TableHead>
                  <TableHead className="w-28 text-center font-bold text-black">小計</TableHead>
                  <TableHead className="w-40 text-center font-bold text-black">數量</TableHead>
                  <TableHead className="w-20 text-center font-bold text-black">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((p) => {
                  const lineTotal = p.price * p.qty;
                  return (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="flex items-center justify-center gap-4">
                          {p.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.imageUrl}
                              alt=""
                              className="h-14 w-14 shrink-0 rounded-md object-cover"
                            />
                          ) : null}
                          <div className="min-w-0">
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[var(--torii-red)]">
                              {p.category}
                            </p>
                            <p className="font-bold leading-snug">{p.title}</p>
                            <p className="mt-0.5 text-xs italic text-gray-400">內容：{p.content}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-medium tabular-nums">
                        {formatJPY(p.price)}
                      </TableCell>
                      <TableCell className="text-center font-bold tabular-nums">
                        {formatJPY(lineTotal)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 shrink-0 p-0 text-base leading-none"
                            aria-label="減少數量"
                            onClick={() =>
                              p.qty <= 1
                                ? onRemoveItem(p.id)
                                : onQuantityChange(p.id, p.qty - 1)
                            }
                          >
                            −
                          </Button>
                          <span className="min-w-[2rem] text-center font-semibold tabular-nums">
                            {p.qty}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 shrink-0 p-0 text-base leading-none"
                            disabled={p.qty >= MAX_QTY}
                            aria-label="增加數量"
                            onClick={() =>
                              onQuantityChange(p.id, Math.min(MAX_QTY, p.qty + 1))
                            }
                          >
                            +
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          type="button"
                          className="text-[10px] uppercase tracking-widest text-gray-400 transition hover:text-red-500"
                          onClick={() => onRemoveItem(p.id)}
                        >
                          移除
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </section>
  );
}
