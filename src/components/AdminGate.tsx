"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAdminUser, subscribeAuth } from "@/services/adminAuth";
import type { User } from "firebase/auth";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginRoute = pathname === "/admin/login";

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
      if (isLoginRoute) {
        router.replace("/admin");
      }
      return;
    }
    if (isLoginRoute) return;
    router.replace("/admin/login");
  }, [allowed, isLoginRoute, ready, router]);

  // صفحة تسجيل الدخول يجب أن تظهر مباشرة حتى لو تأخر تحقق Firebase.
  if (isLoginRoute) {
    return <>{children}</>;
  }

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

