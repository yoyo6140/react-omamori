"use client";

import type { CartStep } from "./types";

type Props = {
  step: CartStep;
  onStepChange: (step: CartStep) => void;
  canGoNextFrom1: boolean;
  canGoNextFrom2: boolean;
};

export default function CartStepTabs({
  step,
  onStepChange,
  canGoNextFrom1,
  canGoNextFrom2,
}: Props) {
  const tabClass = (active: boolean) =>
    [
      "pb-4 px-2",
      active ? "text-[var(--torii-red)] border-b-2 border-b-[var(--torii-red)]" : "",
    ].join(" ");

  return (
    <div className="mb-16 flex justify-center space-x-20 text-xs font-bold uppercase tracking-[0.2em] text-gray-300">
      <button type="button" className={tabClass(step === 1)} onClick={() => onStepChange(1)}>
        01 願望籃
      </button>
      <button
        type="button"
        className={tabClass(step === 2)}
        onClick={() => {
          if (!canGoNextFrom1) return;
          onStepChange(2);
        }}
      >
        02 寄送資訊
      </button>
      <button
        type="button"
        className={tabClass(step === 3)}
        onClick={() => {
          if (!canGoNextFrom1 || !canGoNextFrom2) return;
          onStepChange(3);
        }}
      >
        03 結帳
      </button>
    </div>
  );
}
