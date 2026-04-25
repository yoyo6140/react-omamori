/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ConfirmModal from "@/components/common/ConfirmModal";
import SuccessModal from "@/components/common/SuccessModal";
import ErrorModal from "@/components/common/ErrorModal";
import { AdminOrder, useAdminOrders } from "@/hooks/useAdminOrders";

export function EditOrderModal({
  open,
  order,
  onClose,
  onSaved,
}: {
  open: boolean;
  order: AdminOrder | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  if (!open || !order) return null;

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
          <div className="text-lg font-bold">編輯訂單</div>
          <Button variant="outline" size="sm" onClick={onClose}>
            關閉
          </Button>
        </div>
        <div className="mt-4 max-h-[70vh] overflow-auto">
          <EditOrder
            order={order}
            onCancel={onClose}
            onSaved={() => {
              onSaved();
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function EditOrder({
  order,
  onCancel,
  onSaved,
}: {
  order: AdminOrder;
  onCancel?: () => void;
  onSaved?: (updated: AdminOrder) => void;
}) {
  const { editOrder } = useAdminOrders();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [form, setForm] = useState<AdminOrder>(order);
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  useEffect(() => setForm(order), [order]);

  async function handleSubmit() {
    setIsSaving(true);
    try {
      const payload: Partial<AdminOrder> = {
        create_at: form.create_at,
        is_paid: Boolean(form.is_paid),
        message: form.message,
        products: form.products,
        user: form.user,
        num: form.num,
      };

      const updated = await editOrder(order.id, payload);
      setForm(updated ?? form);
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
                  id="order-paid"
                  checked={Boolean(form.is_paid)}
                  onCheckedChange={(checked) => setForm((prev) => ({ ...prev, is_paid: checked }))}
                />
                <Label htmlFor="order-paid" className="text-xs text-black/60">
                  {form.is_paid ? "已付款" : "未付款"}
                </Label>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label className="font-bold text-black">訂單編號</Label>
                <div className="rounded-md border border-black/10 bg-black/[0.02] px-3 py-2 text-sm break-all">
                  {form.id}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-black">建立時間</Label>
                <div className="rounded-md border border-black/10 bg-black/[0.02] px-3 py-2 text-sm">
                  {new Date((form.create_at ?? 0) * 1000).toLocaleString()}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-black">收件人</Label>
                <Input
                  required
                  value={form.user?.name ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      user: { ...(prev.user ?? {}), name: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-black">Email</Label>
                <Input
                  required
                  type="email"
                  value={form.user?.email ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      user: { ...(prev.user ?? {}), email: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-black">電話</Label>
                <Input
                  required
                  value={form.user?.tel ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      user: { ...(prev.user ?? {}), tel: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-black">地址</Label>
                <Input
                  required
                  value={form.user?.address ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      user: { ...(prev.user ?? {}), address: e.target.value },
                    }))
                  }
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label className="font-bold text-black">商品明細</Label>
              <div className="rounded-xl border border-black/10 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center font-bold text-black">商品</TableHead>
                      <TableHead className="text-center font-bold text-black">數量</TableHead>
                      <TableHead className="text-center font-bold text-black">小計</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.values(form.products ?? {}).length ? (
                      Object.values(form.products ?? {}).map((item: any) => (
                        <TableRow key={item.id ?? item.product_id}>
                          <TableCell className="text-center">
                            {item.product?.title ?? item.product_id}
                          </TableCell>
                          <TableCell className="text-center">{item.qty}</TableCell>
                          <TableCell className="text-center">
                            {item.total ?? item.final_total ?? "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-black/60">
                          無商品資料
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label className="font-bold text-black">留言</Label>
              <Textarea
                value={form.message ?? ""}
                onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
              />
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
        description="確定要送出這次的訂單修改嗎？"
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
        title="已編輯成功"
        onConfirm={() => {
          setIsSuccessOpen(false);
          onSaved?.(form);
        }}
      />

      <ErrorModal
        open={isErrorOpen}
        title="編輯失敗"
        description="編輯失敗，請稍後再試。"
        onClose={() => setIsErrorOpen(false)}
      />
    </div>
  );
}
