
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type VisitorStatsData = {
  total_unique_visitors: number;
  total_page_views: number;
  unique_visitors_today: number;
  page_views_this_month: number;
};

const numberFormat = new Intl.NumberFormat("id-ID");

const cards = [
  {
    key: "total_unique_visitors",
    title: "Pengunjung Unik",
    description: "Total pengunjung tercatat",
    icon: "users",
    color: "bg-blue-50 text-blue-700",
  },
  {
    key: "total_page_views",
    title: "Total Tayangan",
    description: "Semua halaman dibuka",
    icon: "eye",
    color: "bg-green-50 text-green-700",
  },
  {
    key: "unique_visitors_today",
    title: "Pengunjung Hari Ini",
    description: "Pengunjung unik hari ini",
    icon: "calendar",
    color: "bg-amber-50 text-amber-700",
  },
  {
    key: "page_views_this_month",
    title: "Tayangan Bulan Ini",
    description: "Halaman dibuka bulan ini",
    icon: "chart",
    color: "bg-purple-50 text-purple-700",
  },
] as const;

export default function VisitorStats() {
  const [stats, setStats] = useState<VisitorStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      setLoading(true);
      setErrorMessage("");

      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.access_token) {
          throw new Error("Sesi admin tidak ditemukan. Silakan login kembali.");
        }

        const response = await fetch("/api/visitor/stats", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Gagal memuat statistik.");
        }

        if (!cancelled) {
          setStats(result as VisitorStatsData);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Terjadi kesalahan saat memuat statistik."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadStats();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mt-8">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-700">
          Analitik Website
        </p>
        <h2 className="mt-1 text-lg font-bold text-blue-950">
          Statistik Pengunjung
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Ringkasan aktivitas pengunjung website PT Tiga Warna Primer.
        </p>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const value = stats?.[card.key];

          return (
            <div
              key={card.key}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-600">
                    {card.title}
                  </p>
                  <p className="mt-3 text-3xl font-bold tracking-tight text-blue-950">
                    {loading
                      ? "—"
                      : value === undefined
                        ? "—"
                        : numberFormat.format(value)}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.color}`}
                  aria-hidden="true"
                >
                  {card.icon === "users" && (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 8v6M23 11h-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {card.icon === "eye" && (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                  {card.icon === "calendar" && (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="5" width="18" height="16" rx="2" />
                      <path d="M16 3v4M8 3v4M3 10h18" strokeLinecap="round" />
                    </svg>
                  )}
                  {card.icon === "chart" && (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M3 3v18h18M8 15l4-4 3 3 5-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>

              <p className="mt-2 text-xs text-gray-400">{card.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
