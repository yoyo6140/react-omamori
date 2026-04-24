export type CartStep = 1 | 2 | 3;

/** 購物車列：商品欄位命名與後端商品 / 購物車 API（qty）一致 */
export type CartItem = {
  id: string;
  serverCartId?: string;
  category: string;
  title: string;
  content: string;
  price: number;
  qty: number;
  imageUrl: string;
  description?: string;
  unit?: string;
};
