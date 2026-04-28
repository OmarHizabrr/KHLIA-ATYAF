import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

const statuses = ["جديد", "قيد التنفيذ", "تم التجهيز", "تم التسليم"] as const;

export default function AdminOrdersPage() {
  return (
    <div className="min-h-full bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">إدارة الطلبات</h1>
            <p className="mt-2 text-sm leading-7 text-zinc-600">
              سيتم عرض الطلبات وتحديث الحالة من Firestore.
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
            {statuses.map((s) => (
              <span
                key={s}
                className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-6 text-sm text-zinc-500">
            لا توجد طلبات بعد.
          </div>
        </section>
      </main>
    </div>
  );
}

