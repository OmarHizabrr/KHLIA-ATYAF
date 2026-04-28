"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import FirestoreApi from "@/services/firestoreApi";
import type { Category, Product } from "@/types/store";

const api = FirestoreApi.Api;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");

  useEffect(() => {
    const unsubCats = api.subscribeSnapshot(
      api.categoriesQuery(),
      (snap) => {
        const qs = snap as any;
        setCategories(((qs.docs ?? []) as any[]).map((d) => d.data()) as Category[]);
      },
      () => undefined,
    );

    return () => unsubCats();
  }, []);

  useEffect(() => {
    setLoading(true);
    const unsub = api.subscribeSnapshot(
      api.productsActiveQuery({ categoryId: categoryId || undefined }),
      (snap) => {
        const qs = snap as any;
        setProducts(((qs.docs ?? []) as any[]).map((d) => d.data()) as Product[]);
        setLoading(false);
      },
      () => setLoading(false),
    );
    return () => unsub();
  }, [categoryId]);

  const filtered = useMemo(() => {
    const needle = q.trim();
    if (!needle) return products;
    return products.filter((p) => (p.name || "").includes(needle));
  }, [products, q]);

  return (
    <div className="min-h-full bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="mb-6 flex flex-col gap-3">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">المنتجات</h1>
            <p className="mt-1 text-sm leading-7 text-zinc-600">
              بحث وفلترة حسب القسم، مع ترتيب الأحدث.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="h-12 rounded-2xl border border-zinc-200 bg-white px-4 outline-none focus:border-zinc-400"
              placeholder="ابحث باسم المنتج…"
            />
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="h-12 rounded-2xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-800 outline-none focus:border-zinc-400"
            >
              <option value="">كل الأقسام</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 text-sm">
              <span className="font-semibold text-zinc-700">النتائج</span>
              <span className="font-bold text-zinc-900">{filtered.length}</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-sm text-zinc-500">جاري التحميل…</div>
        ) : filtered.length === 0 ? (
          <div className="text-sm text-zinc-500">لا توجد منتجات.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
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
                    <div className="text-base font-bold text-zinc-900">
                      {p.name}
                    </div>
                    <div className="mt-1 line-clamp-2 text-sm text-zinc-500">
                      {p.description}
                    </div>
                  </div>
                  <div className="shrink-0 rounded-full bg-zinc-900 px-3 py-1 text-sm font-semibold text-white">
                    {p.price} ر.س
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <Link
                    href={`/products/${p.id}`}
                    className="flex-1 rounded-full border border-zinc-200 px-4 py-2 text-center text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
                  >
                    التفاصيل
                  </Link>
                  <Link
                    href={`/products/${p.id}`}
                    className="flex-1 rounded-full bg-zinc-900 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-zinc-800"
                  >
                    اطلب
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

