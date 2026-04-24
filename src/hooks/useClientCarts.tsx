"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import axios from "axios";
import type { CartItem } from "@/components/carts/types";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const apiPath = process.env.NEXT_PUBLIC_API_PATH;

const CLIENT_CARTS_API = `${baseURL}/v2/api/${apiPath}`;

const CART_API_SEGMENT = "cart";
const cartListUrl = () => `${CLIENT_CARTS_API}/${CART_API_SEGMENT}`;
const orderUrl = () => `${CLIENT_CARTS_API}/order`;
const orderDetailUrl = (orderId: string) =>
  `${CLIENT_CARTS_API}/order/${encodeURIComponent(orderId)}`;
const payUrl = (orderId: string) => `${CLIENT_CARTS_API}/pay/${encodeURIComponent(orderId)}`;

export type ClientCartPostBody = {
  data: { product_id: string; qty: number };
};

export async function postClientCartLine(body: ClientCartPostBody) {
  const res = await axios.post<{
    success?: boolean;
    message?: string;
  }>(cartListUrl(), body);
  if (!res.data?.success) {
    throw new Error(res.data?.message ?? "加入購物車失敗");
  }
}

/** 結帳前將品項逐筆 POST 至 `/cart`，再建立訂單時伺服器購物車才會正確 */
export async function syncCheckoutCartToServer(
  lines: readonly { product_id: string; qty: number }[],
) {
  for (const line of lines) {
    await postClientCartLine({ data: line });
  }
}

export type OrderUser = {
  name: string;
  email: string;
  tel: string;
  address: string;
};

/** 與 POST `/order` 請求體一致 */
export type CreateOrderBody = {
  data: {
    user: OrderUser;
    message: string;
  };
};

function parseOrderIdFromResponse(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    throw new Error("建立訂單成功但未回傳訂單編號");
  }
  const root = payload as Record<string, unknown>;
  const pick = (v: unknown) => {
    if (typeof v === "string" && v.trim()) return v.trim();
    if (typeof v === "number" && Number.isFinite(v)) return String(v);
    return undefined;
  };
  const a = pick(root.orderId);
  if (a) return a;
  const nested = root.data;
  if (nested && typeof nested === "object") {
    const b = pick((nested as Record<string, unknown>).orderId);
    if (b) return b;
  }
  throw new Error("建立訂單成功但未回傳訂單編號");
}

export async function createCustomerOrder(body: CreateOrderBody): Promise<string> {
  const res = await axios.post<{
    success?: boolean;
    message?: string;
    orderId?: string | number;
    data?: { orderId?: string | number };
  }>(orderUrl(), body);
  if (res.data && typeof res.data === "object" && res.data.success === false) {
    throw new Error(res.data.message ?? "建立訂單失敗");
  }
  return parseOrderIdFromResponse(res.data);
}

export async function payCustomerOrder(orderId: string) {
  const res = await axios.post<{ success?: boolean; message?: string }>(payUrl(orderId));
  if (!res.data?.success) {
    throw new Error(res.data?.message ?? "付款失敗");
  }
}

/** 六角 GET 訂單明細：品項結構依 API 可能略有差異 */
export type CustomerOrderProductLine = {
  id?: string;
  product_id?: string;
  qty?: number;
  product?: {
    title?: string;
    price?: number;
    imageUrl?: string;
    category?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export type CustomerOrderDetail = {
  id?: string;
  user?: Partial<OrderUser> & Record<string, unknown>;
  products?: CustomerOrderProductLine[];
  total?: number;
  final_total?: number;
  is_paid?: boolean;
  paid_date?: number;
  message?: string;
  create_at?: number;
  num?: number;
  [key: string]: unknown;
};

function extractOrderFromGetResponse(payload: unknown): CustomerOrderDetail {
  const root = payload as Record<string, unknown>;
  if (root.success === false) {
    throw new Error(typeof root.message === "string" ? root.message : "取得訂單失敗");
  }
  const fromData = root.data;
  let order: unknown =
    root.order ??
    (fromData && typeof fromData === "object"
      ? ((fromData as Record<string, unknown>).order ?? fromData)
      : undefined);

  return order as CustomerOrderDetail;
}

export async function fetchCustomerOrder(orderId: string): Promise<CustomerOrderDetail> {
  const res = await axios.get<unknown>(orderDetailUrl(orderId));
  return extractOrderFromGetResponse(res.data);
}

// ---------------------------------------------------------------------------
// 購物車全域狀態（原 useCart）
// ---------------------------------------------------------------------------

const STORAGE_KEY = "react-omamori-cart";
const MAX_PER_LINE = 99;

function parseStorageCartItem(raw: unknown): CartItem | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== "string" || typeof o.title !== "string") return null;
  const imageUrl = String(o.imageUrl ?? "");
  const description = o.description != null ? String(o.description) : undefined;
  const unit = o.unit != null ? String(o.unit) : undefined;
  const serverCartId = typeof o.serverCartId === "string" ? o.serverCartId : undefined;

  if (
    typeof o.category === "string" &&
    typeof o.content === "string" &&
    typeof o.price === "number"
  ) {
    const qtyRaw =
      typeof o.qty === "number" ? o.qty : typeof o.quantity === "number" ? o.quantity : 1;
    return {
      id: o.id,
      serverCartId,
      category: o.category,
      title: o.title,
      content: o.content,
      price: o.price,
      qty: Math.max(1, Math.min(MAX_PER_LINE, qtyRaw)),
      imageUrl,
      description,
      unit,
    };
  }

  const L = o as Record<string, unknown>;
  if (
    typeof L.shrine === "string" &&
    typeof L.usage === "string" &&
    typeof L.priceJPY === "number" &&
    typeof L.quantity === "number"
  ) {
    const category = L.shrine;
    const content = L.usage;
    const price = L.priceJPY;
    const qty = L.quantity;
    return {
      id: o.id,
      serverCartId,
      category,
      title: o.title,
      content,
      price,
      qty: Math.max(1, Math.min(MAX_PER_LINE, qty)),
      imageUrl,
      description,
      unit,
    };
  }

  return null;
}

export type AddCartPayload = {
  id: string;
  category: string;
  title: string;
  content: string;
  price: number;
  imageUrl: string;
  qty: number;
  description?: string;
  unit?: string;
  maxStock?: number;
};

type CartSnapshot = {
  items: CartItem[];
  syncError: string | null;
};

const listeners = new Set<() => void>();

let snapshot: CartSnapshot = { items: [], syncError: null };

function notify() {
  listeners.forEach((l) => l());
}

function setSnapshot(updater: (s: CartSnapshot) => CartSnapshot) {
  snapshot = updater(snapshot);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot.items));
    } catch {
      /* ignore */
    }
  }
  notify();
}

const serverSnapshotFallback: CartSnapshot = { items: [], syncError: null };

function getServerSnapshot(): CartSnapshot {
  return serverSnapshotFallback;
}

function getClientSnapshot(): CartSnapshot {
  return snapshot;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function CartBootstrap() {
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) {
          const items = parsed.map(parseStorageCartItem).filter((x): x is CartItem => x != null);
          setSnapshot((s) => ({ ...s, items }));
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  return null;
}

export function useCart() {
  const { items, syncError } = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const refreshCartFromServer = useCallback(async () => {
    setSnapshot((s) => ({ ...s, syncError: null }));
  }, []);

  const addItem = useCallback(async (payload: AddCartPayload) => {
    const { qty: payloadQty, maxStock, ...rest } = payload;
    const cap = maxStock != null && maxStock > 0 ? Math.min(maxStock, MAX_PER_LINE) : MAX_PER_LINE;
    const add = Math.max(1, Math.min(payloadQty, cap));

    setSnapshot((s) => {
      const prev = s.items;
      const idx = prev.findIndex((x) => x.id === rest.id);
      let next: CartItem[];
      if (idx >= 0) {
        const copy = [...prev];
        const merged = copy[idx].qty + add;
        copy[idx] = {
          ...copy[idx],
          ...rest,
          qty: Math.min(cap, merged, MAX_PER_LINE),
        };
        next = copy;
      } else {
        next = [...prev, { ...rest, qty: add }];
      }
      return { ...s, items: next };
    });

    try {
      await postClientCartLine({ data: { product_id: rest.id, qty: add } });
      setSnapshot((s) => ({ ...s, syncError: null }));
    } catch (e) {
      setSnapshot((s) => ({
        ...s,
        syncError: e instanceof Error ? e.message : "加入購物車失敗",
      }));
    }
  }, []);

  const removeItem = useCallback((productId: string) => {
    setSnapshot((s) => ({
      ...s,
      items: s.items.filter((x) => x.id !== productId),
    }));
  }, []);

  const clearCart = useCallback(() => {
    setSnapshot((s) => ({ ...s, items: [] }));
  }, []);

  const setLineQuantity = useCallback((id: string, nextQty: number) => {
    const q = Math.max(1, Math.min(MAX_PER_LINE, nextQty));
    setSnapshot((s) => ({
      ...s,
      items: s.items.map((x) => (x.id === id ? { ...x, qty: q } : x)),
    }));
  }, []);

  const clearSyncError = useCallback(() => {
    setSnapshot((s) => ({ ...s, syncError: null }));
  }, []);

  const cartUnitCount = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);

  return useMemo(
    () => ({
      items,
      cartUnitCount,
      addItem,
      removeItem,
      clearCart,
      setLineQuantity,
      refreshCartFromServer,
      syncError,
      clearSyncError,
    }),
    [
      items,
      cartUnitCount,
      addItem,
      removeItem,
      clearCart,
      setLineQuantity,
      refreshCartFromServer,
      syncError,
      clearSyncError,
    ],
  );
}

/** 後端商品 JSON，欄位與 API 一致 */
export type ApiProduct = {
  id: string;
  title?: string;
  category?: string;
  content?: string;
  description?: string;
  price?: number;
  origin_price?: number;
  unit?: string;
  num?: number;
  is_enabled?: 0 | 1;
  imageUrl?: string;
  imagesUrl?: string[];
};

// ---------------------------------------------------------------------------
// 可選：帶 loading / error 的 API 包裝
// ---------------------------------------------------------------------------

export function useClientCarts() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async <T,>(fn: () => Promise<T>): Promise<T | undefined> => {
    setError(null);
    setIsLoading(true);
    try {
      return await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "操作失敗");
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addLine = useCallback(
    (product_id: string, qty: number) =>
      run(() => postClientCartLine({ data: { product_id, qty } })),
    [run],
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    isLoading,
    error,
    clearError,
    addLine,
  };
}
