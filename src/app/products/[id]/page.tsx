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

const api = FirestoreApi.Api;

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);

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
              <div className="h-72 overflow-hidden rounded-2xl bg-zinc-100">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={1200}
                    height={900}
                    className="h-72 w-full object-cover"
                  />
                ) : null}
              </div>
              {product.images?.length ? (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.slice(0, 4).map((src, i) => (
                    <div key={src + i} className="h-16 overflow-hidden rounded-xl bg-zinc-100">
                      <Image
                        src={src}
                        alt={product.name}
                        width={240}
                        height={240}
                        className="h-16 w-full object-cover"
                      />
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
                  {product.price} ر.س
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
      </main>
    </div>
  );
}

