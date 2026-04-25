import React from "react";
import Image from "next/image";
import { SuccessIcon } from "@/asset/icon";
import { XIcon } from "lucide-react";
type SuccessModalProps = {
  open: boolean;
  title?: string;
  onConfirm: () => void;
};

export default function SuccessModal({ open, title, onConfirm }: SuccessModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-4">
      <div
        className="relative w-full max-w-md rounded-2xl bg-white shadow-xl border border-black/10 p-14"
        onClick={(e) => e.stopPropagation()}
      >
        <XIcon className="w-6 h-6 absolute top-2 right-2 cursor-pointer" onClick={onConfirm} />
        <div className="flex w-full flex-col items-center justify-center text-center gap-3">
          <Image src={SuccessIcon} alt="success" width={40} height={40} />
          <div className="text-lg font-bold">{title}</div>
        </div>
      </div>
    </div>
  );
}
