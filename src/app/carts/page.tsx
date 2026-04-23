"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CreditCard, Landmark, Wallet } from "lucide-react";

type CartItem = {
  id: string;
  shrine: string;
  title: string;
  usage: string;
  priceJPY: number;
  imageUrl: string;
};

function formatJPY(n: number) {
  return `¥${n.toLocaleString("ja-JP")}`;
}

export default function CartsPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  // 靜態假資料（先不跟後端連動）
  const [items, setItems] = useState<CartItem[]>([
    {
      id: "kansai-2",
      shrine: "湊川神社",
      title: "正成公勝利守",
      usage: "學業必勝",
      priceJPY: 1200,
      imageUrl: "https://images.unsplash.com/photo-1571404170131-7e8c0e664b30?q=80&w=200&auto=format&fit=crop",
    },
  ]);

  const shippingJPY = 800;
  const feeJPY = 0;
  const subtotalJPY = useMemo(() => items.reduce((sum, i) => sum + i.priceJPY, 0), [items]);
  const totalJPY = subtotalJPY + (items.length > 0 ? shippingJPY : 0) + feeJPY;

  // 假表單狀態（只做 UI）
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const canGoNextFrom1 = items.length > 0;
  const canGoNextFrom2 =
    name.trim() !== "" && tel.trim() !== "" && email.trim() !== "" && address.trim() !== "";

  return (
    <div className="min-h-screen bg-[var(--off-white)] text-[var(--sumi-black)]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-8 py-16">
        <div className="flex justify-center space-x-20 mb-16 text-xs font-bold tracking-[0.2em] uppercase text-gray-300">
          <button
            type="button"
            className={[
              "pb-4 px-2",
              step === 1 ? "text-[var(--torii-red)] border-b-2 border-b-[var(--torii-red)]" : "",
            ].join(" ")}
            onClick={() => setStep(1)}
          >
            01 願望籃
          </button>
          <button
            type="button"
            className={[
              "pb-4 px-2",
              step === 2 ? "text-[var(--torii-red)] border-b-2 border-b-[var(--torii-red)]" : "",
            ].join(" ")}
            onClick={() => {
              if (!canGoNextFrom1) return;
              setStep(2);
            }}
          >
            02 寄送資訊
          </button>
          <button
            type="button"
            className={[
              "pb-4 px-2",
              step === 3 ? "text-[var(--torii-red)] border-b-2 border-b-[var(--torii-red)]" : "",
            ].join(" ")}
            onClick={() => {
              if (!canGoNextFrom1 || !canGoNextFrom2) return;
              setStep(3);
            }}
          >
            03 結帳
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            {step === 1 ? (
              <section>
                <h2 className="text-2xl font-bold mb-8 font-serif">願望清單</h2>
                <div className="space-y-6">
                  {items.length === 0 ? (
                    <div className="text-sm text-black/60">
                      目前沒有商品。你可以回到{" "}
                      <Link
                        href="/home"
                        className="text-[var(--torii-red)] underline underline-offset-4"
                      >
                        首頁
                      </Link>{" "}
                      繼續挑選。
                    </div>
                  ) : (
                    items.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center space-x-6 pb-6 border-b border-gray-100"
                      >
                        <div className="w-24 h-32 bg-gray-50 flex-shrink-0 overflow-hidden">
                          <img
                            src={p.imageUrl}
                            className="w-full h-full object-cover"
                            alt={p.title}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] text-[var(--torii-red)] font-bold tracking-widest uppercase mb-1">
                            {p.shrine}
                          </p>
                          <h3 className="text-lg font-bold">{p.title}</h3>
                          <p className="text-xs text-gray-400 mt-1 italic">用途：{p.usage}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatJPY(p.priceJPY)}</p>
                          <button
                            type="button"
                            className="text-[10px] text-gray-300 hover:text-red-500 transition mt-2 uppercase tracking-widest"
                            onClick={() => setItems((prev) => prev.filter((x) => x.id !== p.id))}
                          >
                            移除
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            ) : null}

            {step === 2 ? (
              <section>
                <h2 className="text-2xl font-bold mb-8 font-serif">寄送資訊</h2>
                <form className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      收件人全名
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white border border-gray-100 focus:border-[var(--torii-red)] outline-none transition"
                      placeholder="例如：佐藤 健"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      聯絡電話
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 bg-white border border-gray-100 focus:border-[var(--torii-red)] outline-none transition"
                      placeholder="0912-345-678"
                      value={tel}
                      onChange={(e) => setTel(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      電子郵件
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-white border border-gray-100 focus:border-[var(--torii-red)] outline-none transition"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      詳細寄送地址
                    </label>
                    <textarea
                      className="w-full px-4 py-3 bg-white border border-gray-100 focus:border-[var(--torii-red)] outline-none transition h-32"
                      placeholder="請輸入完整的收件地址..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </form>
              </section>
            ) : null}

            {step === 3 ? (
              <section>
                <h2 className="text-2xl font-bold mb-2 font-serif">結帳</h2>
                <p className="mb-8 text-sm text-black/60">請確認寄送資訊與願望清單後，於右側完成付款。</p>

                <div className="space-y-6">
                  <div className="rounded-lg bg-white border border-gray-100 p-6">
                    <div className="text-sm font-bold mb-4">寄送資訊確認</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-black/70">
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                          收件人
                        </div>
                        <div>{name || "-"}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                          聯絡電話
                        </div>
                        <div>{tel || "-"}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                          Email
                        </div>
                        <div className="break-all">{email || "-"}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                          地址
                        </div>
                        <div className="break-words">{address || "-"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-white border border-gray-100 p-6">
                    <div className="text-sm font-bold mb-4">願望清單確認</div>
                    <div className="space-y-4">
                      {items.map((p) => (
                        <div key={p.id} className="flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <div className="text-[10px] text-[var(--torii-red)] font-bold tracking-widest uppercase">
                              {p.shrine}
                            </div>
                            <div className="font-semibold truncate">{p.title}</div>
                            <div className="text-xs text-gray-400 italic">用途：{p.usage}</div>
                          </div>
                          <div className="font-bold">{formatJPY(p.priceJPY)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ) : null}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                className="text-xs tracking-widest uppercase text-gray-400 hover:text-[var(--torii-red)] transition disabled:opacity-50"
                disabled={step === 1}
                onClick={() => setStep((s) => (s === 1 ? 1 : ((s - 1) as 1 | 2 | 3)))}
              >
                上一步
              </button>

              {step < 3 ? (
                <button
                  type="button"
                  className="px-6 py-3 bg-[var(--torii-red)] text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-opacity-90 transition disabled:opacity-50"
                  disabled={step === 1 ? !canGoNextFrom1 : !canGoNextFrom2}
                  onClick={() => setStep((s) => (s === 3 ? 3 : ((s + 1) as 1 | 2 | 3)))}
                >
                  下一步
                </button>
              ) : null}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-8 shadow-sm border border-gray-50 sticky top-32">
              <h3 className="text-xl font-bold mb-8 font-serif">結帳總計</h3>
              <div className="space-y-4 text-sm mb-8">
                <div className="flex justify-between">
                  <span className="text-gray-400">商品小計</span>
                  <span>{formatJPY(subtotalJPY)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">日本直送運費</span>
                  <span>{items.length > 0 ? formatJPY(shippingJPY) : formatJPY(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">手續費</span>
                  <span>{formatJPY(feeJPY)}</span>
                </div>
              </div>
              <div className="pt-8 border-t border-gray-100 flex justify-between items-end mb-12">
                <span className="font-bold">總計</span>
                <span className="text-3xl font-bold text-[var(--torii-red)]">{formatJPY(totalJPY)}</span>
              </div>

              <button
                type="button"
                className="w-full py-5 bg-[var(--torii-red)] text-white text-xs font-bold tracking-[0.2em] uppercase hover:shadow-2xl transition-all duration-500 disabled:opacity-50"
                disabled={items.length === 0 || step !== 3}
                onClick={() => {
                  // 目前先不做連動：保留 UI
                }}
              >
                確認結緣並支付
              </button>

              <div className="mt-8 flex items-center justify-center space-x-4 opacity-30">
                <CreditCard className="w-5 h-5" />
                <Landmark className="w-5 h-5" />
                <Wallet className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 text-center text-[10px] text-gray-300 uppercase tracking-widest bg-transparent">
        Secure Checkout • Omamori Connect SSL
      </footer>

      <Footer />
    </div>
  );
}

