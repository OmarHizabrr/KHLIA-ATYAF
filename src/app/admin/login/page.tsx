"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { adminSignInWithGoogle } from "@/services/adminAuth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onGoogle() {
    setError(null);
    setBusy(true);
    try {
      await adminSignInWithGoogle();
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-full bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-md px-4 py-10">
        <h1 className="text-2xl font-bold text-zinc-900">تسجيل دخول الإدارة</h1>
        <p className="mt-2 text-sm leading-7 text-zinc-600">
          الدخول مخصص لصاحب متجر خلية أطياف فقط عبر Google.
        </p>

        <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6">
          {error ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            onClick={onGoogle}
            disabled={busy}
            className="w-full rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {busy ? "جاري تسجيل الدخول…" : "تسجيل الدخول عبر Google"}
          </button>

          <p className="mt-3 text-center text-xs text-zinc-500">
            سيتم فتح نافذة Google مباشرة عند الضغط.
          </p>

          <div className="mt-4 text-center text-sm text-zinc-600">
            <Link href="/" className="font-semibold text-zinc-900">
              العودة للمتجر
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

