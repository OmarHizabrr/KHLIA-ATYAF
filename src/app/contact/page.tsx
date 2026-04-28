import { SiteHeader } from "@/components/SiteHeader";

export default function ContactPage() {
  return (
    <div className="min-h-full bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-bold text-zinc-900">التواصل</h1>
        <p className="mt-2 text-sm leading-7 text-zinc-600">
          سيتم ربط هذه البيانات من إعدادات المتجر داخل Firestore.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <a
            className="rounded-3xl border border-zinc-200 bg-white p-6 hover:bg-zinc-50"
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="text-sm font-bold text-zinc-900">واتساب</div>
            <div className="mt-2 text-sm text-zinc-600">محادثة مباشرة</div>
          </a>
          <a
            className="rounded-3xl border border-zinc-200 bg-white p-6 hover:bg-zinc-50"
            href="tel:"
          >
            <div className="text-sm font-bold text-zinc-900">اتصال</div>
            <div className="mt-2 text-sm text-zinc-600">رقم الهاتف</div>
          </a>
          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <div className="text-sm font-bold text-zinc-900">العنوان</div>
            <div className="mt-2 text-sm text-zinc-600">عنوان المتجر</div>
          </div>
        </div>
      </main>
    </div>
  );
}

