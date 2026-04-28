import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailsPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="min-h-full bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-zinc-900">تفاصيل المنتج</h1>
          <Link
            href="/products"
            className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
          >
            رجوع
          </Link>
        </div>

        <section className="grid grid-cols-1 gap-6 rounded-3xl border border-zinc-200 bg-white p-6 md:grid-cols-2">
          <div className="space-y-3">
            <div className="h-72 rounded-2xl bg-zinc-100" />
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-zinc-100" />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xl font-bold text-zinc-900">
                  منتج رقم {id}
                </div>
                <div className="mt-1 text-sm text-zinc-500">
                  وصف كامل للمنتج سيظهر هنا…
                </div>
              </div>
              <div className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">
                0 ر.س
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="text-sm font-bold text-zinc-900">المميزات</div>
              <ul className="mt-3 list-disc space-y-2 pr-5 text-sm text-zinc-600">
                <li>ميزة 1</li>
                <li>ميزة 2</li>
                <li>ميزة 3</li>
              </ul>
            </div>

            <div className="mt-auto grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                href="/cart"
                className="rounded-full bg-zinc-900 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-zinc-800"
              >
                اطلب الآن
              </Link>
              <a
                href="https://wa.me/"
                className="rounded-full border border-zinc-200 bg-white px-6 py-3 text-center text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
                target="_blank"
                rel="noopener noreferrer"
              >
                واتساب مباشر
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

