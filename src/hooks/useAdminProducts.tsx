import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";

const ADMIN_GET_PRODUCTS_ALL_URL = "/admin/products/all"; //取得全部商品列表
const ADMIN_SEARCH_PRODUCT_ALL_URL = "/admin/products"; //搜尋商品列表
const ADMIN_PRODUCT_URL = "/admin/product"; //更新或刪除商品（單筆）

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const apiPath = process.env.NEXT_PUBLIC_API_PATH;

export type AdminProduct = {
  id: string;
  category: string;
  content: string;
  num: number;
  is_enabled: 0 | 1;
  [key: string]: any;
};

type AdminProductsAllResponse = {
  success: boolean;
  // 注意：後端回傳的 products 常用「物件 key 當 id」
  products: Record<string, Partial<AdminProduct>>;
};

type AdminProductResponse = {
  success: boolean;
  product: AdminProduct;
};

type AdminProductsPagedResponse = {
  success: boolean;
  products: AdminProduct[];
  pagination?: {
    total_pages: number;
    current_page: number;
    has_pre?: boolean;
    has_next?: boolean;
    category?: string;
  };
};

export function useAdminProducts() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pagination, setPagination] = useState<AdminProductsPagedResponse["pagination"] | null>(
    null,
  );

  async function fetchAll() {
    setIsLoading(true);
    setErrorMessage(null);
    // 避免在重新抓取時短暫顯示舊資料
    setProducts([]);

    try {
      const url = `${baseURL}/v2/api/${apiPath}${ADMIN_GET_PRODUCTS_ALL_URL}`;
      const res = await adminApi.get<AdminProductsAllResponse>(url);

      const obj = res.data?.products ?? {};
      setProducts(
        Object.entries(obj).map(([key, p]) => ({
          ...(p as any),
          id: (p as any)?.id ?? key,
        })) as AdminProduct[],
      );
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message ?? err?.message ?? "取得商品列表失敗");
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchPage(page = 1) {
    setIsLoading(true);
    setErrorMessage(null);
    // 切頁時先清空，確保畫面只顯示 API 回來的那頁資料
    setProducts([]);

    try {
      const url = `${baseURL}/v2/api/${apiPath}${ADMIN_SEARCH_PRODUCT_ALL_URL}?page=${page}`;
      const res = await adminApi.get<AdminProductsPagedResponse>(url);

      setProducts((res.data?.products ?? []) as AdminProduct[]);
      setPagination(res.data?.pagination ?? null);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message ?? err?.message ?? "取得商品列表失敗");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function editProduct(id: string, data: Partial<AdminProduct>) {
    const url = `${baseURL}/v2/api/${apiPath}${ADMIN_PRODUCT_URL}/${id}`;
    const res = await adminApi.put<AdminProductResponse>(url, { data: { id, ...(data as any) } });
    return res.data.product;
  }

  async function addProduct(data: Partial<AdminProduct>) {
    const url = `${baseURL}/v2/api/${apiPath}${ADMIN_PRODUCT_URL}`;
    const res = await adminApi.post<AdminProductResponse>(url, { data: { ...(data as any) } });
    return res.data.product;
  }

  async function deleteProduct(id: string) {
    const url = `${baseURL}/v2/api/${apiPath}${ADMIN_PRODUCT_URL}/${id}`;
    await adminApi.delete(url);
  }

  return {
    products,
    isLoading,
    errorMessage,
    pagination,
    fetchPage,
    refetch: fetchPage,
    editProduct,
    addProduct,
    deleteProduct,
  };
}
