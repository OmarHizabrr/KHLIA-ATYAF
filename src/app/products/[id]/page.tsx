"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import FirestoreApi from "@/services/firestoreApi";
import type { Product, StoreSettings } from "@/types/store";
import { addToCart } from "@/services/cartStore";
import { getStoreSettings } from "@/services/settingsApi";
import { FullImageModal } from "@/components/ui/FullImageModal";

const api = FirestoreApi.Api;

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  useEffect(() => {
    getStoreSettings().then(setSettings).catch(() => setSettings(null));
  }, []);

  useEffect(() => {
    if (!id) return;
    const unsub = api.subscribeSnapshot(
      api.getProductDoc(id),
      (snap) => {
        const ds = snap as unknown as { exists: () => boolean; data: () => Product };
        setProduct(ds.exists() ? ds.data() : null);
        setLoading(false);
      },
      () => setLoading(false),
    );
    return () => unsub();
  }, [id]);

  const waLink = useMemo(() => {
    const wa = (settings?.whatsapp || "").replace(/\D/g, "");
    if (!wa) return "https://wa.me/";
    const text = product?.name ? `طلب منتج: ${product.name}` : "طلب منتج";
    return `https://wa.me/${wa}?text=${encodeURIComponent(text)}`;
  }, [product?.name, settings?.whatsapp]);

  function onAddToCart() {
    if (!product) return;
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      currencyCode: product.currencyCode || "",
      currencySymbol: product.currencySymbol || "",
      qty: 1,
      image: product.images?.[0] || "",
    });
    router.push("/cart");
  }

  return (
    <div className="min-h-full bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-zinc-900">تفاصيل المنتج</h1>
          <Link
            href="/products"
            className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
          >
            رجوع
          </Link>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500">
            جاري تحميل المنتج…
          </div>
        ) : !product ? (
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500">
            المنتج غير موجود.
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-6 rounded-3xl border border-zinc-200 bg-white p-6 md:grid-cols-2">
            <div className="space-y-3">
              <div className="relative flex h-72 items-center justify-center overflow-hidden rounded-2xl bg-zinc-100 p-2">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={1200}
                    height={900}
                    className="h-full w-full object-contain"
                  />
                ) : null}
                {product.images?.[0] ? (
                  <button
                    type="button"
                    aria-label="عرض الصورة"
                    onClick={() => setLightboxSrc(product.images?.[0] || null)}
                    className="absolute right-2 top-2 z-10 rounded-full p-2 text-zinc-600 opacity-50 hover:opacity-90 hover:bg-black/10"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </button>
                ) : null}
              </div>
              {product.images?.length ? (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.slice(0, 4).map((src, i) => (
                    <div key={src + i} className="relative flex h-16 overflow-hidden items-center justify-center rounded-xl bg-zinc-100 p-1">
                      <Image
                        src={src}
                        alt={product.name}
                        width={240}
                        height={240}
                        className="h-full w-full object-contain"
                      />
                      <button
                        type="button"
                        aria-label="عرض الصورة"
                        onClick={() => setLightboxSrc(src)}
                        className="absolute right-1 top-1 z-10 rounded-full p-1 text-zinc-600 opacity-50 hover:opacity-90 hover:bg-black/10"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xl font-bold text-zinc-900">{product.name}</div>
                  <div className="mt-1 text-sm text-zinc-500">{product.description}</div>
                </div>
                <div className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">
                  {product.price} {product.currencySymbol || product.currencyCode || "ر.س"}
                </div>
              </div>

              {product.features?.length ? (
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <div className="text-sm font-bold text-zinc-900">المميزات</div>
                  <ul className="mt-3 list-disc space-y-2 pr-5 text-sm text-zinc-600">
                    {product.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-auto grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  onClick={onAddToCart}
                  className="rounded-full bg-zinc-900 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-zinc-800"
                >
                  أضف للسلة
                </button>
                <a
                  href={waLink}
                  className="rounded-full border border-zinc-200 bg-white px-6 py-3 text-center text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  واتساب مباشر
                </a>
              </div>
            </div>
          </section>
        )}
        <FullImageModal
          open={Boolean(lightboxSrc)}
          src={lightboxSrc || ""}
          alt={product?.name || "image"}
          onClose={() => setLightboxSrc(null)}
        />
      </main>
    </div>
  );
}

