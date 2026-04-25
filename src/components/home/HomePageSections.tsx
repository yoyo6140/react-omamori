"use client";

import React, { useMemo, useState } from "react";
import WishesSection from "./WishesSection";
import OmamoriResults, { OmamoriItem, Region } from "./OmamoriResults";
import { useClientProducts } from "@/hooks/useClientProducts";

export default function HomePageSections() {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const { products } = useClientProducts();

  const scrollToResults = () => {
    document.getElementById("omamori-results")?.scrollIntoView({ behavior: "smooth" });
  };

  const items = useMemo<OmamoriItem[]>(
    () =>
      products.map((p) => ({
        id: p.id,
        region: (p.category ?? "其他") as Region,
        locationLabel: p.category ?? "其他",
        title: p.title ?? "",
        category: p.category ?? "—",
        content: p.content ?? "",
        price: Number(p.price ?? 0),
        description: p.description ?? "",
        imageUrl: p.imageUrl,
      })),
    [products],
  );

  return (
    <>
      <WishesSection onPick={scrollToResults} />
      <OmamoriResults
        selectedRegion={selectedRegion}
        items={items}
        onSelectRegion={(r) => {
          setSelectedRegion(r);
          document.getElementById("omamori-results")?.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </>
  );
}
