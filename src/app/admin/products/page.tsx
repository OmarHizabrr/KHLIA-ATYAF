"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import FirestoreApi from "@/services/firestoreApi";
import type { Product } from "@/types/store";
import { deleteProduct, newProductDraft, upsertProduct } from "@/services/productsApi";
import { docsFromSnapshot } from "@/services/snapshot";
import { uploadPublicImage } from "@/services/storageApi";

const api = FirestoreApi.Api;

export default function AdminProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Product>(newProductDraft());
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const q = api.productsAdminQuery();
    const unsub = api.subscribeSnapshot(
      q,
      (snap) => {
        setItems(docsFromSnapshot<Product>(snap));
        setLoading(false);
      },
      () => setLoading(false),
    );
    return () => unsub();
  }, []);

  const total = useMemo(() => items.length, [items.length]);

  function startCreate() {
    setMessage(null);
    setDraft(newProductDraft());
    setFile(null);
    setOpen(true);
  }

  function startEdit(p: Product) {
    setMessage(null);
    setDraft(p);
    setFile(null);
    setOpen(true);
  }

  async function onSave() {
    setMessage(null);
    setBusy(true);
    try {
      let images = draft.images ?? [];
      if (file) {
        const pid = draft.id || api.getNewId("products");
        const url = await uploadPublicImage(file, `products/${pid}/${Date.now()}-${file.name}`);
        images = [url, ...images];
        setDraft((p) => ({ ...p, id: pid, images }));
      }
      await upsertProduct({ ...draft, images });
      setOpen(false);
    } catch {
      setMessage("تعذر الحفظ. تأكد من قواعد Firestore/Storage.");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("حذف المنتج؟")) return;
    try {
      await deleteProduct(id);
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
            <h1 className="text-2xl font-bold text-zinc-900">إدارة المنتجات</h1>
            <p className="mt-2 text-sm leading-7 text-zinc-600">
              إجمالي المنتجات: <span className="font-bold text-zinc-900">{total}</span>
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
            <div className="text-sm font-bold text-zinc-900">قائمة المنتجات</div>
            <button
              onClick={startCreate}
              className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              إضافة منتج
            </button>
          </div>

          {loading ? (
            <div className="mt-6 text-sm text-zinc-500">جاري التحميل…</div>
          ) : items.length === 0 ? (
            <div className="mt-6 text-sm text-zinc-500">لا توجد بيانات بعد.</div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-3">
              {items.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 overflow-hidden rounded-2xl bg-zinc-100">
                      {p.images?.[0] ? (
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          width={56}
                          height={56}
                          className="h-14 w-14 object-cover"
                        />
                      ) : null}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-zinc-900">{p.name || "بدون اسم"}</div>
                      <div className="mt-1 text-xs text-zinc-500">
                        السعر: {p.price ?? 0} — المخزون: {p.stock ?? 0} — {p.isActive ? "نشط" : "مخفي"}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => startEdit(p)}
                      className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => onDelete(p.id)}
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
                  {draft.id ? "تعديل منتج" : "إضافة منتج"}
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
                  اسم المنتج
                  <input
                    value={draft.name}
                    onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
                    className="h-12 rounded-2xl border border-zinc-200 px-4 outline-none focus:border-zinc-400"
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold text-zinc-800">
                  السعر
                  <input
                    value={String(draft.price ?? 0)}
                    onChange={(e) => setDraft((p) => ({ ...p, price: Number(e.target.value || 0) }))}
                    className="h-12 rounded-2xl border border-zinc-200 px-4 outline-none focus:border-zinc-400"
                    inputMode="decimal"
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold text-zinc-800">
                  المخزون
                  <input
                    value={String(draft.stock ?? 0)}
                    onChange={(e) => setDraft((p) => ({ ...p, stock: Number(e.target.value || 0) }))}
                    className="h-12 rounded-2xl border border-zinc-200 px-4 outline-none focus:border-zinc-400"
                    inputMode="numeric"
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold text-zinc-800">
                  الوصف
                  <textarea
                    value={draft.description}
                    onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))}
                    className="min-h-24 rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:border-zinc-400"
                  />
                </label>

                <label className="flex items-center gap-3 text-sm font-semibold text-zinc-800">
                  <input
                    type="checkbox"
                    checked={draft.isActive}
                    onChange={(e) => setDraft((p) => ({ ...p, isActive: e.target.checked }))}
                  />
                  المنتج نشط
                </label>

                <label className="flex items-center gap-3 text-sm font-semibold text-zinc-800">
                  <input
                    type="checkbox"
                    checked={Boolean(draft.isFeatured)}
                    onChange={(e) => setDraft((p) => ({ ...p, isFeatured: e.target.checked }))}
                  />
                  منتج مميز
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

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
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

