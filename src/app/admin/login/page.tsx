"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { adminSignIn } from "@/services/adminAuth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await adminSignIn(email, password);
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
          الدخول مخصص لصاحب متجر خليطة أطياف فقط.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6"
        >
          <label className="grid gap-2 text-sm font-semibold text-zinc-800">
            البريد الإلكتروني
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-2xl border border-zinc-200 px-4 outline-none focus:border-zinc-400"
              placeholder="owner@example.com"
              inputMode="email"
              autoComplete="email"
              required
            />
          </label>

          <label className="mt-4 grid gap-2 text-sm font-semibold text-zinc-800">
            كلمة المرور
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-2xl border border-zinc-200 px-4 outline-none focus:border-zinc-400"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>

          {error ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            disabled={busy}
            className="mt-6 w-full rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {busy ? "جاري الدخول…" : "دخول"}
          </button>

          <div className="mt-4 text-center text-sm text-zinc-600">
            <Link href="/" className="font-semibold text-zinc-900">
              العودة للمتجر
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

