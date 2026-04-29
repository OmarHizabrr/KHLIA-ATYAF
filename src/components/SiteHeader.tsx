"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "firebase/auth";
import { Brand } from "@/components/Brand";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AppButton } from "@/components/ui/AppButton";
import {
  adminSignOut,
  isAdminApproved,
  subscribeAccessStatus,
  subscribeAuth,
  type AdminAccessStatus,
} from "@/services/adminAuth";

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
  const [status, setStatus] = useState<AdminAccessStatus | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const unsub = subscribeAuth((u) => {
      setUser(u);
      setStatus(u ? undefined : null);
      setReady(true);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = subscribeAccessStatus(user.uid, (s) => {
      setStatus(s);
    });
    return () => unsub();
  }, [user?.uid]);

  const statusReady = !user || status !== undefined;
  const isAdmin = useMemo(
    () => isAdminApproved(status === undefined ? null : status),
    [status],
  );
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
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/85">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="shrink-0">
          <Brand />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {ready && statusReady && isAdmin ? (
            <>
              <span className="hidden rounded-full bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 md:inline-flex">
                {adminLabel}
              </span>
              <Link
                href="/admin"
                className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                لوحة الإدارة
              </Link>
              <AppButton
                onClick={onLogout}
                loading={busy}
                variant="danger"
                size="sm"
              >
                خروج
              </AppButton>
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

