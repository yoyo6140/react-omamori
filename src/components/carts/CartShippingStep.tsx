"use client";

import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type Props = {
  name: string;
  tel: string;
  email: string;
  address: string;
  onNameChange: (v: string) => void;
  onTelChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onAddressChange: (v: string) => void;
};

export default function CartShippingStep({
  name,
  tel,
  email,
  address,
  onNameChange,
  onTelChange,
  onEmailChange,
  onAddressChange,
}: Props) {
  return (
    <section>
      <h2 className="mb-8 font-serif text-2xl font-bold">寄送資訊</h2>
      <form className="grid grid-cols-2 gap-6">
        <div className="col-span-2 space-y-2">
          <label className="text-lg font-bold uppercase tracking-widest ">
            收件人全名<span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            placeholder="例如：佐藤 健"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-lg font-bold uppercase tracking-widest ">
            聯絡電話<span className="text-red-500">*</span>
          </label>
          <Input
            type="tel"
            placeholder="0912-345-678"
            value={tel}
            onChange={(e) => onTelChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-lg font-bold uppercase tracking-widest ">
            電子郵件<span className="text-red-500">*</span>
          </label>
          <Input
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />
        </div>
        <div className="col-span-2 space-y-2">
          <label className="text-lg font-bold uppercase tracking-widest ">
            寄送地址<span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            placeholder="請輸入完整的收件地址..."
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
          />
        </div>
        <div className="col-span-2 space-y-2">
          <label className="text-lg font-bold uppercase tracking-widest ">備註內容</label>
          <Textarea placeholder="請輸入備註內容..." />
        </div>
      </form>
    </section>
  );
}
