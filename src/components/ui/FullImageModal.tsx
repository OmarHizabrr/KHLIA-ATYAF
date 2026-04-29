"use client";

import Image from "next/image";
import { useEffect } from "react";

export function FullImageModal({
  open,
  src,
  alt,
  onClose,
}: {
  open: boolean;
  src: string;
  alt: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="absolute inset-0 p-4"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق الصورة"
          className="absolute right-4 top-4 z-10 rounded-full bg-black/30 px-3 py-2 text-sm font-bold text-white hover:bg-black/50"
        >
          إغلاق
        </button>

        <div className="relative mx-auto h-full w-full max-w-5xl">
          <Image src={src} alt={alt} fill className="object-contain" sizes="100vw" />
        </div>
      </div>
    </div>
  );
}

