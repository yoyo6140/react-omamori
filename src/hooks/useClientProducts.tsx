"use client";

import { useEffect, useState } from "react";
import axios from "axios";

// Client (前台) 商品列表 / 單筆
const CLIENT_PRODUCTS_URL = "/products";
const CLIENT_PRODUCT_URL = "/product";

export type ClientProduct = {
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
  [key: string]: any;
};

type ClientProductsResponse = {
  success: boolean;
  products: ClientProduct[];
  pagination?: {
    total_pages: number;
    current_page: number;
    has_pre?: boolean;
    has_next?: boolean;
    category?: string;
  };
};

type ClientProductResponse = {
  success: boolean;
  product: ClientProduct;
};

export function useClientProducts() {
  const [products, setProducts] = useState<ClientProduct[]>([]);
  const [pagination, setPagination] = useState<ClientProductsResponse["pagination"] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function fetchPage(page = 1, category?: string) {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://vue3-course-api.hexschool.io";
    const apiPath = process.env.NEXT_PUBLIC_API_PATH ?? "react-omamori-api";

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const url =
        `${baseURL}/v2/api/${apiPath}${CLIENT_PRODUCTS_URL}?page=${page}` +
        (category ? `&category=${encodeURIComponent(category)}` : "");

      const res = await axios.get<ClientProductsResponse>(url);
      setProducts(res.data?.products ?? []);
      setPagination(res.data?.pagination ?? null);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message ?? err?.message ?? "取得商品列表失敗");
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchById(id: string) {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://vue3-course-api.hexschool.io";
    const apiPath = process.env.NEXT_PUBLIC_API_PATH ?? "react-omamori-api";
    const url = `${baseURL}/v2/api/${apiPath}${CLIENT_PRODUCT_URL}/${id}`;
    const res = await axios.get<ClientProductResponse>(url);
    return res.data.product;
  }

  useEffect(() => {
    fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    products,
    pagination,
    isLoading,
    errorMessage,
    fetchPage,
    refetch: fetchPage,
    fetchById,
  };
}

//送出訂單post到後端
