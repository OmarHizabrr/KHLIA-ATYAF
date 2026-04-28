"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Banner } from "@/types/store";

export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [idx, setIdx] = useState(0);
  const has = banners.length > 0;
  const current = useMemo(() => (has ? banners[idx % banners.length] : null), [banners, has, idx]);

  useEffect(() => {
    if (!has) return;
    const t = window.setInterval(() => setIdx((i) => i + 1), 5000);
    return () => window.clearInterval(t);
  }, [has]);

  if (!current) return null;

  const href = current.link?.trim() ? current.link.trim() : "/offers";

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-3xl border border-zinc-200 bg-white"
    >
      <div className="relative h-44 w-full sm:h-56">
        {current.image ? (
          <Image
            src={current.image}
            alt={current.title || "عرض"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            priority
          />
        ) : (
          <div className="h-full w-full bg-zinc-100" />
        )}
      </div>
      <div className="flex items-center justify-between gap-3 p-5">
        <div className="text-sm font-bold text-zinc-900">{current.title || "عرض"}</div>
        <div className="text-xs font-semibold text-zinc-600">مشاهدة</div>
      </div>
    </Link>
  );
}

