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

type ProductRow = {
  id: string;
  category: string;
  content: string;
  num: number;
  is_enabled: 0 | 1;
};

const ProductsPage = () => {
  const [products, setProducts] = useState<ProductRow[]>([
    { id: "1", category: "衣服", content: "這是內容", num: 1, is_enabled: 1 },
    { id: "2", category: "配件", content: "另一個內容", num: 2, is_enabled: 0 },
  ]);

  const totalNum = useMemo(() => products.reduce((sum, p) => sum + p.num, 0), [products]);

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
              {products.map((p) => (
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
                          setProducts((prev) =>
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
                      <EditIcon className="w-5 h-5 cursor-pointer" />

                      <TrashIcon className="w-5 h-5 cursor-pointer" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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
