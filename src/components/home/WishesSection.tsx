import React from "react";
import { Coins, GraduationCap, Heart, ShieldCheck } from "lucide-react";

const wishes = [
  {
    title: "緣結",
    subtitle: "Love & Connection",
    Icon: Heart,
    tint: "bg-red-50",
    hover: "group-hover:bg-[var(--torii-red)]",
  },
  {
    title: "學業",
    subtitle: "Success & Wisdom",
    Icon: GraduationCap,
    tint: "bg-blue-50",
    hover: "group-hover:bg-blue-600",
  },
  {
    title: "財運",
    subtitle: "Wealth & Fortune",
    Icon: Coins,
    tint: "bg-yellow-50",
    hover: "group-hover:bg-yellow-600",
  },
  {
    title: "健康",
    subtitle: "Health & Peace",
    Icon: ShieldCheck,
    tint: "bg-green-50",
    hover: "group-hover:bg-green-600",
  },
];

export default function WishesSection({ onPick }: { onPick?: () => void }) {
  return (
    <section id="wishes" className="w-full py-2 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold font-serif">您在尋找什麼樣的守護？</h2>
          <div className="w-20 h-1 bg-[var(--torii-red)] mx-auto" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16">
          {wishes.map(({ title, subtitle, Icon }) => (
            <div key={title} className="group text-center p-8 md:p-12 border border-gray-100 ">
              <div
                className={
                  "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transition-all"
                }
              >
                <Icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2 font-serif">{title}</h3>
              <p className="text-xs text-gray-400 tracking-widest">{subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
