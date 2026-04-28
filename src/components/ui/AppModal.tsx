"use client";

export function AppModal({
  open,
  title,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-zinc-100 px-6 py-4">
          <div className="text-base font-bold text-zinc-900">{title}</div>
          <button
            onClick={onClose}
            className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
          >
            إغلاق
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">{children}</div>

        {footer ? <div className="border-t border-zinc-100 px-6 py-4">{footer}</div> : null}
      </div>
    </div>
  );
}

