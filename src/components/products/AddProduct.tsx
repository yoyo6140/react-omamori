/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef, useState } from "react";
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

type NewProductForm = {
  title: string;
  category: string;
  content: string;
  description: string;
  num: number | undefined;
  is_enabled: 0 | 1;
  price: number | undefined;
  origin_price: number | undefined;
  unit: string;
  imageUrl: string;
};

export default function AddProduct({
  onCancel,
  onSaved,
}: {
  onCancel?: () => void;
  onSaved?: () => void;
}) {
  const { addProduct } = useAdminProducts();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [form, setForm] = useState<NewProductForm>({
    title: "",
    category: "其他",
    content: "",
    description: "",
    num: undefined,
    is_enabled: 1,
    price: undefined,
    origin_price: undefined,
    unit: "",
    imageUrl: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  async function handleUpload() {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL ?? "";
    const apiPath = process.env.NEXT_PUBLIC_API_PATH ?? process.env.API_PATH ?? "";
    const token = Cookies.get("access_token");

    if (!file) {
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
        setForm((prev) => ({ ...prev, imageUrl: urlFromApi }));
      }
    } catch {
      setIsErrorOpen(true);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit() {
    setIsSaving(true);
    try {
      await addProduct({
        ...form,
        ...(uploadedUrl ? { imageUrl: uploadedUrl } : {}),
      });
      setIsSuccessOpen(true);
      setUploadedUrl(null);
      setFile(null);
    } catch {
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
                    checked={form.is_enabled === 1}
                    onCheckedChange={(checked) =>
                      setForm((prev) => ({ ...prev, is_enabled: checked ? 1 : 0 }))
                    }
                  />
                  <Label htmlFor="product-enabled" className="text-xs text-black/60">
                    {form.is_enabled === 1 ? "啟用" : "停用"}
                  </Label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="font-bold text-black">產品名稱</Label>
                <Input
                  required
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-black">分類</Label>
                <select
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
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
                  value={form.unit}
                  onChange={(e) => setForm((prev) => ({ ...prev, unit: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-black">數量</Label>
                <Input
                  type="number"
                  required
                  onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
                  value={form.num === undefined ? "" : String(form.num)}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      num: e.target.value === "" ? undefined : Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-black">原價</Label>
                <Input
                  type="number"
                  required
                  onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
                  value={form.origin_price === undefined ? "" : String(form.origin_price)}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      origin_price: e.target.value === "" ? undefined : Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-black">售價</Label>
                <Input
                  type="number"
                  required
                  onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
                  value={form.price === undefined ? "" : String(form.price)}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      price: e.target.value === "" ? undefined : Number(e.target.value),
                    }))
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
                    value={form.content}
                    onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <Label className="font-bold text-black">描述</Label>
                  <Textarea
                    className="min-h-[140px]"
                    required
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>

              <div className="lg:col-span-1 flex flex-col gap-2 h-full">
                <Label className="font-bold text-black">圖片</Label>
                <Input
                  required
                  value={form.imageUrl}
                  onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
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
                {form.imageUrl ? (
                  <div className="mt-2 flex-1 min-h-[290px] w-full overflow-hidden rounded-lg border border-black/10">
                    <img src={form.imageUrl} alt="主圖" className="h-full w-full object-cover" />
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
        description="確定要送出這次的新增內容嗎？"
        cancelText="取消"
        confirmText="確認送出"
        disabled={isSaving || uploading}
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

export function AddProductModal({
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
          <div className="text-lg font-bold">新增商品</div>
          <Button variant="outline" size="sm" onClick={onClose}>
            關閉
          </Button>
        </div>
        <div className="mt-4 max-h-[70vh] overflow-auto">
          <AddProduct onCancel={onClose} onSaved={onSaved} />
        </div>
      </div>
    </div>
  );
}
