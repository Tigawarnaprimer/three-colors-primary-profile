
"use client";

import { useEffect, useState } from "react";

type Stats = {
  total_page_views: number;
  page_views_this_month: number;
  total_unique_visitors: number;
  unique_visitors_today: number;
};

const initialStats: Stats = {
  total_page_views: 0,
  page_views_this_month: 0,
  total_unique_visitors: 0,
  unique_visitors_today: 0,
};

const numberFormat = new Intl.NumberFormat("id-ID");

const statItems = [
  {
    key: "total_page_views",
    label: "Total Tayangan",
    description: "Seluruh tayangan halaman website",
    color: "blue",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7" aria-hidden="true">
        <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    key: "total_unique_visitors",
    label: "Pengunjung Unik",
    description: "Pengunjung yang teridentifikasi",
    color: "amber",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7" aria-hidden="true">
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20v-1.5A4.5 4.5 0 0 1 7 14h4a4.5 4.5 0 0 1 4.5 4.5V20M16 5a3.5 3.5 0 0 1 0 6.8M18 14.5a4.5 4.5 0 0 1 3.5 4.5V20" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "unique_visitors_today",
    label: "Pengunjung Hari Ini",
    description: "Pengunjung pada hari ini",
    color: "blue",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7" aria-hidden="true">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18M8 14h3M8 17h6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "page_views_this_month",
    label: "Tayangan Bulan Ini",
    description: "Total tayangan bulan berjalan",
    color: "amber",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7" aria-hidden="true">
        <path d="M3 3v18h18M7 14l4-4 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 6h4v4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
] as const;

function MiniChart({ color }: { color: "blue" | "amber" }) {
  const stroke = color === "blue" ? "#2563eb" : "#eab308";
  const fill = color === "blue" ? "#dbeafe" : "#fef3c7";

  return (
    <svg
      viewBox="0 0 100 48"
      className="h-12 w-24 shrink-0"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`chart-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity="0.9" />
          <stop offset="100%" stopColor={fill} stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {color === "blue" ? (
        <>
          <path d="M2 39 C14 31, 18 37, 29 28 S47 35, 57 19 S75 24, 84 12 S94 10, 98 4 L98 47 L2 47 Z" fill={`url(#chart-${color})`} />
          <path d="M2 39 C14 31, 18 37, 29 28 S47 35, 57 19 S75 24, 84 12 S94 10, 98 4" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M2 37 C15 34, 20 22, 32 27 S49 40, 61 24 S81 8, 98 7 L98 47 L2 47 Z" fill={`url(#chart-${color})`} />
          <path d="M2 37 C15 34, 20 22, 32 27 S49 40, 61 24 S81 8, 98 7" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function MiniBars() {
  return (
    <div className="flex h-12 w-24 shrink-0 items-end justify-end gap-1.5" aria-hidden="true">
      <span className="h-4 w-2.5 rounded-t-sm bg-blue-200" />
      <span className="h-6 w-2.5 rounded-t-sm bg-blue-300" />
      <span className="h-8 w-2.5 rounded-t-sm bg-blue-400" />
      <span className="h-11 w-2.5 rounded-t-sm bg-blue-600" />
    </div>
  );
}

export default function VisitorStatsPublic() {
  const [stats, setStats] = useState<Stats>(initialStats);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadStats() {
      try {
        const response = await fetch("/api/visitor/summary", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil statistik");
        }

        const result = await response.json();

        if (!controller.signal.aborted) {
          setStats({
            total_page_views: Number(result.total_page_views) || 0,
            page_views_this_month: Number(result.page_views_this_month) || 0,
            total_unique_visitors: Number(result.total_unique_visitors) || 0,
            unique_visitors_today: Number(result.unique_visitors_today) || 0,
          });
          setFailed(false);
        }
      } catch {
        if (!controller.signal.aborted) setFailed(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadStats();

    return () => controller.abort();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item, index) => {
        const value = stats[item.key];
        const isAmber = item.color === "amber";

        return (
          <article
            key={item.key}
            className="group relative overflow-hidden rounded-2xl border border-white/90 bg-white p-6 shadow-[0_8px_30px_rgba(37,99,235,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_40px_rgba(37,99,235,0.13)] sm:p-7"
          >
            {/* Garis aksen */}
            <div
              className={`absolute inset-x-0 top-0 h-1 ${
                isAmber ? "bg-amber-400" : "bg-blue-700"
              }`}
            />

            {/* Ornamen lingkaran */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full transition-transform duration-500 group-hover:scale-125 ${
                isAmber ? "bg-amber-50" : "bg-blue-50"
              }`}
            />

            {/* Judul dan ikon */}
            <div className="relative flex min-h-[60px] items-center justify-between gap-3">
              <h3 className="max-w-[165px] text-sm font-bold leading-6 text-slate-700">
                {item.label}
              </h3>

              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105 ${
                  isAmber
                    ? "bg-amber-50 text-amber-600 group-hover:bg-amber-100"
                    : "bg-blue-50 text-blue-700 group-hover:bg-blue-100"
                }`}
              >
                {item.icon}
              </div>
            </div>

            {/* Angka dan grafik */}
            <div className="mt-6 flex min-h-[60px] items-end justify-between gap-2">
              <p className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-[42px]">
                {loading ? (
                  <span className="inline-block h-10 w-20 animate-pulse rounded-lg bg-slate-100" />
                ) : failed ? (
                  <span className="text-sm font-semibold text-slate-400">
                    Tidak tersedia
                  </span>
                ) : (
                  numberFormat.format(value)
                )}
              </p>

              {index === 2 ? (
                <MiniBars />
              ) : (
                <MiniChart color={item.color} />
              )}
            </div>

            {/* Deskripsi */}
            <p className="mt-4 min-h-10 text-xs leading-5 text-slate-500 sm:text-sm">
              {item.description}
            </p>

            {/* Garis indikator bawah */}
            <div className="mt-4 h-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isAmber ? "w-1/3 bg-amber-400" : "w-1/4 bg-blue-700"
                }`}
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}
