"use client";

import { AppModal } from "@/components/ui/AppModal";
import { AppButton } from "@/components/ui/AppButton";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "تأكيد",
  cancelText = "إلغاء",
  onConfirm,
  onCancel,
  busy = false,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
}) {
  return (
    <AppModal
      open={open}
      title={title}
      onClose={onCancel}
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <AppButton
            onClick={onCancel}
            variant="secondary"
            size="sm"
          >
            {cancelText}
          </AppButton>
          <AppButton
            onClick={onConfirm}
            loading={busy}
            variant="danger"
            size="sm"
          >
            {confirmText}
          </AppButton>
        </div>
      }
    >
      <p className="text-sm leading-7 text-zinc-600">{description}</p>
    </AppModal>
  );
}

