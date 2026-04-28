import { SiteHeader } from "@/components/SiteHeader";

export default function OffersPage() {
  return (
    <div className="min-h-full bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-bold text-zinc-900">العروض</h1>
        <p className="mt-2 text-sm leading-7 text-zinc-600">
          سيتم إدارة البنرات والعروض من لوحة التحكم وعرضها هنا تلقائيًا.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-3xl border border-zinc-200 bg-white"
            >
              <div className="h-44 bg-zinc-100" />
              <div className="p-6">
                <div className="text-base font-bold text-zinc-900">
                  عرض رقم {i}
                </div>
                <div className="mt-2 text-sm text-zinc-600">
                  وصف بسيط للعرض…
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

