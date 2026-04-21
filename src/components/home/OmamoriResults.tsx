"use client";

import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export type Region = "關東" | "關西" | "九州" | "北海道";
const REGIONS: Region[] = ["關東", "關西", "九州", "北海道"];

export type OmamoriItem = {
  id: string;
  region: Region;
  locationLabel: string;
  title: string;
  shrine: string;
  priceJPY: number;
  description: string;
};

function formatJPY(n: number) {
  return `¥${n.toLocaleString("ja-JP")}`;
}

export default function OmamoriResults({
  selectedRegion,
  items,
  onSelectRegion,
}: {
  selectedRegion: Region | null;
  items: OmamoriItem[];
  onSelectRegion?: (region: Region | null) => void;
}) {
  const visibleItems = useMemo(
    () => (selectedRegion ? items.filter((i) => i.region === selectedRegion) : items),
    [items, selectedRegion],
  );

  return (
    <section id="omamori-results" className="w-full md:pt-2 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col gap-2">
          <div className="text-lg text-gray-500">
            <span className="hover:text-[var(--torii-red)] transition cursor-default">
              御守地圖
            </span>
            <span className="mx-2">/</span>
            <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
              {REGIONS.map((r) => {
                const active = selectedRegion === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => onSelectRegion?.(active ? null : r)}
                    className={[
                      "transition cursor-pointer",
                      active
                        ? "text-[var(--torii-red)] font-semibold underline underline-offset-4"
                        : "hover:text-[var(--torii-red)]",
                    ].join(" ")}
                  >
                    {r}
                  </button>
                );
              })}
            </span>
          </div>

          <div className="flex items-end justify-between gap-4 flex-wrap">
            <h3 className="text-2xl md:text-3xl font-bold font-serif">御守展示</h3>
            <div className="text-sm text-gray-500">
              {selectedRegion ? `顯示「${selectedRegion}」` : "顯示全部地區"}・共{" "}
              {visibleItems.length} 件
            </div>
          </div>
        </div>

        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent>
            {visibleItems.map((item) => (
              <CarouselItem key={item.id} className="basis-full sm:basis-1/3 lg:basis-1/4">
                <div className="mx-[10px]">
                  <Card className="border-t-4 border-t-[var(--torii-red)] h-[420px] sm:h-[430px] md:h-[460px]">
                    <CardContent className="p-4 md:p-5 h-full flex flex-col">
                      <div className="bg-gray-50 mb-4 overflow-hidden relative group rounded-lg h-44 sm:h-52 md:h-[260px]">
                        <div className="absolute top-4 right-4 px-3 py-1 bg-[var(--torii-red)] text-white text-[10px] tracking-widest">
                          {item.locationLabel}
                        </div>
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-50 transition duration-700 group-hover:scale-[1.02]" />
                      </div>

                      <div className="space-y-4 flex-1 min-h-0">
                        <div className="flex justify-between items-start gap-6">
                          <div>
                            <h4 className="text-xl md:text-2xl font-bold font-serif">
                              {item.title}
                            </h4>
                            <p className="text-sm text-[var(--torii-red)] font-medium">
                              {item.shrine}
                            </p>
                          </div>
                          <span className="text-lg md:text-xl font-bold">
                            {formatJPY(item.priceJPY)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed italic overflow-hidden">
                          {item.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="inline-flex h-9 w-9 md:h-10 md:w-10" />
          <CarouselNext className="inline-flex h-9 w-9 md:h-10 md:w-10" />
        </Carousel>
      </div>
    </section>
  );
}
