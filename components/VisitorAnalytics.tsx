
"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type DailyPoint = {
  date: string;
  pageViews: number;
};

type PopularPage = {
  path: string;
  pageViews: number;
};

type AnalyticsData = {
  periodDays: number;
  daily: DailyPoint[];
  popularPages: PopularPage[];
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(`${date}T12:00:00+07:00`));
}

function formatPath(path: string) {
  if (path === "/") return "Beranda";
  return path.split("/").filter(Boolean).join(" / ").replace(/-/g, " ");
}

export default function VisitorAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [days, setDays] = useState(30);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = useCallback(async (signal: AbortSignal) => {
    setLoading(true);
    setError("");

    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError || !sessionData.session?.access_token) {
        throw new Error("Sesi administrator tidak ditemukan. Silakan login kembali.");
      }

      const response = await fetch(
        `/api/visitor/analytics?days=${days}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionData.session.access_token}`,
          },
          cache: "no-store",
          signal,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal mengambil statistik.");
      }

      setData(result as AnalyticsData);
    } catch (err) {
      if (signal.aborted) return;

      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat memuat statistik."
      );
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    const controller = new AbortController();
    loadAnalytics(controller.signal);

    return () => controller.abort();
  }, [loadAnalytics, refreshKey]);

  const values = data?.daily.map((item) => item.pageViews) ?? [];
  const maxValue = Math.max(1, ...values);
  const chartWidth = 700;
  const chartHeight = 220;
  const left = 12;
  const right = 12;
  const top = 18;
  const bottom = 28;
  const plotWidth = chartWidth - left - right;
  const plotHeight = chartHeight - top - bottom;

  const points = (data?.daily ?? []).map((item, index) => {
    const x = left + (
      index / Math.max(1, (data?.daily.length ?? 1) - 1)
    ) * plotWidth;
    const y = top + plotHeight - (item.pageViews / maxValue) * plotHeight;
    return `${x},${y}`;
  }).join(" ");

  const areaPoints = points
    ? `${left},${top + plotHeight} ${points} ${left + plotWidth},${top + plotHeight}`
    : "";

  const popularMax = Math.max(
    1,
    ...(data?.popularPages.map((item) => item.pageViews) ?? [])
  );

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Analitik Website
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Performa halaman berdasarkan data nyata.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl border border-slate-200 bg-white p-1">
            {[7, 30, 90].map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setDays(period)}
                disabled={loading && days === period}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  days === period
                    ? "bg-blue-700 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {period} hari
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setRefreshKey((key) => key + 1)}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                d="M20 7v5h-5M4 17v-5h5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.5 9A7 7 0 0 1 18 6l2 6M4 12l2 6a7 7 0 0 0 12.5-3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900">Tayangan Halaman</h3>
              <p className="mt-1 text-xs text-slate-500">
                {days} hari terakhir · WIB
              </p>
            </div>
            <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              Harian
            </span>
          </div>

          <p className="text-3xl font-bold text-slate-900">
            {values.reduce((sum, value) => sum + value, 0).toLocaleString("id-ID")}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Total tayangan pada periode pilihan
          </p>

          {loading && !data ? (
            <div className="mt-6 h-56 animate-pulse rounded-xl bg-slate-100" />
          ) : (
            <div className="mt-5 w-full overflow-hidden">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="h-auto w-full"
                role="img"
                aria-label={`Grafik tayangan halaman ${days} hari terakhir`}
              >
                {[0, 1, 2, 3].map((line) => {
                  const y = top + (plotHeight / 3) * line;
                  return (
                    <line
                      key={line}
                      x1={left}
                      y1={y}
                      x2={chartWidth - right}
                      y2={y}
                      stroke="#e2e8f0"
                      strokeDasharray="4 5"
                    />
                  );
                })}

                {areaPoints && (
                  <polygon points={areaPoints} fill="#3b82f6" opacity="0.12" />
                )}

                {data && data.daily.length > 1 && (
                  <polyline
                    points={points}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {data?.daily.map((item, index) => {
                  const x = left + (
                    index / Math.max(1, data.daily.length - 1)
                  ) * plotWidth;
                  const y = top + plotHeight - (
                    item.pageViews / maxValue
                  ) * plotHeight;

                  return (
                    <circle key={item.date} cx={x} cy={y} r="3" fill="#2563eb">
                      <title>
                        {formatDate(item.date)}: {item.pageViews} tayangan
                      </title>
                    </circle>
                  );
                })}

                {data && data.daily.length > 0 && (
                  <>
                    <text x={left} y={chartHeight - 5} fontSize="11" fill="#64748b">
                      {formatDate(data.daily[0].date)}
                    </text>
                    <text
                      x={chartWidth - right}
                      y={chartHeight - 5}
                      textAnchor="end"
                      fontSize="11"
                      fill="#64748b"
                    >
                      {formatDate(data.daily[data.daily.length - 1].date)}
                    </text>
                  </>
                )}
              </svg>

              {values.every((value) => value === 0) && (
                <p className="mt-2 text-center text-xs text-slate-400">
                  Belum ada tayangan pada periode ini.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="font-bold text-slate-900">Halaman Terpopuler</h3>
          <p className="mt-1 text-xs text-slate-500">
            Berdasarkan tayangan {days} hari terakhir.
          </p>

          {loading && !data ? (
            <div className="mt-5 h-56 animate-pulse rounded-xl bg-slate-100" />
          ) : !data?.popularPages.length ? (
            <div className="flex min-h-40 items-center justify-center text-center text-sm text-slate-400">
              Belum ada data halaman.
            </div>
          ) : (
            <div className="mt-5 space-y-5">
              {data.popularPages.map((page, index) => (
                <div key={page.path}>
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="break-words text-sm font-semibold capitalize text-slate-800">
                          {formatPath(page.path)}
                        </p>
                        <p className="mt-0.5 break-all text-xs text-slate-400">
                          {page.path}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-slate-800">
                      {page.pageViews.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="ml-10 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all"
                      style={{
                        width: `${(page.pageViews / popularMax) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
