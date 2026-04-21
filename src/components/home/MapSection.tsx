import React from "react";

export default function MapSection() {
  return (
    <section id="map" className="w-full py-28 bg-[#FFD1DC] text-[#6A4040]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight font-serif">
            尋訪山海間的
            <br />
            靈性之地
          </h2>
          <p className="text-lg opacity-80 leading-relaxed font-light">
            透過互動地圖，探索全日本合作神社。點擊地區即可查看該地的專屬御守與神社歷史故事。
          </p>

          <div className="flex flex-wrap gap-3">
            {["關東", "關西", "九州", "北海道"].map((label) => (
              <button
                key={label}
                type="button"
                className="px-6 py-2 border border-[#6A4040]/30 rounded-full hover:bg-white hover:text-[#FFD1DC] transition cursor-pointer"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative w-64 h-64 md:w-80 md:h-80 bg-white/20 rounded-full flex items-center justify-center p-8 overflow-hidden">
            <div className="w-full h-full rounded-full opacity-60 mix-blend-overlay bg-gradient-to-br from-white/70 to-white/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 border-2 border-white/50 rounded-full animate-ping" />
              <div className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_20px_#fff]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

