
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jakartaDateParts() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value])
  );

  return {
    year: values.year,
    month: values.month,
    day: values.day,
  };
}

export async function GET() {
  try {
    const { year, month, day } = jakartaDateParts();

    const todayStart = `${year}-${month}-${day}T00:00:00+07:00`;
    const tomorrowDate = new Date(
      new Date(todayStart).getTime() + 24 * 60 * 60 * 1000
    );
    const tomorrowStart = tomorrowDate.toISOString();

    const monthStart = `${year}-${month}-01T00:00:00+07:00`;

    // Total tayangan sepanjang waktu
    const totalViewsResult = await supabaseAdmin
      .from("website_page_views")
      .select("id", { count: "exact", head: true });

    // Total pengunjung unik sepanjang waktu
    const totalVisitorsResult = await supabaseAdmin
      .from("website_visitors")
      .select("id", { count: "exact", head: true });

    // Tayangan sejak awal bulan berjalan
    const monthlyViewsResult = await supabaseAdmin
      .from("website_page_views")
      .select("id", { count: "exact", head: true })
      .gte("visited_at", monthStart);

    // Pengunjung yang membuka website hari ini
    const todayVisitorsResult = await supabaseAdmin
      .from("website_page_views")
      .select("visitor_id")
      .gte("visited_at", todayStart)
      .lt("visited_at", tomorrowStart)
      .limit(10000);

    const results = [
      totalViewsResult,
      totalVisitorsResult,
      monthlyViewsResult,
      todayVisitorsResult,
    ];

    const failedResult = results.find((result) => result.error);

    if (failedResult?.error) {
      console.error("Gagal mengambil ringkasan pengunjung:", failedResult.error);

      return NextResponse.json(
        { error: "Gagal mengambil statistik dari database." },
        { status: 500 }
      );
    }

    const uniqueToday = new Set(
      (todayVisitorsResult.data ?? []).map((row) => row.visitor_id)
    ).size;

    return NextResponse.json(
      {
        total_page_views: totalViewsResult.count ?? 0,
        page_views_this_month: monthlyViewsResult.count ?? 0,
        total_unique_visitors: totalVisitorsResult.count ?? 0,
        unique_visitors_today: uniqueToday,
      },
      {
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error) {
    console.error("Kesalahan API ringkasan pengunjung:", error);

    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
