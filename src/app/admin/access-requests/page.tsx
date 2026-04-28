"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import {
  setAccessStatus,
  subscribeAccessRequests,
  type AdminAccessRecord,
  type AdminAccessStatus,
} from "@/services/adminAuth";

const statuses: AdminAccessStatus[] = ["pending", "approved", "rejected"];

const statusLabel: Record<AdminAccessStatus, string> = {
  pending: "قيد الانتظار",
  approved: "مقبول",
  rejected: "مرفوض",
};

export default function AdminAccessRequestsPage() {
  const [items, setItems] = useState<AdminAccessRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AdminAccessStatus | "all">("pending");

  useEffect(() => {
    const unsub = subscribeAccessRequests(
      (records) => {
        setItems(records);
        setLoading(false);
      },
      () => setLoading(false),
    );
    return () => unsub();
  }, []);

  const shown = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((x) => x.status === filter);
  }, [filter, items]);

  async function onSetStatus(uid: string, status: AdminAccessStatus) {
    try {
      await setAccessStatus(uid, status);
    } catch {
      alert("تعذر تحديث حالة الطلب.");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">طلبات الدخول</h1>
            <p className="mt-2 text-sm leading-7 text-zinc-600">
              أي مستخدم يسجل عبر Google يظهر هنا للمراجعة والموافقة أو الرفض.
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
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                filter === "all"
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              الكل
            </button>
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                  filter === s
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                {statusLabel[s]}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-sm text-zinc-500">جاري التحميل…</div>
          ) : shown.length === 0 ? (
            <div className="text-sm text-zinc-500">لا توجد طلبات حالياً.</div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {shown.map((r) => (
                <div
                  key={r.uid}
                  className="rounded-2xl border border-zinc-200 p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-sm font-bold text-zinc-900">
                        {r.displayName || "بدون اسم"}
                      </div>
                      <div className="mt-1 text-xs text-zinc-500">{r.email}</div>
                    </div>
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                      {statusLabel[r.status]}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => onSetStatus(r.uid, "approved")}
                      className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                    >
                      قبول
                    </button>
                    <button
                      onClick={() => onSetStatus(r.uid, "rejected")}
                      className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                    >
                      رفض
                    </button>
                    <button
                      onClick={() => onSetStatus(r.uid, "pending")}
                      className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
                    >
                      إعادة للانتظار
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

