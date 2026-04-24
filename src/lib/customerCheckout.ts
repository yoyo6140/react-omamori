import axios from "axios";

function apiRoot() {
  const baseURL =
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://vue3-course-api.hexschool.io";
  const apiPath = process.env.NEXT_PUBLIC_API_PATH ?? "react-omamori-api";
  return { baseURL, prefix: `${baseURL}/v2/api/${apiPath}` };
}

export type CheckoutUser = {
  name: string;
  email: string;
  tel: string;
  address: string;
};

export type CartLineForSync = {
  product_id: string;
  qty: number;
};

type OrderResponse = {
  success: boolean;
  message?: string;
  orderId?: string;
};

/** 清空伺服器購物車（可略過失敗，例如本來就空） */
export async function clearServerCart() {
  const { prefix } = apiRoot();
  try {
    await axios.delete(`${prefix}/carts`);
  } catch {
    /* ignore */
  }
}

/** 單筆加入購物車（相同 product 會合併數量） */
export async function addServerCartLine(product_id: string, qty: number) {
  const { prefix } = apiRoot();
  const res = await axios.post(`${prefix}/cart`, {
    data: { product_id, qty },
  });
  if (!res.data?.success) {
    throw new Error(res.data?.message ?? "加入購物車失敗");
  }
}

/** 以本地列表明細覆寫伺服器購物車後建立訂單 */
export async function createCustomerOrder(user: CheckoutUser, message: string) {
  const { prefix } = apiRoot();
  const res = await axios.post<OrderResponse>(`${prefix}/order`, {
    data: { user, message },
  });
  if (!res.data?.success) {
    throw new Error(res.data?.message ?? "建立訂單失敗");
  }
  return res.data.orderId as string;
}

export async function payCustomerOrder(orderId: string) {
  const { prefix } = apiRoot();
  const res = await axios.post<{ success: boolean; message?: string }>(
    `${prefix}/pay/${orderId}`,
  );
  if (!res.data?.success) {
    throw new Error(res.data?.message ?? "付款失敗");
  }
}

/** 同步購物車 → 建立訂單 → 模擬付款完成 */
export async function checkoutWithLines(
  lines: CartLineForSync[],
  user: CheckoutUser,
  message = "拾守官網結帳",
) {
  await clearServerCart();
  for (const line of lines) {
    await addServerCartLine(line.product_id, line.qty);
  }
  const orderId = await createCustomerOrder(user, message);
  await payCustomerOrder(orderId);
  return orderId;
}
