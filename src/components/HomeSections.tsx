"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import FirestoreApi from "@/services/firestoreApi";
import type { Banner, Category, Order, Product } from "@/types/store";
import { ProductGrid } from "@/components/ProductGrid";
import { docsFromSnapshot } from "@/services/snapshot";
import type { CollectionReference } from "firebase/firestore";

const api = FirestoreApi.Api;

export function HomeSections() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [latest, setLatest] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    const unsubCats = api.subscribeSnapshot(api.categoriesQuery(), (snap) => {
      setCategories(docsFromSnapshot<Category>(snap));
    });
    const unsubFeat = api.subscribeSnapshot(api.featuredProductsQuery(), (snap) => {
      setFeatured(docsFromSnapshot<Product>(snap));
    });
    const unsubLatest = api.subscribeSnapshot(api.latestProductsQuery(), (snap) => {
      setLatest(docsFromSnapshot<Product>(snap));
    });
    const unsubOrders = api.subscribeSnapshot(
      api.buildQuery(api.getOrdersCollection() as CollectionReference<Order>, []),
      (snap) => {
        setOrders(docsFromSnapshot<Order>(snap));
      },
    );
    const unsubBanners = api.subscribeSnapshot(api.bannersQuery(), (snap) => {
      setBanners(docsFromSnapshot<Banner>(snap));
    });

    return () => {
      unsubCats();
      unsubFeat();
      unsubLatest();
      unsubOrders();
      unsubBanners();
    };
  }, []);

  const mostRequested = useMemo(() => {
    const counts = new Map<string, number>();
    for (const o of orders.slice(0, 80)) {
      for (const it of o.items || []) {
        counts.set(it.productId, (counts.get(it.productId) || 0) + (it.qty || 0));
      }
    }
    const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);
    const byId = new Map([...featured, ...latest].map((p) => [p.id, p]));
    const res: Product[] = [];
    for (const [pid] of ranked) {
      const p = byId.get(pid);
      if (p) res.push(p);
    }
    return res;
  }, [featured, latest, orders]);

  return (
    <div className="mt-10 space-y-10">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-zinc-900">الأقسام</h2>
          <Link href="/products" className="text-sm font-semibold text-zinc-700 hover:text-zinc-900">
            عرض الكل
          </Link>
        </div>
        {categories.length === 0 ? (
          <div className="text-sm text-zinc-500">لا توجد أقسام بعد.</div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.slice(0, 12).map((c) => (
              <Link
                key={c.id}
                href={`/products?category=${encodeURIComponent(c.id)}`}
                className="flex flex-col items-center gap-2 rounded-2xl border border-zinc-200 p-3 hover:bg-zinc-50"
              >
                <div className="h-14 w-14 overflow-hidden rounded-2xl bg-zinc-100">
                  {c.image ? (
                    <Image src={c.image} alt={c.name} width={56} height={56} className="h-14 w-14 object-cover" />
                  ) : null}
                </div>
                <div className="text-center text-sm font-semibold text-zinc-800">{c.name}</div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-zinc-900">المنتجات المميزة</h2>
          <Link href="/products" className="text-sm font-semibold text-zinc-700 hover:text-zinc-900">
            المزيد
          </Link>
        </div>
        {featured.length === 0 ? (
          <div className="text-sm text-zinc-500">لم يتم تحديد منتجات مميزة بعد.</div>
        ) : (
          <ProductGrid products={featured.slice(0, 6)} />
        )}
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-zinc-900">أحدث الإضافات</h2>
          <Link href="/products" className="text-sm font-semibold text-zinc-700 hover:text-zinc-900">
            المزيد
          </Link>
        </div>
        {latest.length === 0 ? (
          <div className="text-sm text-zinc-500">لا توجد منتجات بعد.</div>
        ) : (
          <ProductGrid products={latest.slice(0, 6)} />
        )}
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-zinc-900">الأكثر طلبًا</h2>
          <Link href="/admin/orders" className="text-sm font-semibold text-zinc-700 hover:text-zinc-900">
            الطلبات
          </Link>
        </div>
        {mostRequested.length === 0 ? (
          <div className="text-sm text-zinc-500">لا توجد بيانات كافية بعد.</div>
        ) : (
          <ProductGrid products={mostRequested.slice(0, 6)} />
        )}
      </section>

      {banners.length ? (
        <section className="rounded-3xl border border-zinc-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-zinc-900">عروض</h2>
            <Link href="/offers" className="text-sm font-semibold text-zinc-700 hover:text-zinc-900">
              عرض الكل
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {banners.slice(0, 4).map((b) => (
              <Link
                key={b.id}
                href={b.link?.trim() ? b.link.trim() : "/offers"}
                className="overflow-hidden rounded-3xl border border-zinc-200 hover:bg-zinc-50"
              >
                <div className="relative h-40 bg-zinc-100">
                  {b.image ? <Image src={b.image} alt={b.title} fill className="object-cover" /> : null}
                </div>
                <div className="p-4 text-sm font-bold text-zinc-900">{b.title}</div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

