"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import FirestoreApi from "@/services/firestoreApi";
import { BannerCarousel } from "@/components/BannerCarousel";
import { HomeSections } from "@/components/HomeSections";
import { docsFromSnapshot } from "@/services/snapshot";
import type { Banner } from "@/types/store";

export default function Home() {
  const api = FirestoreApi.Api;
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    const unsub = api.subscribeSnapshot(
      api.bannersQuery(),
      (snap) => {
        setBanners(docsFromSnapshot<Banner>(snap));
      },
      () => undefined,
    );
    return () => unsub();
  }, [api]);

  return (
    <div className="flex min-h-full flex-col bg-zinc-50">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <div className="mb-6">
          <BannerCarousel banners={banners} />
        </div>

        <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white">
          <div className="grid grid-cols-1 gap-10 p-8 md:grid-cols-2 md:p-12">
            <div className="flex flex-col justify-center gap-5">
              <h1 className="text-3xl font-bold leading-[1.35] text-zinc-900 md:text-4xl">
                خلية أطياف
                <span className="block text-zinc-500">متجر إلكتروني حديث</span>
              </h1>
              <p className="text-base leading-8 text-zinc-600">
                تصفّح المنتجات، اطلب بسهولة، وتواصل مباشرة عبر واتساب. المنصة تعمل
                على الجوال والويب ويمكن تثبيتها كتطبيق (PWA).
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/products"
                  className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
                >
                  تصفح المنتجات
                </Link>
                <Link
                  href="/offers"
                  className="rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
                >
                  مشاهدة العروض
                </Link>
              </div>

              <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500">
                <span className="rounded-full bg-zinc-100 px-3 py-1">
                  واجهة عربية RTL
                </span>
                <span className="rounded-full bg-zinc-100 px-3 py-1">
                  Firebase
                </span>
                <span className="rounded-full bg-zinc-100 px-3 py-1">PWA</span>
                <span className="rounded-full bg-zinc-100 px-3 py-1">
                  جاهز لـ Vercel
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_30%,rgba(55,104,126,0.18),transparent_55%),radial-gradient(circle_at_80%_60%,rgba(55,104,126,0.18),transparent_55%)]" />
              <div className="flex h-full items-center justify-center rounded-2xl border border-zinc-200 bg-white/60 p-10">
                <div className="text-center">
                  <div className="text-5xl font-black tracking-tight text-zinc-900">
                    KHLIA
                  </div>
                  <div className="mt-2 text-lg font-semibold text-zinc-600">
                    ATYAF
                  </div>
                  <div className="mt-6 text-sm text-zinc-500">
                    مظهر عصري وسريع ومتوافق مع الجوال
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <HomeSections />
      </main>
    </div>
  );
}
