import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function AdminBannersPage() {
  return (
    <div className="min-h-full bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">
              إدارة العروض والبنرات
            </h1>
            <p className="mt-2 text-sm leading-7 text-zinc-600">
              سيتم إضافة/تعديل البنرات وربطها بصفحة العروض والصفحة الرئيسية.
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
            <button className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800">
              إضافة بانر
            </button>
          </div>
          <div className="mt-6 text-sm text-zinc-500">
            لا توجد بيانات بعد.
          </div>
        </section>
      </main>
    </div>
  );
}

