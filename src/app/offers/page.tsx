"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import FirestoreApi from "@/services/firestoreApi";
import { docsFromSnapshot } from "@/services/snapshot";
import type { Banner } from "@/types/store";
import { FullImageModal } from "@/components/ui/FullImageModal";

const api = FirestoreApi.Api;

export default function OffersPage() {
  const [items, setItems] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState<string>("");

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
                    {b.image ? (
                      <button
                        type="button"
                        aria-label="عرض الصورة"
                        onClick={(e) => {
                          e.preventDefault();
                          setLightboxSrc(b.image || null);
                          setLightboxAlt(b.title);
                        }}
                        className="absolute right-2 top-2 z-10 rounded-full p-2 text-zinc-600 opacity-50 hover:opacity-90 hover:bg-black/10"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </button>
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
        <FullImageModal
          open={Boolean(lightboxSrc)}
          src={lightboxSrc || ""}
          alt={lightboxAlt}
          onClose={() => setLightboxSrc(null)}
        />
      </main>
    </div>
  );
}

