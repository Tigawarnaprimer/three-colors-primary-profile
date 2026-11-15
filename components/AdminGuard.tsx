"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname() ?? "";

  const [checking, setChecking] = useState(true);

  // Dengan trailingSlash: true, pathname berakhiran "/".
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  const isLoginPage = normalizedPath === "/admin/login";

  useEffect(() => {
    // Halaman login tidak perlu dicek
    if (isLoginPage) {
      setChecking(false);
      return;
    }

    let cancelled = false;

    async function checkSession() {
      // Cek sesi Supabase yang sebenarnya, bukan penanda di sessionStorage.
      const { data } = await supabase.auth.getSession();

      if (cancelled) return;

      if (!data.session) {
        router.replace(
          `/admin/login/?redirect=${encodeURIComponent(normalizedPath)}`
        );
        return;
      }

      setChecking(false);
    }

    checkSession();

    // Jika sesi berakhir atau logout di tab lain, kembali ke login.
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session && !cancelled) {
          router.replace("/admin/login/");
        }
      }
    );

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, [router, normalizedPath, isLoginPage]);

  if (checking) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-9 h-9 border-2 border-blue-200 border-t-blue-700 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm font-semibold text-blue-950">
            Memeriksa akses...
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Mohon tunggu sebentar
          </p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
