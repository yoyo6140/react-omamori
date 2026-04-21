"use client";

import React, { useMemo, useState } from "react";
import WishesSection from "./WishesSection";
import OmamoriResults, { OmamoriItem, Region } from "./OmamoriResults";

export default function HomePageSections() {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  const scrollToResults = () => {
    document.getElementById("omamori-results")?.scrollIntoView({ behavior: "smooth" });
  };

  const items = useMemo<OmamoriItem[]>(
    () => [
      {
        id: "kanto-1",
        region: "關東",
        locationLabel: "東京 / 明治神宮",
        title: "緣結紅絲守",
        shrine: "東京大神宮",
        priceJPY: 1500,
        description: "「以傳統工藝編織的紅線，為您聯繫生命中最重要的那個人。」",
      },
      {
        id: "kansai-1",
        region: "關西",
        locationLabel: "關西 / 春日大社",
        title: "白鹿安產守",
        shrine: "春日大社",
        priceJPY: 1800,
        description: "「神的使者白鹿，細心呵護新生命的降臨，祈求母子平安喜樂。」",
      },
      {
        id: "kansai-2",
        region: "關西",
        locationLabel: "京都 / 伏見稻荷",
        title: "正成公勝利守",
        shrine: "湊川神社",
        priceJPY: 1200,
        description: "「源自日本南北朝名將楠木正成公的英魂守護，祈求事業與競賽中勇往直前。」",
      },
      {
        id: "kyushu-1",
        region: "九州",
        locationLabel: "九州 / 太宰府",
        title: "學業合格守",
        shrine: "太宰府天滿宮",
        priceJPY: 1300,
        description: "「為重要考試與學習之路守護，願你每一次努力都有回響。」",
      },
      {
        id: "hokkaido-1",
        region: "北海道",
        locationLabel: "北海道 / 札幌",
        title: "雪國平安守",
        shrine: "北海道神宮",
        priceJPY: 1400,
        description: "「願旅途平安、日常安穩，如雪般靜好。」",
      },
    ],
    [],
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
