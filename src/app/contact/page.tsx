"use client";

import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import type { StoreSettings } from "@/types/store";
import { getStoreSettings } from "@/services/settingsApi";

export default function ContactPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  useEffect(() => {
    getStoreSettings().then(setSettings).catch(() => setSettings(null));
  }, []);

  const waLink = useMemo(() => {
    const wa = (settings?.whatsapp || "").replace(/\D/g, "");
    if (!wa) return "https://wa.me/";
    return `https://wa.me/${wa}`;
  }, [settings?.whatsapp]);

  const phoneLink = useMemo(() => {
    const p = (settings?.phone || "").trim();
    return p ? `tel:${p}` : "tel:";
  }, [settings?.phone]);

  return (
    <div className="min-h-full bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-bold text-zinc-900">التواصل</h1>
        <p className="mt-2 text-sm leading-7 text-zinc-600">بيانات التواصل من إعدادات المتجر.</p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <a
            className="rounded-3xl border border-zinc-200 bg-white p-6 hover:bg-zinc-50"
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="text-sm font-bold text-zinc-900">واتساب</div>
            <div className="mt-2 text-sm text-zinc-600">
              {settings?.whatsapp ? settings.whatsapp : "أضف الرقم من لوحة الإدارة"}
            </div>
          </a>
          <a
            className="rounded-3xl border border-zinc-200 bg-white p-6 hover:bg-zinc-50"
            href={phoneLink}
          >
            <div className="text-sm font-bold text-zinc-900">اتصال</div>
            <div className="mt-2 text-sm text-zinc-600">
              {settings?.phone ? settings.phone : "أضف الرقم من لوحة الإدارة"}
            </div>
          </a>
          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <div className="text-sm font-bold text-zinc-900">العنوان</div>
            <div className="mt-2 text-sm text-zinc-600">
              {settings?.address ? settings.address : "أضف العنوان من لوحة الإدارة"}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

