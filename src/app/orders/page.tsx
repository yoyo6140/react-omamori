"use client";

import React, { useMemo, useState } from "react";
import TopBar from "@/components/common/TopBar";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { EditIcon, TrashIcon } from "lucide-react";
import ConfirmModal from "@/components/common/ConfirmModal";
import SuccessModal from "@/components/common/SuccessModal";
import ErrorModal from "@/components/common/ErrorModal";
import Loading from "@/components/common/Loading";
import { AdminOrder, useAdminOrders } from "@/hooks/useAdminOrders";
import { EditOrderModal } from "@/components/orders/EditOrder";

export default function OrdersPage() {
  const { orders, isLoading, errorMessage, pagination, fetchPage, refetch, deleteOrder } =
    useAdminOrders();

  const [editingOrder, setEditingOrder] = useState<AdminOrder | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleteSuccessOpen, setIsDeleteSuccessOpen] = useState(false);
  const [isDeleteErrorOpen, setIsDeleteErrorOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const totalOrders = useMemo(() => orders.length, [orders.length]);

  return (
    <div className="min-h-screen bg-[var(--off-white)] text-[var(--sumi-black)]">
      <TopBar />
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-8 pt-28">
        <div className="text-2xl font-bold font-serif">訂單</div>
        <div className="mt-1 text-sm text-black/60">共 {totalOrders} 筆（本頁）</div>

        <div className="mt-4 rounded-2xl bg-white shadow-sm border border-black/5 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold text-black text-center">建立時間</TableHead>
                <TableHead className="font-bold text-black text-center">收件人</TableHead>
                <TableHead className="font-bold text-black text-center">付款</TableHead>
                <TableHead className="font-bold text-black text-center">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-10">
                    <Loading label={null} className="w-full" />
                  </TableCell>
                </TableRow>
              ) : errorMessage ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-red-600">
                    {errorMessage}
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="text-center">
                      {new Date(o.create_at * 1000).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">{o.user?.name}</TableCell>
                    <TableCell className="text-center">
                      <Label className="text-xs text-black/60">
                        {o.is_paid ? "已付款" : "未付款"}
                      </Label>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <EditIcon
                          className="w-5 h-5 cursor-pointer"
                          onClick={() => setEditingOrder(o)}
                        />
                        <TrashIcon
                          className="w-5 h-5 cursor-pointer"
                          onClick={() => {
                            setDeletingId(o.id);
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

        <div className="mt-auto w-full pb-6 pt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    const cur = pagination?.current_page ?? 1;
                    if (cur <= 1) return;
                    fetchPage(cur - 1);
                  }}
                />
              </PaginationItem>

              {Array.from({ length: pagination?.total_pages ?? 1 }, (_, i) => i + 1)
                .slice(0, 7)
                .map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={page === (pagination?.current_page ?? 1)}
                      onClick={(e) => {
                        e.preventDefault();
                        fetchPage(page);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

              {(pagination?.total_pages ?? 1) > 7 ? (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : null}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    const cur = pagination?.current_page ?? 1;
                    const total = pagination?.total_pages ?? 1;
                    if (cur >= total) return;
                    fetchPage(cur + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        <EditOrderModal
          open={Boolean(editingOrder)}
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSaved={() => {
            setEditingOrder(null);
            refetch(pagination?.current_page ?? 1);
          }}
        />

        <ConfirmModal
          open={isDeleteConfirmOpen}
          title="確認刪除"
          description="確定要刪除此訂單嗎？刪除後無法復原。"
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
              await deleteOrder(deletingId);
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
            refetch(pagination?.current_page ?? 1);
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
}
