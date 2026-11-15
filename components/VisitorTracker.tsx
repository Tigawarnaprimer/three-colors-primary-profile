"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

const VISITOR_KEY = "website_visitor_id";
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Identitas pengunjung disimpan di browser (menggantikan cookie server).
function getVisitorId(): string | null {
  try {
    const saved = localStorage.getItem(VISITOR_KEY);

    if (saved && UUID_PATTERN.test(saved)) return saved;

    const created = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, created);
    return created;
  } catch {
    // Browser memblokir localStorage (mode privat ketat): lewati pencatatan.
    return null;
  }
}

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    // Jangan menghitung aktivitas dashboard admin.
    if (pathname.startsWith("/admin")) return;

    const visitorId = getVisitorId();
    if (!visitorId) return;

    // Samakan format dengan data lama: tanpa garis miring di akhir.
    const pagePath = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

    supabase
      .rpc("track_visit", {
        p_visitor_id: visitorId,
        p_path: pagePath,
      })
      .then(({ error }) => {
        if (error) {
          console.error("Gagal mengirim statistik pengunjung.");
        }
      });
  }, [pathname]);

  return null;
}
