"use client";

import React, { useMemo, useState } from "react";
import TopBar from "@/components/common/TopBar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
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
import { useAdminProducts } from "@/hooks/useAdminProducts";
import ConfirmModal from "@/components/common/ConfirmModal";
import SuccessModal from "@/components/common/SuccessModal";
import ErrorModal from "@/components/common/ErrorModal";
import { EditProductModal } from "@/components/products/EditProduct";
import { AddProductModal } from "@/components/products/AddProduct";

type ProductRow = {
  id: string;
  title: string;
  category: string;
  content: string;
  num: number;
  price: number;
  is_enabled: 0 | 1;
};

const ProductsPage = () => {
  const { products, isLoading, errorMessage, refetch, deleteProduct, pagination, fetchPage } =
    useAdminProducts();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingOpen, setIsAddingOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleteSuccessOpen, setIsDeleteSuccessOpen] = useState(false);
  const [isDeleteErrorOpen, setIsDeleteErrorOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 直接由 API products 推導畫面資料（避免切頁時上一頁資料閃一下）
  const localProducts: ProductRow[] = useMemo(
    () =>
      products.map((p: any) => ({
        id: p.id,
        title: p.title ?? "",
        category: p.category ?? "",
        content: p.content ?? "",
        num: Number(p.num ?? 0),
        price: Number(p.price ?? 0),
        is_enabled: (p.is_enabled ?? 0) as 0 | 1,
      })),
    [products],
  );

  return (
    <div className="min-h-screen bg-[var(--off-white)]">
      <TopBar />
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 pt-24 sm:px-8 sm:pt-28">
        <div className="mb-3 flex justify-end">
          <Button onClick={() => setIsAddingOpen(true)}>新增商品</Button>
        </div>
        <div className="rounded-2xl bg-white shadow-sm border border-black/5 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold text-black text-center">地區</TableHead>
                <TableHead className="font-bold text-black text-center">商品名稱</TableHead>
                <TableHead className="font-bold text-black text-center">售價</TableHead>
                <TableHead className="font-bold text-black w-[140px] text-center">啟用</TableHead>
                <TableHead className="font-bold text-black text-center">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-black/60">
                    載入中...
                  </TableCell>
                </TableRow>
              ) : errorMessage ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-red-600">
                    {errorMessage}
                  </TableCell>
                </TableRow>
              ) : (
                localProducts.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium text-center">{p.category}</TableCell>
                    <TableCell className="text-center">{p.title}</TableCell>
                    <TableCell className="text-center">{p.price}元</TableCell>
                    <TableCell className="w-[140px]">
                      <div className="flex items-center justify-center">
                        <Label>{p.is_enabled === 1 ? "啟用" : "停用"}</Label>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <EditIcon
                          className="w-5 h-5 cursor-pointer"
                          onClick={() => setEditingId(p.id)}
                        />

                        <TrashIcon
                          className="w-5 h-5 cursor-pointer"
                          onClick={() => {
                            setDeletingId(p.id);
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

        <EditProductModal
          open={Boolean(editingId)}
          id={editingId}
          onClose={() => setEditingId(null)}
          onSaved={() => {
            setEditingId(null);
            refetch();
          }}
        />

        <AddProductModal
          open={isAddingOpen}
          onClose={() => setIsAddingOpen(false)}
          onSaved={() => {
            setIsAddingOpen(false);
            refetch();
          }}
        />

        <ConfirmModal
          open={isDeleteConfirmOpen}
          title="確認刪除"
          description="確定要刪除此商品嗎？刪除後無法復原。"
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
              await deleteProduct(deletingId);
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

export default ProductsPage;
