"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import FirestoreApi from "@/services/firestoreApi";
import type { Banner } from "@/types/store";
import { deleteBanner, newBannerDraft, upsertBanner } from "@/services/bannersApi";
import { docsFromSnapshot } from "@/services/snapshot";
import { uploadPublicImage } from "@/services/storageApi";

const api = FirestoreApi.Api;

export default function AdminBannersPage() {
  const [items, setItems] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Banner>(newBannerDraft());
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const q = api.bannersQuery();
    const unsub = api.subscribeSnapshot(
      q,
      (snap) => {
        setItems(docsFromSnapshot<Banner>(snap));
        setLoading(false);
      },
      () => setLoading(false),
    );
    return () => unsub();
  }, []);

  const total = useMemo(() => items.length, [items.length]);

  function startCreate() {
    setMessage(null);
    setDraft(newBannerDraft());
    setFile(null);
    setOpen(true);
  }

  function startEdit(b: Banner) {
    setMessage(null);
    setDraft(b);
    setFile(null);
    setOpen(true);
  }

  async function onSave() {
    setMessage(null);
    setBusy(true);
    try {
      let image = draft.image || "";
      let id = draft.id;
      if (file) {
        id = id || api.getNewId("banners");
        image = await uploadPublicImage(file, `banners/${id}/${Date.now()}-${file.name}`);
      }
      await upsertBanner({ ...draft, id, image });
      setOpen(false);
    } catch {
      setMessage("تعذر الحفظ. تأكد من قواعد Firestore/Storage.");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("حذف البانر؟")) return;
    try {
      await deleteBanner(id);
    } catch {
      alert("تعذر الحذف.");
    }
  }

  return (
    <div className="min-h-full bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">إدارة العروض والبنرات</h1>
            <p className="mt-2 text-sm leading-7 text-zinc-600">
              إجمالي البنرات: <span className="font-bold text-zinc-900">{total}</span>
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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm font-bold text-zinc-900">البنرات</div>
            <button
              onClick={startCreate}
              className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              إضافة بانر
            </button>
          </div>

          {loading ? (
            <div className="mt-6 text-sm text-zinc-500">جاري التحميل…</div>
          ) : items.length === 0 ? (
            <div className="mt-6 text-sm text-zinc-500">لا توجد بيانات بعد.</div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-3">
              {items.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-24 overflow-hidden rounded-2xl bg-zinc-100">
                      {b.image ? (
                        <Image
                          src={b.image}
                          alt={b.title}
                          width={96}
                          height={56}
                          className="h-14 w-24 object-cover"
                        />
                      ) : null}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-zinc-900">{b.title || "بدون عنوان"}</div>
                      <div className="mt-1 text-xs text-zinc-500">{b.link || "بدون رابط"}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => startEdit(b)}
                      className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => onDelete(b.id)}
                      className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {open ? (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
            <div className="w-full max-w-xl rounded-3xl border border-zinc-200 bg-white p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="text-base font-bold text-zinc-900">
                  {draft.id ? "تعديل بانر" : "إضافة بانر"}
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
                >
                  إغلاق
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <label className="grid gap-2 text-sm font-semibold text-zinc-800">
                  العنوان
                  <input
                    value={draft.title}
                    onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
                    className="h-12 rounded-2xl border border-zinc-200 px-4 outline-none focus:border-zinc-400"
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold text-zinc-800">
                  الرابط (اختياري)
                  <input
                    value={draft.link || ""}
                    onChange={(e) => setDraft((p) => ({ ...p, link: e.target.value }))}
                    className="h-12 rounded-2xl border border-zinc-200 px-4 outline-none focus:border-zinc-400"
                    placeholder="/offers أو https://..."
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold text-zinc-800">
                  رفع صورة (اختياري)
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>

              {message ? (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {message}
                </div>
              ) : null}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={onSave}
                  disabled={busy}
                  className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
                >
                  {busy ? "جاري الحفظ…" : "حفظ"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

