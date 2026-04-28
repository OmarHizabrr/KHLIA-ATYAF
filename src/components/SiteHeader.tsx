"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "firebase/auth";
import { Brand } from "@/components/Brand";
import { adminSignOut, isAdminUser, subscribeAuth } from "@/services/adminAuth";

const nav = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "المنتجات" },
  { href: "/offers", label: "العروض" },
  { href: "/contact", label: "التواصل" },
  { href: "/cart", label: "السلة" },
];

export function SiteHeader() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const unsub = subscribeAuth((u) => {
      setUser(u);
      setReady(true);
    });
    return () => unsub();
  }, []);

  const isAdmin = useMemo(() => isAdminUser(user), [user]);
  const adminLabel = useMemo(() => {
    if (!user) return "حساب الإدارة";
    if (user.displayName?.trim()) return user.displayName.trim();
    if (user.email?.trim()) return user.email.trim();
    return "حساب الإدارة";
  }, [user]);

  async function onLogout() {
    setBusy(true);
    try {
      await adminSignOut();
      router.replace("/");
    } finally {
      setBusy(false);
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="shrink-0">
          <Brand />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {ready && isAdmin ? (
            <>
              <span className="hidden rounded-full bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-700 md:inline-flex">
                {adminLabel}
              </span>
              <Link
                href="/admin"
                className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                لوحة الإدارة
              </Link>
              <button
                onClick={onLogout}
                disabled={busy}
                className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
              >
                {busy ? "..." : "خروج"}
              </button>
            </>
          ) : (
            <Link
              href="/admin/login"
              className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
            >
              الإدارة
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

