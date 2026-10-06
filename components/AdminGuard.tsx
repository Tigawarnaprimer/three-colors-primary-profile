"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // Halaman login tidak perlu dicek
    if (isLoginPage) {
      setChecking(false);
      return;
    }

    const isLoggedIn = sessionStorage.getItem("adminLoggedIn");

    if (!isLoggedIn) {
      router.replace(
        `/admin/login?redirect=${encodeURIComponent(pathname)}`
      );
      return;
    }

    setChecking(false);
  }, [router, pathname, isLoginPage]);

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