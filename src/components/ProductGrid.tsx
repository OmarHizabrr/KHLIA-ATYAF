"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { addToCart } from "@/services/cartStore";
import type { Product } from "@/types/store";
import { FullImageModal } from "@/components/ui/FullImageModal";

export function ProductGrid({ products }: { products: Product[] }) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState<string>("");

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <div
          key={p.id}
          className="rounded-3xl border border-zinc-200 bg-white p-5 transition-shadow hover:bg-zinc-50 hover:shadow-sm"
        >
          <div className="relative mb-4 flex h-40 items-center justify-center overflow-hidden rounded-2xl bg-zinc-100 p-2">
            {p.images?.[0] ? (
              <Image
                src={p.images[0]}
                alt={p.name}
                width={800}
                height={600}
                className="h-full w-full object-contain"
              />
            ) : null}

            {p.images?.[0] ? (
              <button
                type="button"
                aria-label="عرض الصورة"
                onClick={() => {
                  setLightboxSrc(p.images?.[0] || null);
                  setLightboxAlt(p.name);
                }}
                className="absolute right-2 top-2 z-10 rounded-full p-2 text-zinc-600 opacity-50 hover:opacity-90 hover:bg-black/10"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </button>
            ) : null}
          </div>

          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-base font-bold text-zinc-900">{p.name}</div>
              <div className="mt-1 line-clamp-2 text-sm text-zinc-500">
                {p.description}
              </div>
            </div>
            <div className="shrink-0 rounded-full bg-zinc-900 px-3 py-1 text-sm font-semibold text-white">
              {p.price} {p.currencySymbol || p.currencyCode || "ر.س"}
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <Link
              href={`/products/${p.id}`}
              className="flex-1 rounded-full border border-zinc-200 px-4 py-2 text-center text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
            >
              التفاصيل
            </Link>
            <button
              onClick={() =>
                addToCart({
                  productId: p.id,
                  name: p.name,
                  price: p.price,
                  currencyCode: p.currencyCode || "",
                  currencySymbol: p.currencySymbol || "",
                  qty: 1,
                  image: p.images?.[0] || "",
                })
              }
              className="flex-1 rounded-full bg-zinc-900 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-zinc-800"
            >
              أضف للسلة
            </button>
          </div>
        </div>
      ))}

      <FullImageModal
        open={Boolean(lightboxSrc)}
        src={lightboxSrc || ""}
        alt={lightboxAlt}
        onClose={() => setLightboxSrc(null)}
      />
    </div>
  );
}

