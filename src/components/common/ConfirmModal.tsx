import React from "react";
import { Button } from "@/components/ui/button";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
  disabled?: boolean;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
};

export default function ConfirmModal({
  open,
  title,
  description,
  cancelText = "取消",
  confirmText = "確認",
  disabled = false,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-black/10 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-lg font-bold">{title}</div>
        {description ? <div className="mt-2 text-sm text-black/70">{description}</div> : null}

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} disabled={disabled}>
            {cancelText}
          </Button>
          <Button onClick={onConfirm} disabled={disabled}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
