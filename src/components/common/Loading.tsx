import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type LoadingProps = {
  /**
   * 顯示在轉圈圈下方的文字（可省略）。
   */
  label?: string | null;
  /**
   * 是否覆蓋整個畫面並置中顯示（常用於頁面載入）。
   */
  fullScreen?: boolean;
  /**
   * 轉圈圈大小（px）。
   */
  size?: number;
  className?: string;
};

export function LoadingSpinner({
  size = 24,
  className,
}: Pick<LoadingProps, "size" | "className">) {
  return (
    <Loader2
      aria-hidden="true"
      className={cn("animate-spin text-black/55", className)}
      style={{ width: size, height: size }}
    />
  );
}

export default function Loading({
  label = "載入中…",
  fullScreen = false,
  size = 28,
  className,
}: LoadingProps) {
  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <LoadingSpinner size={size} />
      {label ? <div className="text-sm text-black/60">{label}</div> : null}
    </div>
  );

  if (!fullScreen) return content;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[var(--off-white)]/70 backdrop-blur-[2px]">
      {content}
    </div>
  );
}

