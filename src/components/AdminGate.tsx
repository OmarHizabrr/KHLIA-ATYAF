"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAdminUser, subscribeAuth } from "@/services/adminAuth";
import type { User } from "firebase/auth";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = subscribeAuth((u) => {
      setUser(u);
      setReady(true);
    });
    return () => unsub();
  }, []);

  const allowed = useMemo(() => isAdminUser(user), [user]);

  useEffect(() => {
    if (!ready) return;
    if (allowed) {
      if (pathname === "/admin/login") {
        router.replace("/admin");
      }
      return;
    }
    if (pathname === "/admin/login") return;
    router.replace("/admin/login");
  }, [allowed, pathname, ready, router]);

  if (!ready) {
    return (
      <div className="min-h-[50vh] grid place-items-center text-sm text-zinc-500">
        جاري التحقق من تسجيل الدخول…
      </div>
    );
  }

  if (!allowed) return null;

  return <>{children}</>;
}

