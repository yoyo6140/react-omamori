"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import {
  CartOrderReceiptDialog,
  CartPaymentConfirmDialog,
  CartShippingStep,
  CartStepTabs,
  CartSummaryPanel,
  CartWishlistStep,
  formatJPY,
  type CartStep,
} from "@/components/carts";
import { Button } from "@/components/ui/button";
import {
  createCustomerOrder,
  payCustomerOrder,
  syncCheckoutCartToServer,
  useCart,
} from "@/hooks/useClientCarts";

export default function CartsPage() {
  const router = useRouter();
  const { items, removeItem, setLineQuantity, syncError, clearSyncError, clearCart } = useCart();
  const [step, setStep] = useState<CartStep>(1);

  const shippingJPY = 800;
  const feeJPY = 0;
  const subtotalJPY = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items]);
  const cartUnitCount = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);
  const totalJPY = subtotalJPY + (items.length > 0 ? shippingJPY : 0) + feeJPY;

  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [payDialogOrderId, setPayDialogOrderId] = useState<string | null>(null);
  const [paySubmitting, setPaySubmitting] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [receiptOrderId, setReceiptOrderId] = useState<string | null>(null);

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

      <main className=" mx-auto max-w-4xl px-16 py-16">
        <CartStepTabs
          step={step}
          onStepChange={setStep}
          canGoNextFrom1={canGoNextFrom1}
          canGoNextFrom2={canGoNextFrom2}
        />
        {syncError ? (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            <span>{syncError}</span>
            <button
              type="button"
              className="ml-3 underline underline-offset-2"
              onClick={clearSyncError}
            >
              關閉
            </button>
          </div>
        ) : null}
        {orderError ? (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            <span>{orderError}</span>
            <button
              type="button"
              className="ml-3 underline underline-offset-2"
              onClick={() => setOrderError(null)}
            >
              關閉
            </button>
          </div>
        ) : null}
        {/* 步驟一訂單確認 */}
        <div className=" mt-12 space-y-12">
          {step === 1 && (
            <CartWishlistStep
              items={items}
              onRemoveItem={removeItem}
              onQuantityChange={setLineQuantity}
            />
          )}

          {/* 步驟二聯絡資料 */}
          {step === 2 && (
            <CartShippingStep
              items={items}
              name={name}
              tel={tel}
              email={email}
              address={address}
              message={message}
              onNameChange={setName}
              onTelChange={setTel}
              onEmailChange={setEmail}
              onAddressChange={setAddress}
              onMessageChange={setMessage}
            />
          )}

          {/* 步驟三總金額 */}
          {step === 3 && (
            <CartSummaryPanel
              step={step}
              itemCount={cartUnitCount}
              subtotalJPY={subtotalJPY}
              shippingJPY={shippingJPY}
              feeJPY={feeJPY}
              totalJPY={totalJPY}
              isSubmitting={orderSubmitting}
              onConfirmPay={async () => {
                setOrderError(null);
                setOrderSubmitting(true);
                try {
                  await syncCheckoutCartToServer(
                    items.map((i) => ({ product_id: i.id, qty: i.qty })),
                  );
                  const orderId = await createCustomerOrder({
                    data: {
                      user: {
                        name: name.trim(),
                        email: email.trim(),
                        tel: tel.trim(),
                        address: address.trim(),
                      },
                      message: message.trim() || "拾守官網結帳",
                    },
                  });
                  setPayError(null);
                  setPayDialogOrderId(orderId);
                } catch (e) {
                  setOrderError(e instanceof Error ? e.message : "訂單處理失敗");
                } finally {
                  setOrderSubmitting(false);
                }
              }}
            />
          )}

          {payDialogOrderId ? (
            <CartPaymentConfirmDialog
              orderId={payDialogOrderId}
              totalFormatted={formatJPY(totalJPY)}
              isPaying={paySubmitting}
              payError={payError}
              onCancel={() => {
                if (paySubmitting) return;
                const id = payDialogOrderId;
                setPayDialogOrderId(null);
                setPayError(null);
                if (id) {
                  clearCart();
                  setReceiptOrderId(id);
                }
              }}
              onConfirmPay={async () => {
                if (!payDialogOrderId) return;
                setPayError(null);
                setPaySubmitting(true);
                try {
                  const paidId = payDialogOrderId;
                  await payCustomerOrder(paidId);
                  clearCart();
                  setPayDialogOrderId(null);
                  setReceiptOrderId(paidId);
                } catch (e) {
                  setPayError(e instanceof Error ? e.message : "付款失敗");
                } finally {
                  setPaySubmitting(false);
                }
              }}
            />
          ) : null}

          {receiptOrderId ? (
            <CartOrderReceiptDialog
              orderId={receiptOrderId}
              onClose={() => {
                setReceiptOrderId(null);
                router.push("/home");
              }}
            />
          ) : null}

          <div className="flex items-center justify-between pt-2 gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={isPrevDisabled}
              onClick={() => handleStepDelta(-1)}
            >
              上一步
            </Button>
            {step < 3 ? (
              <Button
                type="button"
                className="w-full"
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
