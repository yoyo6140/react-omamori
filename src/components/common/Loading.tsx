import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type LoadingProps = {
  label?: string | null;
  fullScreen?: boolean;
  size?: number;
  className?: string;
};

export function LoadingSpinner({ size = 24, className }: Pick<LoadingProps, "size" | "className">) {
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
