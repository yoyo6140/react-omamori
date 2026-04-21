import React from "react";
import { Coins, GraduationCap, Heart, ShieldCheck } from "lucide-react";

const wishes = [
  { title: "緣結", subtitle: "Love & Connection", Icon: Heart, tint: "bg-red-50", hover: "group-hover:bg-[var(--torii-red)]" },
  { title: "學業", subtitle: "Success & Wisdom", Icon: GraduationCap, tint: "bg-blue-50", hover: "group-hover:bg-blue-600" },
  { title: "財運", subtitle: "Wealth & Fortune", Icon: Coins, tint: "bg-yellow-50", hover: "group-hover:bg-yellow-600" },
  { title: "健康", subtitle: "Health & Peace", Icon: ShieldCheck, tint: "bg-green-50", hover: "group-hover:bg-green-600" },
];

export default function WishesSection() {
  return (
    <section id="wishes" className="w-full py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold font-serif">您在尋找什麼樣的守護？</h2>
          <div className="w-20 h-1 bg-[var(--torii-red)] mx-auto" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16">
          {wishes.map(({ title, subtitle, Icon, tint, hover }) => (
            <button
              key={title}
              type="button"
              className="group text-center p-8 md:p-12 border border-gray-100 hover:border-[var(--gold)] transition-all duration-700 bg-white/60"
            >
              <div
                className={[
                  "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transition-all",
                  tint,
                  hover,
                  "group-hover:text-white",
                ].join(" ")}
              >
                <Icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2 font-serif">{title}</h3>
              <p className="text-xs text-gray-400 tracking-widest">{subtitle}</p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-500 border-t-4 border-[var(--torii-red)]">
            <div className="aspect-[3/4] bg-gray-50 mb-8 overflow-hidden relative">
              <div className="absolute top-4 right-4 px-3 py-1 bg-[var(--torii-red)] text-white text-[10px] tracking-widest">
                京都 / 伏見稻荷
              </div>
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-50" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-6">
                <div>
                  <h3 className="text-2xl font-bold font-serif">正成公勝利守</h3>
                  <p className="text-sm text-[var(--torii-red)] font-medium">湊川神社</p>
                </div>
                <span className="text-xl font-bold">¥1,200</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed italic">
                「源自日本南北朝名將楠木正成公的英魂守護，祈求事業與競賽中勇往直前。」
              </p>
            </div>
          </div>

          <div className="bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-500 border-t-4 border-[var(--torii-red)]">
            <div className="aspect-[3/4] bg-gray-50 mb-8 overflow-hidden relative">
              <div className="absolute top-4 right-4 px-3 py-1 bg-[var(--torii-red)] text-white text-[10px] tracking-widest">
                東京 / 明治神宮
              </div>
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-50" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-6">
                <div>
                  <h3 className="text-2xl font-bold font-serif">緣結紅絲守</h3>
                  <p className="text-sm text-[var(--torii-red)] font-medium">東京大神宮</p>
                </div>
                <span className="text-xl font-bold">¥1,500</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed italic">
                「以傳統工藝編織的紅線，為您聯繫生命中最重要的那個人。」
              </p>
            </div>
          </div>

          <div className="bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-500 border-t-4 border-[var(--torii-red)]">
            <div className="aspect-[3/4] bg-gray-50 mb-8 overflow-hidden relative">
              <div className="absolute top-4 right-4 px-3 py-1 bg-[var(--torii-red)] text-white text-[10px] tracking-widest">
                關西 / 春日大社
              </div>
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-50" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-6">
                <div>
                  <h3 className="text-2xl font-bold font-serif">白鹿安產守</h3>
                  <p className="text-sm text-[var(--torii-red)] font-medium">春日大社</p>
                </div>
                <span className="text-xl font-bold">¥1,800</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed italic">「神的使者白鹿，細心呵護新生命的降臨，祈求母子平安喜樂。」</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

