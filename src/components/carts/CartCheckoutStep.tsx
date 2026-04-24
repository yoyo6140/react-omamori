"use client";

import type { CartItem } from "./types";
import { formatJPY } from "./format-jpy";

type Props = {
  items: CartItem[];
  name: string;
  tel: string;
  email: string;
  address: string;
};

export default function CartCheckoutStep({ items, name, tel, email, address }: Props) {
  return (
    <section>
      <h2 className="mb-2 font-serif text-2xl font-bold">結帳</h2>
      <p className="mb-8 text-sm text-black/60">請確認寄送資訊與願望清單後，於右側完成付款。</p>

      <div className="space-y-6">
        <div className="rounded-lg border border-gray-100 bg-white p-6">
          <div className="mb-4 text-sm font-bold">寄送資訊確認</div>
          <div className="grid grid-cols-1 gap-4 text-sm text-black/70 md:grid-cols-2">
            <div>
              <div className="mb-1 text-[10px] uppercase tracking-widest text-gray-400">收件人</div>
              <div>{name || "-"}</div>
            </div>
            <div>
              <div className="mb-1 text-[10px] uppercase tracking-widest text-gray-400">聯絡電話</div>
              <div>{tel || "-"}</div>
            </div>
            <div>
              <div className="mb-1 text-[10px] uppercase tracking-widest text-gray-400">Email</div>
              <div className="break-all">{email || "-"}</div>
            </div>
            <div>
              <div className="mb-1 text-[10px] uppercase tracking-widest text-gray-400">地址</div>
              <div className="break-words">{address || "-"}</div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-100 bg-white p-6">
          <div className="mb-4 text-sm font-bold">願望清單確認</div>
          <div className="space-y-4">
            {items.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--torii-red)]">
                    {p.shrine}
                  </div>
                  <div className="truncate font-semibold">{p.title}</div>
                  <div className="text-xs italic text-gray-400">用途：{p.usage}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{formatJPY(p.priceJPY * p.quantity)}</div>
                  <div className="text-xs text-gray-400">
                    {formatJPY(p.priceJPY)} × {p.quantity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
