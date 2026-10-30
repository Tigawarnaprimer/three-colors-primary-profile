
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    // Jangan menghitung aktivitas dashboard admin.
    if (pathname.startsWith("/admin")) return;

    const controller = new AbortController();

    fetch("/api/visitor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path: pathname }),
      credentials: "same-origin",
      signal: controller.signal,
      keepalive: true,
    }).catch((error) => {
      if (error.name !== "AbortError") {
        console.error("Gagal mengirim statistik pengunjung.");
      }
    });

    return () => controller.abort();
  }, [pathname]);

  return null;
}
