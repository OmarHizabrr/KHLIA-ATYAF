"use client";

import Image from "next/image";
import Link from "next/link";
import { addToCart } from "@/services/cartStore";
import type { Product } from "@/types/store";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <div
          key={p.id}
          className="rounded-3xl border border-zinc-200 bg-white p-5"
        >
          <div className="mb-4 h-40 overflow-hidden rounded-2xl bg-zinc-100">
            {p.images?.[0] ? (
              <Image
                src={p.images[0]}
                alt={p.name}
                width={800}
                height={600}
                className="h-40 w-full object-cover"
              />
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
    </div>
  );
}

