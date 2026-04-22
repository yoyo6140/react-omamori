/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

type GetAdminProduct = {
  id: string;
  title?: string;
  category?: string;
  content?: string;
  description?: string;
  num?: number;
  is_enabled?: 0 | 1;
  price?: number;
  origin_price?: number;
  unit?: string;
  imageUrl?: string;
  imagesUrl?: string[];
};

type GetAdminSingleProductResponse = {
  success: boolean;
  product: GetAdminProduct;
};

export default function EditProduct({ id }: { id: string }) {
  const [product, setProduct] = useState<GetAdminProduct | null>(null);
  const [form, setForm] = useState<GetAdminProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL ?? "";
      const apiPath = process.env.NEXT_PUBLIC_API_PATH ?? process.env.API_PATH ?? "";
      const token = Cookies.get("access_token");

      if (!token) {
        setErrorMessage("請重新登入");
        return;
      }
      if (!id) {
        setErrorMessage("找不到商品資料");
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      // 嘗試單筆商品（若後台不支援會報錯）
      const url = `${baseURL}/v2/api/${apiPath}/product/${id}`;
      try {
        const res = await axios.get<GetAdminSingleProductResponse>(url, {
          headers: { Authorization: token },
        });
        setProduct(res.data.product);
        setForm(res.data.product);
      } catch (err: any) {
        setErrorMessage(err?.response?.data?.message ?? err?.message ?? "取得單一商品失敗");
      } finally {
        setIsLoading(false);
      }
    }

    run();
  }, [id]);

  if (isLoading) return <div>載入中...</div>;
  if (errorMessage) return <div className="text-red-600">{errorMessage}</div>;
  if (!product || !form) return <div>尚無資料</div>;

  async function handleUpload() {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL ?? "";
    const apiPath = process.env.NEXT_PUBLIC_API_PATH ?? process.env.API_PATH ?? "";
    const token = Cookies.get("access_token");

    if (!file) return;
    if (!baseURL || !apiPath || !token) {
      setErrorMessage("缺少 baseURL/apiPath/token（請確認 .env 與登入狀態）");
      return;
    }

    setUploading(true);
    setUploadedUrl(null);
    try {
      const formData = new FormData();
      formData.append("file-to-upload", file);

      const url = `${baseURL}/v2/api/${apiPath}/admin/upload`;
      const res = await axios.post(url, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadedUrl(res.data?.imageUrl ?? null);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message ?? err?.message ?? "上傳失敗");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Card>
        <CardContent className="">
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Switch
                  id="product-enabled"
                  checked={(form.is_enabled ?? 0) === 1}
                  onCheckedChange={(checked) =>
                    setForm((prev) => (prev ? { ...prev, is_enabled: checked ? 1 : 0 } : prev))
                  }
                />
                <Label htmlFor="product-enabled" className="text-xs text-black/60">
                  {(form.is_enabled ?? 0) === 1 ? "啟用" : "停用"}
                </Label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="font-bold text-black">產品名稱</Label>
              <Input
                value={form.title ?? ""}
                onChange={(e) =>
                  setForm((prev) => (prev ? { ...prev, title: e.target.value } : prev))
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-black">分類</Label>
              <Input
                value={form.category ?? ""}
                onChange={(e) =>
                  setForm((prev) => (prev ? { ...prev, category: e.target.value } : prev))
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-black">單位</Label>
              <Input
                value={form.unit ?? ""}
                onChange={(e) =>
                  setForm((prev) => (prev ? { ...prev, unit: e.target.value } : prev))
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-black">數量</Label>
              <Input
                type="number"
                value={form.num === undefined ? "" : String(form.num)}
                onChange={(e) =>
                  setForm((prev) =>
                    prev
                      ? { ...prev, num: e.target.value === "" ? undefined : Number(e.target.value) }
                      : prev,
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-black">原價</Label>
              <Input
                type="number"
                value={form.origin_price === undefined ? "" : String(form.origin_price)}
                onChange={(e) =>
                  setForm((prev) =>
                    prev
                      ? {
                          ...prev,
                          origin_price: e.target.value === "" ? undefined : Number(e.target.value),
                        }
                      : prev,
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-black">售價</Label>
              <Input
                type="number"
                value={form.price === undefined ? "" : String(form.price)}
                onChange={(e) =>
                  setForm((prev) =>
                    prev
                      ? {
                          ...prev,
                          price: e.target.value === "" ? undefined : Number(e.target.value),
                        }
                      : prev,
                  )
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 mt-4 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-bold text-black">內容</Label>
              <Textarea
                value={form.content ?? ""}
                onChange={(e) =>
                  setForm((prev) => (prev ? { ...prev, content: e.target.value } : prev))
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-black">圖片</Label>
              <Input
                value={form.imageUrl ?? ""}
                onChange={(e) =>
                  setForm((prev) => (prev ? { ...prev, imageUrl: e.target.value } : prev))
                }
              />
              {form.imageUrl && (
                <img
                  src={form.imageUrl}
                  alt="主圖"
                  className="mt-2 h-40 w-full rounded-lg object-cover border border-black/10"
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
