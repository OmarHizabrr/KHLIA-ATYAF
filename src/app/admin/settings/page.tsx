"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import type { StoreSettings } from "@/types/store";
import { getStoreSettings, saveStoreSettings } from "@/services/settingsApi";
import { AppButton } from "@/components/ui/AppButton";

export default function AdminSettingsPage() {
  const [form, setForm] = useState<StoreSettings>({
    storeName: "خلية أطياف",
    logo: "/logo.png",
    whatsapp: "",
    phone: "",
    address: "",
  });
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getStoreSettings()
      .then((s) => {
        if (!mounted) return;
        setForm(s);
        setReady(true);
      })
      .catch(() => {
        if (!mounted) return;
        setReady(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  async function onSave() {
    setMessage(null);
    setBusy(true);
    try {
      await saveStoreSettings(form);
      setMessage("تم حفظ الإعدادات بنجاح.");
    } catch {
      setMessage("تعذر حفظ الإعدادات. تأكد من صلاحيات Firestore.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-full bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">الإعدادات العامة</h1>
            <p className="mt-2 text-sm leading-7 text-zinc-600">
              تُحفظ داخل مستند <span className="font-mono">settings/global</span>.
            </p>
          </div>
          <Link
            href="/admin"
            className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
          >
            رجوع
          </Link>
        </div>

        <section className="rounded-3xl border border-zinc-200 bg-white p-6">
          {!ready ? (
            <div className="text-sm text-zinc-500">جاري تحميل الإعدادات…</div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4">
                <label className="grid gap-2 text-sm font-semibold text-zinc-800">
                  اسم المتجر
                  <input
                    value={form.storeName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, storeName: e.target.value }))
                    }
                    className="h-12 rounded-2xl border border-zinc-200 px-4 outline-none focus:border-zinc-400"
                    placeholder="خلية أطياف"
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold text-zinc-800">
                  رابط الشعار (اختياري)
                  <input
                    value={form.logo}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, logo: e.target.value }))
                    }
                    className="h-12 rounded-2xl border border-zinc-200 px-4 outline-none focus:border-zinc-400"
                    placeholder="/logo.png"
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold text-zinc-800">
                  رقم الواتساب
                  <input
                    value={form.whatsapp}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, whatsapp: e.target.value }))
                    }
                    className="h-12 rounded-2xl border border-zinc-200 px-4 outline-none focus:border-zinc-400"
                    placeholder="9665xxxxxxxx"
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold text-zinc-800">
                  رقم الهاتف
                  <input
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    className="h-12 rounded-2xl border border-zinc-200 px-4 outline-none focus:border-zinc-400"
                    placeholder="05xxxxxxxx"
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold text-zinc-800">
                  العنوان
                  <textarea
                    value={form.address}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, address: e.target.value }))
                    }
                    className="min-h-24 rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:border-zinc-400"
                    placeholder="عنوان المتجر"
                  />
                </label>
              </div>

              {message ? (
                <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
                  {message}
                </div>
              ) : null}

              <div className="mt-6 flex justify-end">
                <AppButton
                  onClick={onSave}
                  loading={busy}
                  variant="primary"
                >
                  حفظ الإعدادات
                </AppButton>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

