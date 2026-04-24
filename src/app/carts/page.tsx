"use client";

import React, { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  CartShippingStep,
  CartStepTabs,
  CartSummaryPanel,
  CartWishlistStep,
  type CartItem,
  type CartStep,
} from "@/components/carts";
import { Button } from "@/components/ui/button";

export default function CartsPage() {
  const [step, setStep] = useState<CartStep>(1);
  const [items, setItems] = useState<CartItem[]>([
    {
      id: "kansai-2",
      shrine: "湊川神社",
      title: "正成公勝利守",
      priceJPY: 1200,
      quantity: 1,
      imageUrl: "/images/kansai-2.jpg",
      usage: "學業必勝",
    },
  ]);

  const shippingJPY = 800;
  const feeJPY = 0;
  const subtotalJPY = useMemo(
    () => items.reduce((sum, i) => sum + i.priceJPY * i.quantity, 0),
    [items],
  );
  const cartUnitCount = useMemo(() => items.reduce((n, i) => n + i.quantity, 0), [items]);
  const totalJPY = subtotalJPY + (items.length > 0 ? shippingJPY : 0) + feeJPY;

  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const canGoNextFrom1 = items.length > 0;
  const canGoNextFrom2 =
    name.trim() !== "" && tel.trim() !== "" && email.trim() !== "" && address.trim() !== "";

  const isPrevDisabled = step === 1;
  const isNextDisabled =
    step === 3 || (step === 1 && !canGoNextFrom1) || (step === 2 && !canGoNextFrom2);

  // 處理步驟切換
  const handleStepDelta = (delta: -1 | 1) => {
    setStep((s) => {
      const target = s + delta;
      if (target < 1 || target > 3) return s;
      if (delta === 1 && s === 1 && !canGoNextFrom1) return s;
      if (delta === 1 && s === 2 && !canGoNextFrom2) return s;
      return target as CartStep;
    });
  };

  return (
    <div className="min-h-screen bg-[var(--off-white)] text-[var(--sumi-black)]">
      <Navbar />

      <main className=" max-w-4xl px-8 py-16">
        <CartStepTabs
          step={step}
          onStepChange={setStep}
          canGoNextFrom1={canGoNextFrom1}
          canGoNextFrom2={canGoNextFrom2}
        />

        {/* 💡 【修正重點 2】簡化結構：1 是訂單，2 是聯絡資料，3 是總金額 */}
        <div className="mt-12 space-y-12">
          {step === 1 && (
            <CartWishlistStep
              items={items}
              onRemoveItem={(id) => setItems((prev) => prev.filter((x) => x.id !== id))}
              onQuantityChange={(id, quantity) =>
                setItems((prev) =>
                  prev.map((x) => (x.id === id ? { ...x, quantity: Math.max(1, quantity) } : x)),
                )
              }
            />
          )}

          {step === 2 && (
            <CartShippingStep
              name={name}
              tel={tel}
              email={email}
              address={address}
              onNameChange={setName}
              onTelChange={setTel}
              onEmailChange={setEmail}
              onAddressChange={setAddress}
            />
          )}

          {step === 3 && (
            <CartSummaryPanel
              step={step}
              itemCount={cartUnitCount}
              subtotalJPY={subtotalJPY}
              shippingJPY={shippingJPY}
              feeJPY={feeJPY}
              totalJPY={totalJPY}
              onConfirmPay={() => {
                // 處理付款邏輯
                console.log("送出訂單");
              }}
            />
          )}

          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="ghost"
              className="text-xs uppercase tracking-widest text-gray-400 hover:text-[var(--torii-red)]"
              disabled={isPrevDisabled}
              onClick={() => handleStepDelta(-1)}
            >
              上一步
            </Button>
            {step < 3 ? (
              <Button
                type="button"
                className="px-6 text-xs font-bold uppercase tracking-[0.2em]"
                disabled={isNextDisabled}
                onClick={() => handleStepDelta(1)}
              >
                下一步
              </Button>
            ) : null}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
