"use client";

export function LoadingState({ text = "جاري التحميل…" }: { text?: string }) {
  return <div className="text-sm text-zinc-500">{text}</div>;
}

export function InlineAlert({
  text,
  tone = "error",
}: {
  text: string;
  tone?: "error" | "info" | "success";
}) {
  const style =
    tone === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : tone === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-zinc-200 bg-zinc-50 text-zinc-700";
  return <div className={`rounded-2xl border px-4 py-3 text-sm ${style}`}>{text}</div>;
}

