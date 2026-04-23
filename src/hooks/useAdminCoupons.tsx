import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const ADMIN_COUPONS_URL = "/admin/coupons"; // GET 全部優惠券
const ADMIN_COUPON_URL = "/admin/coupon"; // POST 新增、PUT/DELETE 單筆

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const apiPath = process.env.NEXT_PUBLIC_API_PATH;
const token = Cookies.get("access_token");

export type AdminCoupon = {
  id: string;
  title: string;
  code: string;
  percent: number;
  due_date: number; // unix seconds
  is_enabled: 0 | 1;
  [key: string]: any;
};

type AdminCouponsResponse = {
  success: boolean;
  coupons: AdminCoupon[];
};

type AdminCouponResponse = {
  success: boolean;
  coupon: AdminCoupon;
  message?: string;
};

export function useAdminCoupons() {
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function fetchAll() {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const url = `${baseURL}/v2/api/${apiPath}${ADMIN_COUPONS_URL}`;
      const res = await axios.get<AdminCouponsResponse>(url, {
        headers: { Authorization: token },
      });
      setCoupons(res.data?.coupons ?? []);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message ?? err?.message ?? "取得優惠券列表失敗");
    } finally {
      setIsLoading(false);
    }
  }

  async function addCoupon(data: Omit<AdminCoupon, "id">) {
    const url = `${baseURL}/v2/api/${apiPath}${ADMIN_COUPON_URL}`;
    const res = await axios.post<AdminCouponResponse>(
      url,
      { data: { ...(data as any) } },
      { headers: { Authorization: token } },
    );
    return res.data?.coupon;
  }

  async function editCoupon(id: string, data: Partial<AdminCoupon>) {
    const url = `${baseURL}/v2/api/${apiPath}${ADMIN_COUPON_URL}/${id}`;
    const res = await axios.put<AdminCouponResponse>(
      url,
      { data: { ...(data as any) } },
      { headers: { Authorization: token } },
    );
    return res.data?.coupon;
  }

  async function deleteCoupon(id: string) {
    const url = `${baseURL}/v2/api/${apiPath}${ADMIN_COUPON_URL}/${id}`;
    await axios.delete(url, { headers: { Authorization: token } });
  }

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    coupons,
    isLoading,
    errorMessage,
    refetch: fetchAll,
    addCoupon,
    editCoupon,
    deleteCoupon,
  };
}
