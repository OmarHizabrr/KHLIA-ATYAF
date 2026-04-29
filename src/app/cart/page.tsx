"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { getCartItems, removeFromCart, updateCartQty } from "@/services/cartStore";
import FirestoreApi from "@/services/firestoreApi";
import { docsFromSnapshot } from "@/services/snapshot";
import type { Currency, OrderItem } from "@/types/store";
import { groupTotalsByCurrency, totalInDefaultCurrency } from "@/services/currencyTotals";
import { AppButton } from "@/components/ui/AppButton";

const api = FirestoreApi.Api;

export default function CartPage() {
  const [items, setItems] = useState<OrderItem[]>(() => getCartItems());
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const totalsByCurrency = useMemo(() => groupTotalsByCurrency(items), [items]);
  const totalDefault = useMemo(() => totalInDefaultCurrency(items, currencies), [items, currencies]);

  useEffect(() => {
    const unsub = api.subscribeSnapshot(api.currenciesQuery(), (snap) => {
      setCurrencies(docsFromSnapshot<Currency>(snap).filter((c) => c.isActive));
    });
    return () => unsub();
  }, []);

  function onQty(productId: string, qty: number) {
    updateCartQty(productId, qty);
    setItems(getCartItems());
  }

  function onRemove(productId: string) {
    removeFromCart(productId);
    setItems(getCartItems());
  }

  return (
    <div className="min-h-full bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">السلة</h1>
          <p className="mt-2 text-sm leading-7 text-zinc-600">راجع منتجاتك ثم أكمل الطلب.</p>
        </div>

        <section className="rounded-3xl border border-zinc-200 bg-white p-6">
          <div className="flex items-center justify-between gap-3 border-b border-zinc-100 pb-4">
            <div className="text-sm font-bold text-zinc-900">المنتجات</div>
            <div className="text-sm font-bold text-zinc-900">الإجمالي</div>
          </div>

          {items.length === 0 ? (
            <div className="py-10 text-center text-sm text-zinc-500">
              لا توجد عناصر في السلة حاليًا.
            </div>
          ) : (
            <div className="py-6">
              <div className="grid grid-cols-1 gap-3">
                {items.map((it) => (
                  <div
                    key={it.productId}
                    className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="text-sm font-bold text-zinc-900">{it.name}</div>
                      <div className="mt-1 text-xs text-zinc-500">
                        السعر: {it.price} {it.currencySymbol || it.currencyCode || "ر.س"} — المجموع: {(it.price || 0) * (it.qty || 0)}{" "}
                        {it.currencySymbol || it.currencyCode || "ر.س"}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        value={it.qty}
                        onChange={(e) => onQty(it.productId, Number(e.target.value || 1))}
                        className="h-10 w-24 rounded-2xl border border-zinc-200 px-3 text-sm font-semibold text-zinc-800"
                      />
                      <AppButton
                        onClick={() => onRemove(it.productId)}
                        variant="danger"
                        size="sm"
                      >
                        حذف
                      </AppButton>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm">
                <div className="font-semibold text-zinc-700">الإجمالي حسب العملة</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {totalsByCurrency.map((row) => (
                    <span key={`${row.code}-${row.symbol}`} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-zinc-900">
                      {row.total} {row.symbol || row.code}
                    </span>
                  ))}
                </div>
                <div className="mt-3 border-t border-zinc-200 pt-3 font-bold text-zinc-900">
                  الإجمالي بالعملة الافتراضية: {totalDefault.total.toFixed(2)}{" "}
                  {totalDefault.defaultCurrency?.symbol || totalDefault.defaultCurrency?.code || ""}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link href="/products" className="rounded-full border border-zinc-200 px-6 py-3 text-center text-sm font-semibold text-zinc-800 hover:bg-zinc-50">
              متابعة التسوق
            </Link>
            <Link href="/checkout" className="rounded-full bg-zinc-900 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-zinc-800">
              تنفيذ الطلب
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

