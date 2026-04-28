import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function ProductsPage() {
  return (
    <div className="min-h-full bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="mb-6 flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-zinc-900">المنتجات</h1>
          <p className="text-sm leading-7 text-zinc-600">
            قريبًا سيتم ربط هذه الصفحة بقاعدة بيانات Firestore لعرض المنتجات
            والبحث والفلترة.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-3xl border border-zinc-200 bg-white p-5"
            >
              <div className="mb-4 h-40 rounded-2xl bg-zinc-100" />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-base font-bold text-zinc-900">
                    منتج تجريبي {i}
                  </div>
                  <div className="mt-1 text-sm text-zinc-500">
                    وصف مختصر للمنتج…
                  </div>
                </div>
                <div className="shrink-0 rounded-full bg-zinc-900 px-3 py-1 text-sm font-semibold text-white">
                  0 ر.س
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <Link
                  href={`/products/${i}`}
                  className="flex-1 rounded-full border border-zinc-200 px-4 py-2 text-center text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
                >
                  التفاصيل
                </Link>
                <Link
                  href="/cart"
                  className="flex-1 rounded-full bg-zinc-900 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-zinc-800"
                >
                  اطلب
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

