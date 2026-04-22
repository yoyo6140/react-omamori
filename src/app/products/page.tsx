"use client";

import React, { useMemo, useState } from "react";
import TopBar from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import EditProduct from "@/components/products/EditProduct";

type ProductRow = {
  id: string;
  category: string;
  content: string;
  num: number;
  is_enabled: 0 | 1;
};

const ProductsPage = () => {
  const { products, isLoading, errorMessage } = useAdminProducts();
  const [localProducts, setLocalProducts] = useState<ProductRow[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // 將 API products 轉成表格用的最小欄位（只在首次載入時同步一次，避免你切換 switch 時被覆蓋）
  React.useEffect(() => {
    if (products.length > 0 && localProducts.length === 0) {
      setLocalProducts(
        products.map((p: any) => ({
          id: p.id,
          category: p.category ?? "",
          content: p.content ?? "",
          num: Number(p.num ?? 0),
          is_enabled: (p.is_enabled ?? 0) as 0 | 1,
        })),
      );
    }
  }, [products, localProducts.length]);

  const totalNum = useMemo(
    () => localProducts.reduce((sum, p) => sum + p.num, 0),
    [localProducts],
  );

  return (
    <div className="min-h-screen bg-[var(--off-white)]">
      <TopBar />
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-8 pt-28">
        <div className="rounded-2xl bg-white shadow-sm border border-black/5 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold text-black text-center">分類</TableHead>
                <TableHead className="font-bold text-black text-center">內容</TableHead>
                <TableHead className="font-bold text-black text-center">數量</TableHead>
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
                  <TableCell className="text-center">{p.content}</TableCell>
                  <TableCell className="text-center">{p.num}</TableCell>
                  <TableCell className="w-[140px]">
                    <div className="flex items-center justify-center gap-2">
                      <Switch
                        id={`enabled-${p.id}`}
                        checked={p.is_enabled === 1}
                        onCheckedChange={(checked) => {
                          setLocalProducts((prev) =>
                            prev.map((x) =>
                              x.id === p.id ? { ...x, is_enabled: checked ? 1 : 0 } : x,
                            ),
                          );
                        }}
                      />
                      <Label htmlFor={`enabled-${p.id}`} className="text-xs text-black/60">
                        {p.is_enabled === 1 ? "啟用" : "停用"}
                      </Label>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <EditIcon
                        className="w-5 h-5 cursor-pointer"
                        onClick={() => setEditingId(p.id)}
                      />

                      <TrashIcon className="w-5 h-5 cursor-pointer" />
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
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        {editingId && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4"
            onClick={() => setEditingId(null)}
          >
            <div
              className="w-full max-w-5xl rounded-2xl bg-white shadow-xl border border-black/10 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold">編輯商品</div>
                <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                  關閉
                </Button>
              </div>
              <div className="mt-4 max-h-[70vh] overflow-auto">
                <EditProduct id={editingId} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;

// {
//   "success": true,
//   "products": {
//     "-L9tH8jxVb2Ka_DYPwng": {
//       "category": "衣服3",
//       "content": "這是內容",
//       "description": "Sit down please 名設計師設計",
//       "id": "-L9tH8jxVb2Ka_DYPwng",
//       "is_enabled": 1,
//       "num": 1,
//       "origin_price": 500,
//       "price": 600,
//       "title": "[賣]動物園造型衣服3",
//       "unit": "個",
//       "imageUrl": "主圖網址",
//       "imagesUrl": [
//         "圖片網址一",
//         "圖片網址二",
//         "圖片網址三",
//         "圖片網址四",
//         "圖片網址五"
//       ]
//     }
//   }
// }
