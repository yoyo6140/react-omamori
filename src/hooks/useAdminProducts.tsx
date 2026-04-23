import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const ADMIN_GET_PRODUCTS_ALL_URL = "/admin/products/all"; //取得全部商品列表
const ADMIN_SEARCH_PRODUCT_ALL_URL = "/admin/products"; //搜尋商品列表
const ADMIN_PRODUCT_URL = "/admin/product"; //更新或刪除商品（單筆）
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

export function useAdminProducts() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function fetchAll() {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const apiPath = process.env.NEXT_PUBLIC_API_PATH;
    const token = Cookies.get("access_token");

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const url = `${baseURL}/v2/api/${apiPath}${ADMIN_GET_PRODUCTS_ALL_URL}`;
      const res = await axios.get<AdminProductsAllResponse>(url, {
        headers: {
          Authorization: token,
        },
      });

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

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function editProduct(id: string, data: Partial<AdminProduct>) {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const apiPath = process.env.NEXT_PUBLIC_API_PATH;
    const token = Cookies.get("access_token");

    const url = `${baseURL}/v2/api/${apiPath}${ADMIN_PRODUCT_URL}/${id}`;
    const res = await axios.put<AdminProductResponse>(
      url,
      { data: { id, ...(data as any) } },
      { headers: { Authorization: token } },
    );
    return res.data.product;
  }

  async function deleteProduct(id: string) {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    const apiPath = process.env.NEXT_PUBLIC_API_PATH;
    const token = Cookies.get("access_token");

    const url = `${baseURL}/v2/api/${apiPath}${ADMIN_PRODUCT_URL}/${id}`;
    await axios.delete(url, { headers: { Authorization: token } });
  }

  return {
    products,
    isLoading,
    errorMessage,
    refetch: fetchAll,
    editProduct,
    deleteProduct,
  };
}
