"use client";

import type { CartStep } from "./types";

type Props = {
  step: CartStep;
  canGoNextFrom1: boolean;
  canGoNextFrom2: boolean;
  onStepDelta: (delta: -1 | 1) => void;
};

export default function CartStepControls({
  step,
  canGoNextFrom1,
  canGoNextFrom2,
  onStepDelta,
}: Props) {
  const canGoNext =
    step === 1 ? canGoNextFrom1 : step === 2 ? canGoNextFrom2 : false;

  return (
    <div className="flex items-center justify-between pt-2">
      <button
        type="button"
        className="text-xs uppercase tracking-widest text-gray-400 transition hover:text-[var(--torii-red)] disabled:opacity-50"
        disabled={step <= 1}
        onClick={() => onStepDelta(-1)}
      >
        上一步
      </button>

      {step < 3 ? (
        <button
          type="button"
          className="bg-[var(--torii-red)] px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-opacity-90 disabled:opacity-50"
          disabled={!canGoNext}
          onClick={() => onStepDelta(1)}
        >
          下一步
        </button>
      ) : null}
    </div>
  );
}
