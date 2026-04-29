"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import FirestoreApi from "@/services/firestoreApi";
import type { Currency, Order, OrderStatus } from "@/types/store";
import { updateOrderStatus } from "@/services/ordersApi";
import { docsFromSnapshot } from "@/services/snapshot";
import { groupTotalsByCurrency, totalInDefaultCurrency } from "@/services/currencyTotals";
import type { CollectionReference } from "firebase/firestore";
import { AppButton } from "@/components/ui/AppButton";

const api = FirestoreApi.Api;
const statuses: OrderStatus[] = ["جديد", "قيد التنفيذ", "تم التجهيز", "تم التسليم"];

export default function AdminOrdersPage() {
  const [items, setItems] = useState<Order[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | "الكل">("الكل");

  useEffect(() => {
    const q = api.buildQuery(api.getOrdersCollection() as CollectionReference<Order>, []);
    const unsub = api.subscribeSnapshot(
      q,
      (snap) => {
        setItems(docsFromSnapshot<Order>(snap));
        setLoading(false);
      },
      () => setLoading(false),
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = api.subscribeSnapshot(api.currenciesQuery(), (snap) => {
      setCurrencies(docsFromSnapshot<Currency>(snap).filter((c) => c.isActive));
    });
    return () => unsub();
  }, []);

  const shown = useMemo(() => {
    if (filter === "الكل") return items;
    return items.filter((o) => o.status === filter);
  }, [filter, items]);

  async function onChangeStatus(orderId: string, status: OrderStatus) {
    try {
      await updateOrderStatus(orderId, status);
    } catch {
      alert("تعذر تحديث الحالة.");
    }
  }

  return (
    <div className="min-h-full bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">إدارة الطلبات</h1>
            <p className="mt-2 text-sm leading-7 text-zinc-600">
              إجمالي الطلبات: <span className="font-bold text-zinc-900">{items.length}</span>
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
          <div className="flex flex-wrap gap-2">
            <AppButton
              onClick={() => setFilter("الكل")}
              size="sm"
              className={`${
                filter === "الكل"
                  ? "bg-zinc-900 text-white hover:bg-zinc-800"
                  : "border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              الكل
            </AppButton>
            {statuses.map((s) => (
              <AppButton
                key={s}
                onClick={() => setFilter(s)}
                size="sm"
                className={`${
                  filter === s
                    ? "bg-zinc-900 text-white hover:bg-zinc-800"
                    : "border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                {s}
              </AppButton>
            ))}
          </div>

          {loading ? (
            <div className="mt-6 text-sm text-zinc-500">جاري التحميل…</div>
          ) : shown.length === 0 ? (
            <div className="mt-6 text-sm text-zinc-500">لا توجد طلبات.</div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-3">
              {shown.map((o) => (
                <div key={o.id} className="rounded-2xl border border-zinc-200 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-sm font-bold text-zinc-900">
                        {o.customerName} — {o.phone}
                      </div>
                      <div className="mt-1 text-xs text-zinc-500">
                        {o.address}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                        الإجمالي بالافتراضية: {totalInDefaultCurrency(o.items || [], currencies).total.toFixed(2)}{" "}
                        {totalInDefaultCurrency(o.items || [], currencies).defaultCurrency?.symbol ||
                          totalInDefaultCurrency(o.items || [], currencies).defaultCurrency?.code ||
                          ""}
                      </span>
                      <select
                        value={o.status}
                        onChange={(e) =>
                          onChangeStatus(o.id, e.target.value as OrderStatus)
                        }
                        className="h-10 rounded-2xl border border-zinc-200 px-3 text-sm font-semibold text-zinc-800"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-zinc-500">
                    عدد العناصر: {o.items?.length ?? 0}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(o.totalsByCurrency?.length ? o.totalsByCurrency : groupTotalsByCurrency(o.items || [])).map((row) => (
                      <span key={`${o.id}-${row.code}-${row.symbol}`} className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-800">
                        {row.total} {row.symbol || row.code}
                      </span>
                    ))}
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

