import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Minus, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
type ApiProduct = {
  id: string;
  title: string;
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

function formatJPY(n: number) {
  return `¥${n.toLocaleString("ja-JP")}`;
}

async function getProductById(id: string): Promise<ApiProduct | undefined> {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const apiPath = process.env.NEXT_PUBLIC_API_PATH;
  const res = await fetch(`${baseURL}/v2/api/${apiPath}/products/all`, {
    cache: "no-store",
  });
  if (!res.ok) return undefined;
  const data = (await res.json()) as { success: boolean; products?: ApiProduct[] };
  const list = data.products ?? [];
  return list.find((p) => String(p.id) === String(id));
}

export default async function InfoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product?.id) return notFound();

  const shrineLine = [product.category, product.content].filter(Boolean).join("・") || "—";
  const priceJPY = Number(product.price ?? 0);
  const stock = Number(product.num ?? 0);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--off-white)] text-[var(--sumi-black)]">
      <Navbar />
      <main
        className="flex w-full flex-1 flex-col items-center px-4"
        style={{
          boxSizing: "border-box",
          paddingTop: 96,
          paddingBottom: 48,
        }}
      >
        <div
          className="grid w-full grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16"
          style={{ maxWidth: 1152, marginInline: "auto", boxSizing: "border-box" }}
        >
          <div className="space-y-6">
            <div
              className="relative overflow-hidden rounded-sm bg-gray-50"
              style={{
                width: "100%",
                maxWidth: 400,
                aspectRatio: "4 / 5",
                marginInline: "auto",
              }}
            >
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              ) : (
                <div
                  className="flex items-center justify-center text-sm text-gray-400"
                  style={{ width: "100%", height: "100%", minHeight: 200 }}
                >
                  尚無商品圖
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="border-b border-gray-100 pb-8">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold tracking-widest text-[var(--torii-red)]">
                <MapPin className="h-6 w-6 shrink-0" aria-hidden />
                <span className="text-2xl">{product.category}</span>
              </div>
              <h1 className="mb-4 font-serif text-4xl font-bold leading-tight sm:text-5xl">
                {product.title}
              </h1>
              <p className="mb-6 text-2xl font-light text-gray-500">
                {formatJPY(priceJPY)}
                <span className="ml-2 text-sm text-gray-400">（含稅）</span>
              </p>
              <div className="flex flex-wrap  text-xl gap-4">
                <span className="border border-gray-200 px-3 py-1  uppercase tracking-widest">
                  {product.content}
                </span>
              </div>
            </div>

            <div className="space-y-8 py-8">
              <div className="space-y-4">
                <p className=" text-2xl mt-4">{product.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-8 text-sm">
                <div className="space-y-2">
                  <p className="text-xl uppercase tracking-widest text-gray-400">數量</p>
                  <p className="text-xl tabular-nums">{product.num}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xl uppercase tracking-widest text-gray-400">單位</p>
                  <p className="text-xl">{product.unit}</p>
                </div>
              </div>

              <div className="pt-8">
                <div className=" mb-8 flex flex-wrap items-center gap-6">
                  <div className="flex items-center rounded-sm border border-gray-200">
                    <button type="button" className="px-4 py-2 transition hover:bg-gray-100">
                      <Minus className="w-6 h-6 cursor-pointer" />
                    </button>
                    <span className="border-x border-gray-200 px-6 py-2">1</span>
                    <button type="button" className="px-4 py-2 transition hover:bg-gray-100">
                      <Plus className="w-6 h-6 cursor-pointer" />
                    </button>
                  </div>
                  <p className=" italic text-gray-400">庫存僅剩 {product.num} 枚</p>
                </div>
                <Button className="w-full">
                  <Link
                    href="/carts"
                    className="block w-full bg-[var(--torii-red)] py-5 text-center text-sm font-bold uppercase tracking-widest text-white shadow-lg transition hover:opacity-90"
                  >
                    立即結緣
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
