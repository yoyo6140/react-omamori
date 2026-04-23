import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const ADMIN_ORDERS_URL = "/admin/orders"; // 取得訂單列表（分頁）
const ADMIN_ORDER_URL = "/admin/order"; // 取得/修改/刪除單筆

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const apiPath = process.env.NEXT_PUBLIC_API_PATH;
const token = Cookies.get("access_token");

export type AdminOrderProductItem = {
  id: string;
  product_id: string;
  qty: number | string;
  [key: string]: any;
};

export type AdminOrder = {
  id: string;
  create_at: number;
  is_paid: boolean;
  message?: string;
  products: Record<string, AdminOrderProductItem>;
  user: {
    name: string;
    email: string;
    tel: string;
    address: string;
    [key: string]: any;
  };
  num: number;
  [key: string]: any;
};

type AdminOrdersPagedResponse = {
  success: boolean;
  orders: AdminOrder[];
  pagination?: {
    total_pages: number;
    current_page: number;
    has_pre?: boolean;
    has_next?: boolean;
    category?: string;
  };
};

type AdminOrderResponse = {
  success: boolean;
  order: AdminOrder;
};

export function useAdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pagination, setPagination] = useState<AdminOrdersPagedResponse["pagination"] | null>(null);

  async function fetchPage(page = 1) {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const url = `${baseURL}/v2/api/${apiPath}${ADMIN_ORDERS_URL}?page=${page}`;
      const res = await axios.get<AdminOrdersPagedResponse>(url, {
        headers: { Authorization: token },
      });
      setOrders(res.data?.orders ?? []);
      setPagination(res.data?.pagination ?? null);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message ?? err?.message ?? "取得訂單列表失敗");
    } finally {
      setIsLoading(false);
    }
  }

  async function editOrder(id: string, data: Partial<AdminOrder>) {
    const url = `${baseURL}/v2/api/${apiPath}${ADMIN_ORDER_URL}/${id}`;
    const res = await axios.put<AdminOrderResponse>(
      url,
      { data: { ...(data as any) } },
      { headers: { Authorization: token } },
    );
    return res.data.order;
  }

  async function deleteOrder(id: string) {
    const url = `${baseURL}/v2/api/${apiPath}${ADMIN_ORDER_URL}/${id}`;
    await axios.delete(url, { headers: { Authorization: token } });
  }

  useEffect(() => {
    fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    orders,
    isLoading,
    errorMessage,
    pagination,
    fetchPage,
    refetch: fetchPage,
    editOrder,
    deleteOrder,
  };
}
