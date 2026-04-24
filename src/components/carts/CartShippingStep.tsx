"use client";

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
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            收件人全名
          </label>
          <input
            type="text"
            className="w-full border border-gray-100 bg-white px-4 py-3 outline-none transition focus:border-[var(--torii-red)]"
            placeholder="例如：佐藤 健"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            聯絡電話
          </label>
          <input
            type="tel"
            className="w-full border border-gray-100 bg-white px-4 py-3 outline-none transition focus:border-[var(--torii-red)]"
            placeholder="0912-345-678"
            value={tel}
            onChange={(e) => onTelChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            電子郵件
          </label>
          <input
            type="email"
            className="w-full border border-gray-100 bg-white px-4 py-3 outline-none transition focus:border-[var(--torii-red)]"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />
        </div>
        <div className="col-span-2 space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            詳細寄送地址
          </label>
          <textarea
            className="h-32 w-full border border-gray-100 bg-white px-4 py-3 outline-none transition focus:border-[var(--torii-red)]"
            placeholder="請輸入完整的收件地址..."
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
          />
        </div>
      </form>
    </section>
  );
}
