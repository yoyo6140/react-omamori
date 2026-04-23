/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import ConfirmModal from "@/components/common/ConfirmModal";
import SuccessModal from "@/components/common/SuccessModal";
import ErrorModal from "@/components/common/ErrorModal";
import { useAdminProducts } from "@/hooks/useAdminProducts";

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

type GetAdminProductsAllResponse = {
  success: boolean;
  products: Record<string, Partial<GetAdminProduct>>;
};

export default function EditProduct({
  id,
  onCancel,
  onSaved,
}: {
  id: string;
  onCancel?: () => void;
  onSaved?: (updated: GetAdminProduct) => void;
}) {
  const { editProduct } = useAdminProducts();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [product, setProduct] = useState<GetAdminProduct | null>(null);
  const [form, setForm] = useState<GetAdminProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [savedProduct, setSavedProduct] = useState<GetAdminProduct | null>(null);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const apiPath = process.env.NEXT_PUBLIC_API_PATH;
  const token = Cookies.get("access_token");
  useEffect(() => {
    async function run() {
      if (!id) {
        setErrorMessage("找不到商品資料");
        return;
      }
      setIsLoading(true);
      setErrorMessage(null);

      // 改用後台全部商品，再依 id 取出單筆（停用商品也能取得）
      const url = `${baseURL}/v2/api/${apiPath}/admin/products/all`;
      try {
        const res = await axios.get<GetAdminProductsAllResponse>(url, {
          headers: { Authorization: token },
        });

        const obj = res.data?.products ?? {};
        const found =
          (obj[id] as GetAdminProduct | undefined) ??
          (Object.entries(obj).find(([key, p]) => key === id || (p as any)?.id === id)?.[1] as
            | GetAdminProduct
            | undefined);

        if (!found) {
          setErrorMessage("找不到商品資料");
          return;
        }

        const normalized: GetAdminProduct = { id, ...(found as any) };
        setProduct(normalized);
        setForm(normalized);
      } catch (err: any) {
        setErrorMessage("取得商品失敗");
      } finally {
        setIsLoading(false);
        setHasLoaded(true);
      }
    }

    run();
  }, [id]);

  if (!hasLoaded && isLoading) return <div>載入中...</div>;
  if (!hasLoaded && errorMessage) return <div className="text-red-600">{errorMessage}</div>;
  if (!hasLoaded && (!product || !form)) return <div>尚無資料</div>;

  const viewForm: GetAdminProduct = (form ?? product ?? { id }) as GetAdminProduct;

  async function handleUpload() {
    if (!file) {
      setSubmitErrorMessage("請先選擇要上傳的圖片");
      setIsErrorOpen(true);
      return;
    }

    setUploading(true);
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

      const urlFromApi = (res.data?.imageUrl ?? null) as string | null;
      setUploadedUrl(urlFromApi);
      if (urlFromApi) {
        setForm((prev) => (prev ? { ...prev, imageUrl: urlFromApi } : prev));
      }
    } catch (err: any) {
      setSubmitErrorMessage(err?.response?.data?.message ?? err?.message ?? "上傳失敗");
      setIsErrorOpen(true);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit() {
    setIsSaving(true);
    setErrorMessage(null);

    const payload: GetAdminProduct = {
      ...viewForm,
      id,
      ...(uploadedUrl ? { imageUrl: uploadedUrl } : {}),
    };

    try {
      const updated = (await editProduct(id, payload)) as GetAdminProduct | undefined | null;
      const next = (updated ?? payload) as GetAdminProduct;
      setProduct(next);
      setForm(next);
      setUploadedUrl(null);
      setSavedProduct(next);
      setIsSuccessOpen(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? "更新失敗";
      setSubmitErrorMessage(msg);
      setIsErrorOpen(true);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-2">
      <Card>
        <CardContent className="">
          <form
            ref={formRef}
            onSubmit={async (e) => {
              e.preventDefault();
              await handleSubmit();
            }}
          >
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Switch
                    id="product-enabled"
                    checked={(viewForm.is_enabled ?? 0) === 1}
                    onCheckedChange={(checked) =>
                      setForm((prev) => (prev ? { ...prev, is_enabled: checked ? 1 : 0 } : prev))
                    }
                  />
                  <Label htmlFor="product-enabled" className="text-xs text-black/60">
                    {(viewForm.is_enabled ?? 0) === 1 ? "啟用" : "停用"}
                  </Label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="font-bold text-black">產品名稱</Label>
              <Input
                required
                value={viewForm.title ?? ""}
                onChange={(e) =>
                  setForm((prev) => (prev ? { ...prev, title: e.target.value } : prev))
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-black">分類</Label>
              <select
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={viewForm.category ?? "其他"}
                onChange={(e) =>
                  setForm((prev) => (prev ? { ...prev, category: e.target.value } : prev))
                }
              >
                <option value="關東">關東</option>
                <option value="關西">關西</option>
                <option value="九州">九州</option>
                <option value="北海道">北海道</option>
                <option value="其他">其他</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-black">單位</Label>
              <Input
                required
                value={viewForm.unit ?? ""}
                onChange={(e) =>
                  setForm((prev) => (prev ? { ...prev, unit: e.target.value } : prev))
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-black">數量</Label>
              <Input
                type="number"
                required
                value={viewForm.num === undefined ? "" : String(viewForm.num)}
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
                required
                value={viewForm.origin_price === undefined ? "" : String(viewForm.origin_price)}
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
                required
                value={viewForm.price === undefined ? "" : String(viewForm.price)}
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

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
            <div className="lg:col-span-2 flex flex-col gap-4 h-full">
              <div className="space-y-2 flex-1">
                <Label className="font-bold text-black">內容</Label>
                <Textarea
                  className="min-h-[140px]"
                  required
                  value={viewForm.content ?? ""}
                  onChange={(e) =>
                    setForm((prev) => (prev ? { ...prev, content: e.target.value } : prev))
                  }
                />
              </div>
              <div className="space-y-2 flex-1">
                <Label className="font-bold text-black">描述</Label>
                <Textarea
                  className="min-h-[140px]"
                  required
                  value={viewForm.description ?? ""}
                  onChange={(e) =>
                    setForm((prev) => (prev ? { ...prev, description: e.target.value } : prev))
                  }
                />
              </div>
            </div>

            <div className="lg:col-span-1 flex flex-col gap-2 h-full">
              <Label className="font-bold text-black">圖片</Label>
              <Input
                required
                value={viewForm.imageUrl ?? ""}
                onChange={(e) =>
                  setForm((prev) => (prev ? { ...prev, imageUrl: e.target.value } : prev))
                }
              />
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleUpload}
                  disabled={!file || uploading}
                >
                  {uploading ? "上傳中..." : "上傳主圖片"}
                </Button>
                {uploadedUrl ? (
                  <div className="text-xs text-black/60 break-all">已上傳：{uploadedUrl}</div>
                ) : null}
              </div>
              {viewForm.imageUrl ? (
                <div className="mt-2 flex-1 min-h-[290px] w-full overflow-hidden rounded-lg border border-black/10">
                  <img src={viewForm.imageUrl} alt="主圖" className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="mt-2 flex-1 min-h-[290px] w-full rounded-lg border border-dashed border-black/20 bg-black/[0.02]" />
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            <Button variant="outline" type="button" onClick={() => onCancel?.()}>
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
        description="確定要送出這次的編輯內容嗎？"
        cancelText="取消"
        confirmText="確認送出"
        disabled={isSaving || uploading}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={async () => {
          setIsConfirmOpen(false);
          formRef.current?.requestSubmit();
        }}
      />

      <SuccessModal
        open={isSuccessOpen}
        title="已編輯成功"
        onConfirm={() => {
          setIsSuccessOpen(false);
          if (savedProduct) onSaved?.(savedProduct);
        }}
      />

      <ErrorModal
        open={isErrorOpen}
        title="編輯失敗"
        description={submitErrorMessage ?? undefined}
        onClose={() => {
          setIsErrorOpen(false);
          setSubmitErrorMessage(null);
        }}
      />
    </div>
  );
}
