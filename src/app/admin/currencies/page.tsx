"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import FirestoreApi from "@/services/firestoreApi";
import type { Currency } from "@/types/store";
import { deleteCurrency, newCurrencyDraft, upsertCurrency } from "@/services/currenciesApi";
import { docsFromSnapshot } from "@/services/snapshot";
import { AppModal } from "@/components/ui/AppModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { InlineAlert, LoadingState } from "@/components/ui/Feedback";

const api = FirestoreApi.Api;

export default function AdminCurrenciesPage() {
  const [items, setItems] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Currency>(newCurrencyDraft());
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = api.subscribeSnapshot(
      api.currenciesQuery(),
      (snap) => {
        setItems(docsFromSnapshot<Currency>(snap));
        setLoading(false);
      },
      () => setLoading(false),
    );
    return () => unsub();
  }, []);

  const total = useMemo(() => items.length, [items.length]);

  function startCreate() {
    setMessage(null);
    setDraft(newCurrencyDraft());
    setOpen(true);
  }

  function startEdit(c: Currency) {
    setMessage(null);
    setDraft(c);
    setOpen(true);
  }

  async function onSave() {
    setMessage(null);
    setBusy(true);
    try {
      await upsertCurrency(draft);
      setOpen(false);
    } catch {
      setMessage("تعذر الحفظ. تأكد من صلاحيات Firestore.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await deleteCurrency(deleteId);
      setDeleteId(null);
    } catch {
      setMessage("تعذر الحذف.");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">جدول العملات</h1>
            <p className="mt-2 text-sm leading-7 text-zinc-600">
              إجمالي العملات: <span className="font-bold text-zinc-900">{total}</span>
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
            <div className="text-sm font-bold text-zinc-900">العملات</div>
            <button
              onClick={startCreate}
              className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              إضافة عملة
            </button>
          </div>

          {message ? <div className="mt-4"><InlineAlert text={message} /></div> : null}

          {loading ? (
            <div className="mt-6"><LoadingState /></div>
          ) : items.length === 0 ? (
            <div className="mt-6 text-sm text-zinc-500">لا توجد بيانات بعد.</div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[720px] border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-right text-xs text-zinc-500">
                    <th className="px-3 py-2">الرمز</th>
                    <th className="px-3 py-2">الاسم</th>
                    <th className="px-3 py-2">العلامة</th>
                    <th className="px-3 py-2">السعر</th>
                    <th className="px-3 py-2">الافتراضية</th>
                    <th className="px-3 py-2">الحالة</th>
                    <th className="px-3 py-2">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((c) => (
                    <tr key={c.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 text-sm text-zinc-800">
                      <td className="px-3 py-3 font-bold">{c.code}</td>
                      <td className="px-3 py-3">{c.name}</td>
                      <td className="px-3 py-3">{c.symbol}</td>
                      <td className="px-3 py-3">{c.rate}</td>
                      <td className="px-3 py-3">{c.isDefault ? "نعم" : "لا"}</td>
                      <td className="px-3 py-3">{c.isActive ? "نشطة" : "مخفية"}</td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => startEdit(c)}
                            className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-100"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => setDeleteId(c.id)}
                            className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <AppModal
          open={open}
          title={draft.id ? "تعديل عملة" : "إضافة عملة"}
          onClose={() => setOpen(false)}
          footer={
            <div className="flex justify-end">
              <button
                onClick={onSave}
                disabled={busy}
                className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
              >
                {busy ? "جاري الحفظ…" : "حفظ"}
              </button>
            </div>
          }
        >
          <div className="grid grid-cols-1 gap-4">
            <label className="grid gap-2 text-sm font-semibold text-zinc-800">
              رمز العملة
              <input
                value={draft.code}
                onChange={(e) => setDraft((p) => ({ ...p, code: e.target.value }))}
                className="h-12 rounded-2xl border border-zinc-200 px-4 outline-none focus:border-zinc-400"
                placeholder="USD"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-zinc-800">
              اسم العملة
              <input
                value={draft.name}
                onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
                className="h-12 rounded-2xl border border-zinc-200 px-4 outline-none focus:border-zinc-400"
                placeholder="دولار أمريكي"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-zinc-800">
              العلامة
              <input
                value={draft.symbol}
                onChange={(e) => setDraft((p) => ({ ...p, symbol: e.target.value }))}
                className="h-12 rounded-2xl border border-zinc-200 px-4 outline-none focus:border-zinc-400"
                placeholder="$"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-zinc-800">
              سعر التحويل
              <input
                value={String(draft.rate ?? 1)}
                onChange={(e) => setDraft((p) => ({ ...p, rate: Number(e.target.value || 1) }))}
                className="h-12 rounded-2xl border border-zinc-200 px-4 outline-none focus:border-zinc-400"
                inputMode="decimal"
              />
            </label>
            <label className="flex items-center gap-3 text-sm font-semibold text-zinc-800">
              <input
                type="checkbox"
                checked={draft.isDefault}
                onChange={(e) => setDraft((p) => ({ ...p, isDefault: e.target.checked }))}
              />
              عملة افتراضية
            </label>
            <label className="flex items-center gap-3 text-sm font-semibold text-zinc-800">
              <input
                type="checkbox"
                checked={draft.isActive}
                onChange={(e) => setDraft((p) => ({ ...p, isActive: e.target.checked }))}
              />
              عملة نشطة
            </label>
          </div>
        </AppModal>

        <ConfirmDialog
          open={Boolean(deleteId)}
          title="تأكيد الحذف"
          description="هل أنت متأكد من حذف العملة؟"
          confirmText="حذف"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      </main>
    </div>
  );
}

