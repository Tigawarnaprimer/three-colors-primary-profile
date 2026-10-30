
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : "";

  if (!token) {
    return NextResponse.json(
      { error: "Silakan login sebagai administrator." },
      { status: 401 }
    );
  }

  try {
    // Verifikasi token ke Supabase Auth, bukan sessionStorage.
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.getUser(token);

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: "Sesi login tidak valid atau sudah kedaluwarsa." },
        { status: 401 }
      );
    }

    // Hanya mengembalikan angka statistik, bukan data pengunjung mentah.
    const { data, error } = await supabaseAdmin.rpc("get_website_stats");

    if (error) {
      console.error("Gagal mengambil statistik:", error.message);

      return NextResponse.json(
        { error: "Gagal mengambil statistik pengunjung." },
        { status: 500 }
      );
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "private, no-store",
        "Vary": "Authorization",
      },
    });
  } catch (error) {
    console.error("Kesalahan API statistik:", error);

    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
