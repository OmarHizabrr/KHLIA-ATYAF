"use client";

import Image from "next/image";
import { useEffect, useMemo } from "react";

export function ImagePickerField({
  label = "الصورة",
  file,
  existingUrl,
  onChangeFile,
  onClearFile,
  onClearExisting,
}: {
  label?: string;
  file: File | null;
  existingUrl?: string;
  onChangeFile: (file: File | null) => void;
  onClearFile: () => void;
  onClearExisting: () => void;
}) {
  const localPreview = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const preview = localPreview || existingUrl || "";

  return (
    <div className="grid gap-2 text-sm font-semibold text-zinc-800">
      <div>{label}</div>
      <label className="flex h-12 cursor-pointer items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white px-4 text-xs font-semibold text-zinc-600 hover:bg-zinc-50">
        {preview ? "استبدال الصورة" : "اختيار صورة"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onChangeFile(e.target.files?.[0] ?? null)}
        />
      </label>

      {preview ? (
        <div className="mt-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
          <div className="relative h-36 w-full overflow-hidden rounded-xl bg-zinc-100 p-1">
            <Image src={preview} alt="preview" fill className="object-contain" />
          </div>
          <div className="mt-2 text-xs text-zinc-500">
            {file ? `معاينة قبل الحفظ: ${file.name}` : "هذه هي الصورة المحفوظة حاليا."}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {file ? (
              <button
                type="button"
                onClick={onClearFile}
                className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100"
              >
                حذف المعاينة الجديدة
              </button>
            ) : null}
            {!file && existingUrl ? (
              <button
                type="button"
                onClick={onClearExisting}
                className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
              >
                حذف الصورة الحالية
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

