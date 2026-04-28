"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import FirestoreApi from "@/services/firestoreApi";
import { docsFromSnapshot } from "@/services/snapshot";
import type { Banner } from "@/types/store";

const api = FirestoreApi.Api;

export default function OffersPage() {
  const [items, setItems] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = api.subscribeSnapshot(
      api.bannersQuery(),
      (snap) => {
        setItems(docsFromSnapshot<Banner>(snap));
        setLoading(false);
      },
      () => setLoading(false),
    );
    return () => unsub();
  }, []);

  return (
    <div className="min-h-full bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-bold text-zinc-900">العروض</h1>
        <p className="mt-2 text-sm leading-7 text-zinc-600">
          البنرات تُدار من لوحة التحكم وتظهر هنا تلقائيًا.
        </p>

        {loading ? (
          <div className="mt-6 text-sm text-zinc-500">جاري التحميل…</div>
        ) : items.length === 0 ? (
          <div className="mt-6 text-sm text-zinc-500">لا توجد عروض بعد.</div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {items.map((b) => {
              const href = b.link?.trim() ? b.link.trim() : "/offers";
              return (
                <Link
                  key={b.id}
                  href={href}
                  className="overflow-hidden rounded-3xl border border-zinc-200 bg-white hover:bg-zinc-50"
                >
                  <div className="relative h-44 bg-zinc-100">
                    {b.image ? (
                      <Image
                        src={b.image}
                        alt={b.title}
                        fill
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="p-6">
                    <div className="text-base font-bold text-zinc-900">
                      {b.title}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

