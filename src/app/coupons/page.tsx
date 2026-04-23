"use client";

import React, { useMemo, useState } from "react";
import TopBar from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditIcon, TrashIcon } from "lucide-react";
import ConfirmModal from "@/components/common/ConfirmModal";
import SuccessModal from "@/components/common/SuccessModal";
import ErrorModal from "@/components/common/ErrorModal";
import { AdminCoupon, useAdminCoupons } from "@/hooks/useAdminCoupons";
import { AddCouponModal } from "@/components/coupons/AddCoupon";
import { EditCouponModal } from "@/components/coupons/Editcoupon";

const CouponsPage = () => {
  const { coupons, isLoading, errorMessage, refetch, deleteCoupon } = useAdminCoupons();

  const [isAddingOpen, setIsAddingOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<AdminCoupon | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleteSuccessOpen, setIsDeleteSuccessOpen] = useState(false);
  const [isDeleteErrorOpen, setIsDeleteErrorOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const totalCoupons = useMemo(() => coupons.length, [coupons.length]);

  return (
    <div className="min-h-screen bg-[var(--off-white)] text-[var(--sumi-black)]">
      <TopBar />
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-8 pt-28">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold font-serif">優惠券</div>
            <div className="mt-1 text-sm text-black/60">共 {totalCoupons} 筆</div>
          </div>
          <Button onClick={() => setIsAddingOpen(true)}>新增優惠券</Button>
        </div>

        <div className="mt-4 rounded-2xl bg-white shadow-sm border border-black/5 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold text-black text-center">標題</TableHead>
                <TableHead className="font-bold text-black text-center">優惠碼</TableHead>
                <TableHead className="font-bold text-black text-center">折扣</TableHead>
                <TableHead className="font-bold text-black text-center">到期日</TableHead>
                <TableHead className="font-bold text-black text-center">狀態</TableHead>
                <TableHead className="font-bold text-black text-center">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-black/60">
                    載入中...
                  </TableCell>
                </TableRow>
              ) : errorMessage ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-red-600">
                    {errorMessage}
                  </TableCell>
                </TableRow>
              ) : (
                coupons.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="text-center">{c.title}</TableCell>
                    <TableCell className="text-center">{c.code}</TableCell>
                    <TableCell className="text-center">{c.percent}%</TableCell>
                    <TableCell className="text-center">
                      {new Date(c.due_date * 1000).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <Label className="text-xs text-black/60">
                        {c.is_enabled === 1 ? "啟用" : "停用"}
                      </Label>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <EditIcon className="w-5 h-5 cursor-pointer" onClick={() => setEditingCoupon(c)} />
                        <TrashIcon
                          className="w-5 h-5 cursor-pointer"
                          onClick={() => {
                            setDeletingId(c.id);
                            setIsDeleteConfirmOpen(true);
                          }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <AddCouponModal
          open={isAddingOpen}
          onClose={() => setIsAddingOpen(false)}
          onSaved={() => {
            setIsAddingOpen(false);
            refetch();
          }}
        />

        <EditCouponModal
          open={Boolean(editingCoupon)}
          coupon={editingCoupon}
          onClose={() => setEditingCoupon(null)}
          onSaved={() => {
            setEditingCoupon(null);
            refetch();
          }}
        />

        <ConfirmModal
          open={isDeleteConfirmOpen}
          title="確認刪除"
          description="確定要刪除此優惠券嗎？刪除後無法復原。"
          cancelText="取消"
          confirmText={isDeleting ? "刪除中..." : "確認刪除"}
          disabled={isDeleting}
          onCancel={() => {
            if (isDeleting) return;
            setIsDeleteConfirmOpen(false);
            setDeletingId(null);
          }}
          onConfirm={async () => {
            if (!deletingId) return;
            setIsDeleting(true);
            try {
              await deleteCoupon(deletingId);
              setIsDeleteConfirmOpen(false);
              setIsDeleteSuccessOpen(true);
            } catch {
              setIsDeleteConfirmOpen(false);
              setIsDeleteErrorOpen(true);
            } finally {
              setIsDeleting(false);
            }
          }}
        />

        <SuccessModal
          open={isDeleteSuccessOpen}
          title="刪除成功"
          onConfirm={() => {
            setIsDeleteSuccessOpen(false);
            setDeletingId(null);
            refetch();
          }}
        />

        <ErrorModal
          open={isDeleteErrorOpen}
          title="刪除失敗"
          description="刪除失敗，請稍後再試。"
          onClose={() => {
            setIsDeleteErrorOpen(false);
            setDeletingId(null);
          }}
        />
      </div>
    </div>
  );
};

export default CouponsPage;

