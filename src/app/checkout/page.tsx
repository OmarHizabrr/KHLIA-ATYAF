"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { clearCart, getCartItems } from "@/services/cartStore";
import FirestoreApi from "@/services/firestoreApi";
import { docsFromSnapshot } from "@/services/snapshot";
import type { Currency, OrderItem } from "@/types/store";
import { createOrder } from "@/services/ordersApi";
import { groupTotalsByCurrency, totalInDefaultCurrency } from "@/services/currencyTotals";

const api = FirestoreApi.Api;

export default function CheckoutPage() {
  const [items] = useState<OrderItem[]>(() => getCartItems());
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const totalsByCurrency = useMemo(() => groupTotalsByCurrency(items), [items]);
  const totalDefault = useMemo(() => totalInDefaultCurrency(items, currencies), [items, currencies]);

  useEffect(() => {
    const unsub = api.subscribeSnapshot(api.currenciesQuery(), (snap) => {
      setCurrencies(docsFromSnapshot<Currency>(snap).filter((c) => c.isActive));
    });
    return () => unsub();
  }, []);

  async function onSubmit() {
    setMessage(null);
    if (!customerName || !phone || !address) {
      setMessage("يرجى إدخال الاسم ورقم الجوال والعنوان.");
      return;
    }
    if (items.length === 0) {
      setMessage("السلة فارغة.");
      return;
    }
    setBusy(true);
    try {
      const id = await createOrder({
        customerName,
        phone,
        address,
        items,
        total: totalDefault.total,
        totalsByCurrency,
        status: "جديد",
      });
      clearCart();
      setMessage(`تم استلام طلبك بنجاح. رقم الطلب: ${id}`);
    } catch {
      setMessage("تعذر إنشاء الطلب. تأكد من قواعد Firestore.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-full bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">إتمام الطلب</h1>
          <p className="mt-2 text-sm leading-7 text-zinc-600">
            سيتم إنشاء الطلب في قاعدة البيانات بعد التأكيد.
          </p>
        </div>

        <section className="rounded-3xl border border-zinc-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm">
            <span className="font-semibold text-zinc-800">
              عدد العناصر: {items.length}
            </span>
            <span className="font-bold text-zinc-900">
              الإجمالي بالافتراضية: {totalDefault.total.toFixed(2)}{" "}
              {totalDefault.defaultCurrency?.symbol || totalDefault.defaultCurrency?.code || ""}
            </span>
          </div>
          <div className="mb-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm">
            <div className="font-semibold text-zinc-700">تجميع حسب العملة</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {totalsByCurrency.map((row) => (
                <span key={`${row.code}-${row.symbol}`} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-zinc-900">
                  {row.total} {row.symbol || row.code}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <label className="grid gap-2 text-sm font-semibold text-zinc-800">
              الاسم
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="h-12 rounded-2xl border border-zinc-200 px-4 outline-none focus:border-zinc-400"
                placeholder="اسم العميل"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-zinc-800">
              رقم الجوال
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-12 rounded-2xl border border-zinc-200 px-4 outline-none focus:border-zinc-400"
                placeholder="05xxxxxxxx"
                inputMode="tel"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-zinc-800">
              العنوان
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="min-h-24 rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:border-zinc-400"
                placeholder="الحي، الشارع، رقم المنزل..."
              />
            </label>
          </div>

          {message ? (
            <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
              {message}
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/cart"
              className="rounded-full border border-zinc-200 px-6 py-3 text-center text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
            >
              رجوع للسلة
            </Link>
            <button
              onClick={onSubmit}
              disabled={busy}
              className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
            >
              {busy ? "جاري التأكيد…" : "تأكيد الطلب"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

