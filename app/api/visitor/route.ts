
import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE_NAME = "website_visitor_id";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const rawPath = body?.path;

    if (
      typeof rawPath !== "string" ||
      !rawPath.startsWith("/") ||
      rawPath.startsWith("//") ||
      rawPath.length > 500 ||
      rawPath.includes("\\")
    ) {
      return NextResponse.json(
        { error: "Path halaman tidak valid." },
        { status: 400 }
      );
    }

    // Hanya simpan pathname, bukan query string atau URL penuh.
    const pagePath = rawPath.split("?")[0].split("#")[0];

    const existingVisitorId = request.cookies.get(
      COOKIE_NAME
    )?.value;

    const isValidVisitorId =
      typeof existingVisitorId === "string" &&
      /^[0-9a-f-]{36}$/i.test(existingVisitorId);

    const visitorId = isValidVisitorId
      ? existingVisitorId
      : randomUUID();

    // Daftarkan pengunjung; jika sudah ada, perbarui waktu terakhir.
    const { error: visitorError } = await supabaseAdmin
      .from("website_visitors")
      .upsert(
        {
          visitor_id: visitorId,
          last_seen_at: new Date().toISOString(),
        },
        {
          onConflict: "visitor_id",
        }
      );

    if (visitorError) {
      console.error("Gagal mencatat pengunjung:", visitorError);
      return NextResponse.json(
        { error: "Gagal mencatat pengunjung." },
        { status: 500 }
      );
    }

    // Catat satu kunjungan halaman.
    const { error: viewError } = await supabaseAdmin
      .from("website_page_views")
      .insert({
        visitor_id: visitorId,
        page_path: pagePath,
      });

    if (viewError) {
      console.error("Gagal mencatat halaman:", viewError);
      return NextResponse.json(
        { error: "Gagal mencatat halaman." },
        { status: 500 }
      );
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set(COOKIE_NAME, visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });

    response.headers.set("Cache-Control", "no-store");

    return response;
  } catch (error) {
    console.error("Kesalahan API statistik:", error);

    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
