"use client";

import React, { useEffect, useMemo, useRef } from "react";

type SakuraPetal = {
  left: string;
  delay: string;
  duration: string;
  size: string;
};

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function Sakura({ count = 30 }: { count?: number }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const petals = useMemo<SakuraPetal[]>(
    () =>
      Array.from({ length: count }, () => ({
        left: `${randomBetween(0, 100)}vw`,
        delay: `${randomBetween(0, 10)}s`,
        duration: `${randomBetween(10, 15)}s`,
        size: `${randomBetween(5, 15)}px`,
      })),
    [count]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.replaceChildren();

    const fragment = document.createDocumentFragment();
    for (const p of petals) {
      const petal = document.createElement("div");
      petal.className = "sakura";
      petal.style.left = p.left;
      petal.style.animationDelay = p.delay;
      petal.style.animationDuration = p.duration;
      petal.style.width = p.size;
      petal.style.height = p.size;
      fragment.appendChild(petal);
    }
    el.appendChild(fragment);

    return () => {
      el.replaceChildren();
    };
  }, [petals]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
    />
  );
}

