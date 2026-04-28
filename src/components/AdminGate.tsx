"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  isAdminApproved,
  subscribeAccessStatus,
  subscribeAuth,
  type AdminAccessStatus,
} from "@/services/adminAuth";
import type { User } from "firebase/auth";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginRoute = pathname === "/admin/login";

  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [status, setStatus] = useState<AdminAccessStatus | null | undefined>(undefined);

  useEffect(() => {
    const unsub = subscribeAuth((u) => {
      setUser(u);
      setStatus(u ? undefined : null);
      setAuthReady(true);
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
  const allowed = useMemo(
    () => isAdminApproved(status === undefined ? null : status),
    [status],
  );

  useEffect(() => {
    if (!authReady) return;
    if (allowed) {
      if (isLoginRoute) {
        router.replace("/admin");
      }
      return;
    }
    if (!user) {
      router.replace("/admin/login");
      return;
    }
    if (!statusReady) return;
  }, [allowed, authReady, isLoginRoute, router, statusReady, user]);

  // صفحة تسجيل الدخول يجب أن تظهر مباشرة حتى لو تأخر تحقق Firebase.
  if (isLoginRoute) {
    return <>{children}</>;
  }

  if (!authReady || (user && !statusReady)) {
    return (
      <div className="min-h-[50vh] grid place-items-center text-sm text-zinc-500">
        جاري التحقق من تسجيل الدخول…
      </div>
    );
  }

  if (!user) return null;

  if (status === "pending") {
    return (
      <div className="min-h-[60vh] grid place-items-center bg-zinc-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 text-center">
          <h2 className="text-xl font-bold text-zinc-900">بانتظار موافقة الإدارة</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-600">
            تم تسجيل طلب الدخول بنجاح. يرجى انتظار الموافقة من الإدارة.
          </p>
        </div>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="min-h-[60vh] grid place-items-center bg-zinc-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-red-200 bg-white p-6 text-center">
          <h2 className="text-xl font-bold text-red-700">تم رفض طلب الدخول</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-600">
            يمكنك التواصل مع الإدارة لإعادة تقييم الطلب.
          </p>
        </div>
      </div>
    );
  }

  if (!allowed) return null;

  return <>{children}</>;
}

