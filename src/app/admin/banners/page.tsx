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
import { AppModal } from "@/components/ui/AppModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { InlineAlert, LoadingState } from "@/components/ui/Feedback";
import { ImagePickerField } from "@/components/ui/ImagePickerField";
import { FullImageModal } from "@/components/ui/FullImageModal";

const api = FirestoreApi.Api;

export default function AdminBannersPage() {
  const [items, setItems] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Banner>(newBannerDraft());
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState<string>("");

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

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await deleteBanner(deleteId);
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

          {message ? <div className="mt-4"><InlineAlert text={message} /></div> : null}

          {loading ? (
            <div className="mt-6"><LoadingState /></div>
          ) : items.length === 0 ? (
            <div className="mt-6 text-sm text-zinc-500">لا توجد بيانات بعد.</div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-3">
              {items.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-24 overflow-hidden rounded-2xl bg-zinc-100 p-1">
                      {b.image ? (
                        <Image
                          src={b.image}
                          alt={b.title}
                          width={96}
                          height={56}
                          className="h-full w-full object-contain"
                        />
                      ) : null}

                      {b.image ? (
                        <button
                          type="button"
                          aria-label="عرض الصورة"
                          onClick={() => {
                            setLightboxSrc(b.image || null);
                            setLightboxAlt(b.title);
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
                      onClick={() => setDeleteId(b.id)}
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
          title={draft.id ? "تعديل بانر" : "إضافة بانر"}
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

                <ImagePickerField
                  label="صورة البانر"
                  file={file}
                  existingUrl={draft.image || ""}
                  onChangeFile={setFile}
                  onClearFile={() => setFile(null)}
                  onClearExisting={() => setDraft((p) => ({ ...p, image: "" }))}
                />
          </div>
        </AppModal>

        <ConfirmDialog
          open={Boolean(deleteId)}
          title="تأكيد الحذف"
          description="هل أنت متأكد من حذف البانر؟"
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

