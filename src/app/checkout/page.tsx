import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function CheckoutPage() {
  return (
    <div className="min-h-full bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">إتمام الطلب</h1>
          <p className="mt-2 text-sm leading-7 text-zinc-600">
            أدخل بياناتك وسيتم إنشاء الطلب في Firestore.
          </p>
        </div>

        <section className="rounded-3xl border border-zinc-200 bg-white p-6">
          <div className="grid grid-cols-1 gap-4">
            <label className="grid gap-2 text-sm font-semibold text-zinc-800">
              الاسم
              <input
                className="h-12 rounded-2xl border border-zinc-200 px-4 outline-none focus:border-zinc-400"
                placeholder="اسم العميل"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-zinc-800">
              رقم الجوال
              <input
                className="h-12 rounded-2xl border border-zinc-200 px-4 outline-none focus:border-zinc-400"
                placeholder="05xxxxxxxx"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-zinc-800">
              العنوان
              <textarea
                className="min-h-24 rounded-2xl border border-zinc-200 px-4 py-3 outline-none focus:border-zinc-400"
                placeholder="الحي، الشارع، رقم المنزل..."
              />
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/cart"
              className="rounded-full border border-zinc-200 px-6 py-3 text-center text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
            >
              رجوع للسلة
            </Link>
            <button className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800">
              تأكيد الطلب
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

