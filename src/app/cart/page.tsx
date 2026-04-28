import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function CartPage() {
  return (
    <div className="min-h-full bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">السلة</h1>
          <p className="mt-2 text-sm leading-7 text-zinc-600">
            هذه صفحة مبدئية، سنربطها قريبًا بالسلة والطلب من Firestore.
          </p>
        </div>

        <section className="rounded-3xl border border-zinc-200 bg-white p-6">
          <div className="flex items-center justify-between gap-3 border-b border-zinc-100 pb-4">
            <div className="text-sm font-bold text-zinc-900">المنتجات</div>
            <div className="text-sm font-bold text-zinc-900">الإجمالي</div>
          </div>

          <div className="py-10 text-center text-sm text-zinc-500">
            لا توجد عناصر في السلة حاليًا.
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/products"
              className="rounded-full border border-zinc-200 px-6 py-3 text-center text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
            >
              متابعة التسوق
            </Link>
            <Link
              href="/checkout"
              className="rounded-full bg-zinc-900 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-zinc-800"
            >
              تنفيذ الطلب
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

