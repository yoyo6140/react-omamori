import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Award, BookOpen, Heart, MapPin, Shield, Truck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Detail = {
  id: string;
  regionLabel: string;
  breadcrumbCategoryLabel: string;
  locationLabel: string;
  shrine: string;
  title: string;
  priceJPY: number;
  badges: string[];
  story: string;
  material: string;
  size: string;
  stock: number;
  images: string[];
};

function formatJPY(n: number) {
  return `¥${n.toLocaleString("ja-JP")}`;
}

const DETAILS: Record<string, Detail> = {
  "kansai-2": {
    id: "kansai-2",
    regionLabel: "神戶・湊川神社",
    breadcrumbCategoryLabel: "學業/事業",
    locationLabel: "關西 / 春日大社",
    shrine: "湊川神社",
    title: "正成公勝利守",
    priceJPY: 1200,
    badges: ["學業成就", "必勝祈願"],
    story:
      "楠木正成公（大楠公）是日本著名的武將，以誠實與智慧著稱。此御守源自其奉祀之地——湊川神社。御守內封存了神社神職人員親自加持的靈力，祈求在人生重要的「勝負時刻」能獲得正成公的勇氣與決斷力。",
    material: "高級西陣織錦緞",
    size: "H 80mm × W 50mm",
    stock: 12,
    images: [
      "https://images.unsplash.com/photo-1571404170131-7e8c0e664b30?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=200&auto=format&fit=crop",
    ],
  },
};

export default function InfoPage({ params }: { params: { id: string } }) {
  const detail = DETAILS[params.id];
  if (!detail) return notFound();

  return (
    <div className="min-h-screen bg-[var(--off-white)] text-[var(--sumi-black)]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-8 py-12">
        <nav className="flex text-xs tracking-widest uppercase mb-12 text-gray-400">
          <Link href="/home" className="hover:text-[var(--torii-red)]">
            首頁
          </Link>
          <span className="mx-3 text-gray-300">/</span>
          <Link href="/home#wishes" className="hover:text-[var(--torii-red)]">
            {detail.breadcrumbCategoryLabel}
          </Link>
          <span className="mx-3 text-gray-300">/</span>
          <span className="text-[var(--torii-red)]">{detail.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-6">
            <div className="aspect-[4/5] bg-gray-50 overflow-hidden rounded-sm relative">
              <img
                src={detail.images[0]}
                className="w-full h-full object-cover"
                alt={`${detail.title} 詳情`}
              />
              <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-sm text-[var(--torii-red)] text-xs font-bold tracking-widest shadow-sm">
                特選・限量
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {detail.images.slice(0, 3).map((src, idx) => (
                <div
                  key={src}
                  className={[
                    "aspect-square bg-gray-100 cursor-pointer overflow-hidden",
                    idx === 0
                      ? "border-2 border-[var(--torii-red)]"
                      : "opacity-50 hover:opacity-100 transition",
                  ].join(" ")}
                >
                  <img src={src} className="w-full h-full object-cover" alt={`${detail.title} 縮圖`} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="pb-8 border-b border-gray-100">
              <div className="flex items-center space-x-2 text-[var(--torii-red)] text-sm font-bold tracking-widest mb-4">
                <MapPin className="w-4 h-4" />
                <span>{detail.regionLabel}</span>
              </div>
              <h1 className="text-5xl font-bold mb-4 font-serif">{detail.title}</h1>
              <p className="text-2xl font-light text-gray-500 mb-6">
                {formatJPY(detail.priceJPY)}{" "}
                <span className="text-sm text-gray-400 ml-2">(含稅)</span>
              </p>
              <div className="flex space-x-4">
                {detail.badges.map((b) => (
                  <span
                    key={b}
                    className="px-3 py-1 border border-gray-200 text-[10px] tracking-widest uppercase"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>

            <div className="py-8 space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-[var(--torii-red)]" />
                  <span>御守故事</span>
                </h3>
                <p className="text-gray-600 leading-relaxed italic">{detail.story}</p>
              </div>

              <div className="grid grid-cols-2 gap-8 text-sm">
                <div className="space-y-2">
                  <p className="text-gray-400 uppercase tracking-widest text-[10px]">材質</p>
                  <p>{detail.material}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400 uppercase tracking-widest text-[10px]">尺寸</p>
                  <p>{detail.size}</p>
                </div>
              </div>

              <div className="pt-8">
                <div className="flex items-center space-x-6 mb-8">
                  <div className="flex items-center border border-gray-200 rounded-sm">
                    <button className="px-4 py-2 hover:bg-gray-100 transition" type="button">
                      -
                    </button>
                    <span className="px-6 py-2 border-x border-gray-200">1</span>
                    <button className="px-4 py-2 hover:bg-gray-100 transition" type="button">
                      +
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 italic">庫存僅剩 {detail.stock} 枚</p>
                </div>
                <div className="flex space-x-4">
                  <Link
                    href="/carts"
                    className="flex-1 bg-[var(--torii-red)] text-white py-5 text-center text-sm font-bold tracking-widest uppercase hover:bg-opacity-90 transition shadow-lg"
                  >
                    立即結緣
                  </Link>
                  <button className="px-6 py-5 border border-[var(--torii-red)] text-[var(--torii-red)] hover:bg-[var(--torii-red)] hover:text-white transition">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-12 grid grid-cols-3 gap-4 border-t border-gray-100">
              <div className="text-center space-y-2">
                <Truck className="w-5 h-5 mx-auto text-gray-300" />
                <p className="text-[10px] uppercase tracking-widest">日本直送</p>
              </div>
              <div className="text-center space-y-2">
                <Award className="w-5 h-5 mx-auto text-gray-300" />
                <p className="text-[10px] uppercase tracking-widest">神社正品</p>
              </div>
              <div className="text-center space-y-2">
                <Shield className="w-5 h-5 mx-auto text-gray-300" />
                <p className="text-[10px] uppercase tracking-widest">加持守護</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

