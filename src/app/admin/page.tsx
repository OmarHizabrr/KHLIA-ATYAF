import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

const cards = [
  { href: "/admin/access-requests", title: "طلبات الدخول", desc: "مراجعة طلبات دخول لوحة الإدارة" },
  { href: "/admin/products", title: "المنتجات", desc: "إضافة/تعديل/حذف المنتجات ورفع الصور" },
  { href: "/admin/categories", title: "الأقسام", desc: "إدارة الأقسام وترتيبها" },
  { href: "/admin/orders", title: "الطلبات", desc: "عرض الطلبات وتحديث الحالة" },
  { href: "/admin/banners", title: "العروض والبنرات", desc: "إدارة البنرات الرئيسية والعروض" },
  { href: "/admin/settings", title: "الإعدادات", desc: "بيانات المتجر والشعار وروابط التواصل" },
];

export default function AdminHomePage() {
  return (
    <div className="min-h-full bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">لوحة التحكم</h1>
            <p className="mt-2 text-sm leading-7 text-zinc-600">
              هذه لوحة مبدئية. سيتم تفعيل تسجيل الدخول الآمن وربط CRUD عبر Firestore.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
          >
            العودة للمتجر
          </Link>
        </div>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="rounded-3xl border border-zinc-200 bg-white p-6 hover:bg-zinc-50"
            >
              <div className="text-base font-bold text-zinc-900">{c.title}</div>
              <div className="mt-2 text-sm leading-7 text-zinc-600">{c.desc}</div>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}

