export type CartStep = 1 | 2 | 3;

export type CartItem = {
  id: string;
  shrine: string;
  title: string;
  usage: string;
  priceJPY: number;
  quantity: number;
  imageUrl: string;
};
