"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import OrderQueryResult from "@/components/orders/OrderQueryResult";
import {
  fetchCustomerOrder,
  payCustomerOrder,
  type CustomerOrderDetail,
} from "@/hooks/useClientCarts";

function CheckOrderContent() {
  const searchParams = useSearchParams();
  const idFromUrl = searchParams.get("id") ?? "";

  const [orderIdInput, setOrderIdInput] = useState("");
  const [resolvedOrderId, setResolvedOrderId] = useState<string | null>(null);
  const [detail, setDetail] = useState<CustomerOrderDetail | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const runLookup = useCallback(async (rawId: string) => {
    const id = rawId.trim();
    if (!id) {
      setLookupError("請輸入訂單編號");
      return;
    }
    setLookupError(null);
    setPayError(null);
    setLookupLoading(true);
    try {
      const d = await fetchCustomerOrder(id);
      setDetail(d);
      setResolvedOrderId(d.id ?? id);
      setOrderIdInput(id);
    } catch (e) {
      setDetail(null);
      setResolvedOrderId(null);
      setLookupError(e instanceof Error ? e.message : "查詢失敗");
    } finally {
      setLookupLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = idFromUrl.trim();
    if (!id) return;
    void runLookup(id);
  }, [idFromUrl, runLookup]);

  const handlePay = async () => {
    const id = resolvedOrderId ?? orderIdInput.trim();
    if (!id) return;
    setPayLoading(true);
    setPayError(null);
    try {
      await payCustomerOrder(id);
      const d = await fetchCustomerOrder(id);
      setDetail(d);
      setResolvedOrderId(d.id ?? id);
    } catch (e) {
      setPayError(e instanceof Error ? e.message : "付款失敗");
    } finally {
      setPayLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--off-white)] text-[var(--sumi-black)]">
      <Navbar />

      <main className="mx-auto max-w-2xl px-6 pb-24 pt-28 md:px-8 md:pt-32">
        <h1 className="font-serif text-3xl font-bold">訂單查詢</h1>
        <p className="mt-2 text-sm text-black/60">
          請輸入結帳完成後取得的訂單編號，即可查看付款狀態；若尚未付款，可於此補付款。
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1 space-y-2">
            <label
              htmlFor="order-id"
              className="text-xs font-bold uppercase tracking-widest text-black/50"
            >
              訂單編號
            </label>
            <Input
              id="order-id"
              placeholder="例如：-L9tH8jxVb2Ka_DYPwng"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void runLookup(orderIdInput);
              }}
              className="font-mono text-sm"
            />
          </div>
          <Button
            type="button"
            className="w-full sm:w-auto shrink-0"
            disabled={lookupLoading}
            onClick={() => void runLookup(orderIdInput)}
          >
            {lookupLoading ? "查詢中…" : "查詢"}
          </Button>
        </div>

        {lookupError ? (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {lookupError}
          </div>
        ) : null}

        {detail && resolvedOrderId ? (
          <div className="mt-10">
            <OrderQueryResult
              detail={detail}
              apiOrderId={resolvedOrderId}
              onPay={detail.is_paid === true ? undefined : handlePay}
              payLoading={payLoading}
              payError={payError}
            />
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}

export default function CheckPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--off-white)] text-sm text-black/60">
          載入中…
        </div>
      }
    >
      <CheckOrderContent />
    </Suspense>
  );
}
