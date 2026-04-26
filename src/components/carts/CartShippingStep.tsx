"use client";

import type React from "react";
import type { CartItem } from "./types";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type Props = {
  items: CartItem[];
  name: string;
  tel: string;
  email: string;
  address: string;
  message: string;
  onNameChange: (v: string) => void;
  onTelChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onAddressChange: (v: string) => void;
  onMessageChange: (v: string) => void;
  formRef?: React.RefObject<HTMLFormElement | null>;
};

export default function CartShippingStep({
  items,
  name,
  tel,
  email,
  address,
  message,
  onNameChange,
  onTelChange,
  onEmailChange,
  onAddressChange,
  onMessageChange,
  formRef,
}: Props) {
  return (
    <section>
      <h2 className="mb-8 font-serif text-2xl font-bold">寄送資訊</h2>

      {items.length > 0 ? (
        <div className="mb-10 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold  tracking-widest text-black/">
            訂購明細（來自商品頁）
          </h3>
          <ul className="space-y-4 text-sm">
            {items.map((line) => (
              <li
                key={line.id}
                className="flex flex-col gap-1 border-b border-black/5 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="font-semibold">{line.title}</div>
                  <div className="flex items-center gap-4">
                    <div className="tabular-nums text-black/70">
                      單數：{line.price}元 × {line.qty}{" "}
                    </div>
                    <div className="font-medium text-[var(--torii-red)]">
                      總數:{line.price * line.qty}元
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <form ref={formRef} className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label className="text-lg font-bold  tracking-widest ">
            收件人全名<span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            required
            placeholder="例如：佐藤 健"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-lg font-bold  tracking-widest ">
            聯絡電話<span className="text-red-500">*</span>
          </label>
          <Input
            type="tel"
            required
            placeholder="0912-345-678"
            value={tel}
            onChange={(e) => onTelChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-lg font-bold  tracking-widest ">
            電子郵件<span className="text-red-500">*</span>
          </label>
          <Input
            type="email"
            required
            placeholder="email@example.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-lg font-bold  tracking-widest ">
            寄送地址<span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            required
            placeholder="請輸入完整的收件地址..."
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-lg font-bold  tracking-widest ">備註內容</label>
          <Textarea
            placeholder="請輸入備註內容（會一併送至訂單留言）…"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
          />
        </div>
      </form>
    </section>
  );
}
