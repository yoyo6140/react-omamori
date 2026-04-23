/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ConfirmModal from "@/components/common/ConfirmModal";
import SuccessModal from "@/components/common/SuccessModal";
import ErrorModal from "@/components/common/ErrorModal";
import { AdminCoupon, useAdminCoupons } from "@/hooks/useAdminCoupons";

type CouponForm = Omit<AdminCoupon, "id">;

function toDateInputValue(unixSeconds: number) {
  const d = new Date(unixSeconds * 1000);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function fromDateInputValue(v: string) {
  // date input: YYYY-MM-DD (local)
  const d = new Date(`${v}T00:00:00`);
  return Math.floor(d.getTime() / 1000);
}

export function AddCouponModal({
  open,
  onClose,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl rounded-2xl bg-white shadow-xl border border-black/10 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold">新增優惠券</div>
          <Button variant="outline" size="sm" onClick={onClose}>
            關閉
          </Button>
        </div>
        <div className="mt-4 max-h-[70vh] overflow-auto">
          <AddCoupon onCancel={onClose} onSaved={onSaved} />
        </div>
      </div>
    </div>
  );
}

export default function AddCoupon({
  onCancel,
  onSaved,
}: {
  onCancel?: () => void;
  onSaved?: () => void;
}) {
  const { addCoupon } = useAdminCoupons();
  const formRef = useRef<HTMLFormElement | null>(null);

  const now = Math.floor(Date.now() / 1000);
  const [form, setForm] = useState<CouponForm>({
    title: "",
    code: "",
    percent: 10,
    due_date: now,
    is_enabled: 1,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  async function handleSubmit() {
    setIsSaving(true);
    try {
      await addCoupon(form);
      setIsSuccessOpen(true);
    } catch {
      setIsErrorOpen(true);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-2">
      <Card>
        <CardContent>
          <form
            ref={formRef}
            onSubmit={async (e) => {
              e.preventDefault();
              await handleSubmit();
            }}
          >
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-2">
                <Switch
                  id="coupon-enabled"
                  checked={form.is_enabled === 1}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, is_enabled: checked ? 1 : 0 }))
                  }
                />
                <Label htmlFor="coupon-enabled" className="text-xs text-black/60">
                  {form.is_enabled === 1 ? "啟用" : "停用"}
                </Label>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="font-bold text-black">標題</Label>
                <Input
                  required
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-black">優惠碼</Label>
                <Input
                  required
                  value={form.code}
                  onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-black">折扣（%）</Label>
                <Input
                  type="number"
                  required
                  min={1}
                  max={100}
                  value={String(form.percent)}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, percent: Number(e.target.value) }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-black">到期日</Label>
                <Input
                  type="date"
                  required
                  value={toDateInputValue(form.due_date)}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, due_date: fromDateInputValue(e.target.value) }))
                  }
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2">
              <Button type="button" variant="outline" onClick={() => onCancel?.()}>
                取消
              </Button>
              <Button
                type="button"
                onClick={() => {
                  const ok = formRef.current?.reportValidity() ?? true;
                  if (!ok) return;
                  setIsConfirmOpen(true);
                }}
              >
                送出
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <ConfirmModal
        open={isConfirmOpen}
        title="確認送出"
        description="確定要送出這次的新增內容嗎？"
        cancelText="取消"
        confirmText="確認送出"
        disabled={isSaving}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsConfirmOpen(false);
          formRef.current?.requestSubmit();
        }}
      />

      <SuccessModal
        open={isSuccessOpen}
        title="新增成功"
        onConfirm={() => {
          setIsSuccessOpen(false);
          onSaved?.();
        }}
      />

      <ErrorModal
        open={isErrorOpen}
        title="新增失敗"
        description="新增失敗，請稍後再試。"
        onClose={() => setIsErrorOpen(false)}
      />
    </div>
  );
}

