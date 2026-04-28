"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import FirestoreApi from "@/services/firestoreApi";
import type { Category } from "@/types/store";
import { deleteCategory, newCategoryDraft, upsertCategory } from "@/services/categoriesApi";
import { docsFromSnapshot } from "@/services/snapshot";
import { uploadPublicImage } from "@/services/storageApi";
import { AppModal } from "@/components/ui/AppModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { InlineAlert, LoadingState } from "@/components/ui/Feedback";

const api = FirestoreApi.Api;

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Category>(newCategoryDraft());
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const q = api.categoriesQuery();
    const unsub = api.subscribeSnapshot(
      q,
      (snap) => {
        setItems(docsFromSnapshot<Category>(snap));
        setLoading(false);
      },
      () => setLoading(false),
    );
    return () => unsub();
  }, []);

  const total = useMemo(() => items.length, [items.length]);

  function startCreate() {
    setMessage(null);
    setDraft(newCategoryDraft());
    setFile(null);
    setOpen(true);
  }

  function startEdit(c: Category) {
    setMessage(null);
    setDraft(c);
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
        id = id || api.getNewId("categories");
        image = await uploadPublicImage(file, `categories/${id}/${Date.now()}-${file.name}`);
      }
      await upsertCategory({ ...draft, id, image });
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
      await deleteCategory(deleteId);
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
            <h1 className="text-2xl font-bold text-zinc-900">إدارة الأقسام</h1>
            <p className="mt-2 text-sm leading-7 text-zinc-600">
              إجمالي الأقسام: <span className="font-bold text-zinc-900">{total}</span>
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
            <div className="text-sm font-bold text-zinc-900">قائمة الأقسام</div>
            <button
              onClick={startCreate}
              className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              إضافة قسم
            </button>
          </div>

          {message ? <div className="mt-4"><InlineAlert text={message} /></div> : null}

          {loading ? (
            <div className="mt-6"><LoadingState /></div>
          ) : items.length === 0 ? (
            <div className="mt-6 text-sm text-zinc-500">لا توجد بيانات بعد.</div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-3">
              {items.map((c) => (
                <div
                  key={c.id}
                  className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 overflow-hidden rounded-2xl bg-zinc-100">
                      {c.image ? (
                        <Image
                          src={c.image}
                          alt={c.name}
                          width={56}
                          height={56}
                          className="h-14 w-14 object-cover"
                        />
                      ) : null}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-zinc-900">{c.name || "بدون اسم"}</div>
                      <div className="mt-1 text-xs text-zinc-500">الترتيب: {c.sortOrder ?? 0}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => startEdit(c)}
                      className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => setDeleteId(c.id)}
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

        <AppModal
          open={open}
          title={draft.id ? "تعديل قسم" : "إضافة قسم"}
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
                  اسم القسم
                  <input
                    value={draft.name}
                    onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
                    className="h-12 rounded-2xl border border-zinc-200 px-4 outline-none focus:border-zinc-400"
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold text-zinc-800">
                  الترتيب
                  <input
                    value={String(draft.sortOrder ?? 0)}
                    onChange={(e) => setDraft((p) => ({ ...p, sortOrder: Number(e.target.value || 0) }))}
                    className="h-12 rounded-2xl border border-zinc-200 px-4 outline-none focus:border-zinc-400"
                    inputMode="numeric"
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
        </AppModal>

        <ConfirmDialog
          open={Boolean(deleteId)}
          title="تأكيد الحذف"
          description="هل أنت متأكد من حذف القسم؟"
          confirmText="حذف"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      </main>
    </div>
  );
}

