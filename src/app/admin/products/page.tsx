"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import FirestoreApi from "@/services/firestoreApi";
import type { Currency, Product } from "@/types/store";
import { deleteProduct, newProductDraft, upsertProduct } from "@/services/productsApi";
import { docsFromSnapshot } from "@/services/snapshot";
import { uploadPublicImage } from "@/services/storageApi";
import { AppModal } from "@/components/ui/AppModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { InlineAlert, LoadingState } from "@/components/ui/Feedback";
import { ImagePickerField } from "@/components/ui/ImagePickerField";
import { FullImageModal } from "@/components/ui/FullImageModal";
import { AppButton } from "@/components/ui/AppButton";

const api = FirestoreApi.Api;

export default function AdminProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Product>(newProductDraft());
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState<string>("");

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

  useEffect(() => {
    const unsub = api.subscribeSnapshot(api.currenciesQuery(), (snap) => {
      const allCurrencies = docsFromSnapshot<Currency>(snap);
      setCurrencies(allCurrencies.filter((item) => item.isActive));
    });
    return () => unsub();
  }, []);

  const total = useMemo(() => items.length, [items.length]);

  function startCreate() {
    setMessage(null);
    const defaultCurrency = currencies.find((item) => item.isDefault) ?? currencies[0];
    setDraft({
      ...newProductDraft(),
      currencyCode: defaultCurrency?.code ?? "",
      currencySymbol: defaultCurrency?.symbol ?? "",
    });
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
      const selectedCurrency = currencies.find((item) => item.code === draft.currencyCode);
      if (file) {
        const pid = draft.id || api.getNewId("products");
        const url = await uploadPublicImage(file, `products/${pid}/${Date.now()}-${file.name}`);
        images = [url, ...images];
        setDraft((p) => ({ ...p, id: pid, images }));
      }
      await upsertProduct({
        ...draft,
        images,
        currencyCode: selectedCurrency?.code ?? draft.currencyCode ?? "",
        currencySymbol: selectedCurrency?.symbol ?? draft.currencySymbol ?? "",
      });
      setOpen(false);
    } catch {
      setMessage("تعذر الحفظ. تأكد من قواعد Firestore/Storage.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await deleteProduct(deleteId);
      setDeleteId(null);
    } catch {
      setMessage("تعذر الحذف.");
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
            <AppButton
              onClick={startCreate}
              variant="primary"
            >
              إضافة منتج
            </AppButton>
          </div>

          {message ? <div className="mt-4"><InlineAlert text={message} /></div> : null}

          {loading ? (
            <div className="mt-6"><LoadingState /></div>
          ) : items.length === 0 ? (
            <div className="mt-6 text-sm text-zinc-500">لا توجد بيانات بعد.</div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-3">
              {items.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-zinc-100 p-1">
                      {p.images?.[0] ? (
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          width={56}
                          height={56}
                          className="h-full w-full object-contain"
                        />
                      ) : null}

                      {p.images?.[0] ? (
                        <button
                          type="button"
                          aria-label="عرض الصورة"
                          onClick={() => {
                            setLightboxSrc(p.images?.[0] || null);
                            setLightboxAlt(p.name);
                          }}
                          className="absolute right-1 top-1 z-10 rounded-full p-1 text-zinc-600 opacity-50 hover:opacity-90 hover:bg-black/10"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path
                              d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                        </button>
                      ) : null}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-zinc-900">{p.name || "بدون اسم"}</div>
                      <div className="mt-1 text-xs text-zinc-500">
                        السعر: {p.price ?? 0} {p.currencySymbol || p.currencyCode || ""} — المخزون: {p.stock ?? 0} —{" "}
                        {p.isActive ? "نشط" : "مخفي"}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <AppButton
                      onClick={() => startEdit(p)}
                      variant="secondary"
                      size="sm"
                    >
                      تعديل
                    </AppButton>
                    <AppButton
                      onClick={() => setDeleteId(p.id)}
                      variant="danger"
                      size="sm"
                    >
                      حذف
                    </AppButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <AppModal
          open={open}
          title={draft.id ? "تعديل منتج" : "إضافة منتج"}
          onClose={() => setOpen(false)}
          footer={
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <AppButton
                onClick={onSave}
                loading={busy}
                variant="primary"
              >
                حفظ
              </AppButton>
            </div>
          }
        >
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
                  العملة
                  <select
                    value={draft.currencyCode || ""}
                    onChange={(e) => {
                      const code = e.target.value;
                      const selectedCurrency = currencies.find((item) => item.code === code);
                      setDraft((p) => ({
                        ...p,
                        currencyCode: code,
                        currencySymbol: selectedCurrency?.symbol ?? "",
                      }));
                    }}
                    className="h-12 rounded-2xl border border-zinc-200 px-4 outline-none focus:border-zinc-400"
                  >
                    <option value="">اختر العملة</option>
                    {currencies.map((currency) => (
                      <option key={currency.id} value={currency.code}>
                        {currency.code} - {currency.name} ({currency.symbol})
                      </option>
                    ))}
                  </select>
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

                <ImagePickerField
                  label="صورة المنتج"
                  file={file}
                  existingUrl={draft.images?.[0] || ""}
                  onChangeFile={setFile}
                  onClearFile={() => setFile(null)}
                  onClearExisting={() => setDraft((p) => ({ ...p, images: (p.images ?? []).slice(1) }))}
                />
          </div>
        </AppModal>

        <ConfirmDialog
          open={Boolean(deleteId)}
          title="تأكيد الحذف"
          description="هل أنت متأكد من حذف المنتج؟"
          confirmText="حذف"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />

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

