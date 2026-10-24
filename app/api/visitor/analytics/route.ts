
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // 1. Ambil token sesi administrator
    const authorization = request.headers.get("authorization");
    const token = authorization?.startsWith("Bearer ")
      ? authorization.slice(7)
      : "";

    if (!token) {
      return NextResponse.json(
        { error: "Sesi login diperlukan." },
        { status: 401 }
      );
    }

    // 2. Ambil konfigurasi Supabase
    const supabaseUrl =
      process.env.SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const publishableKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !publishableKey) {
      console.error(
        "Konfigurasi Supabase untuk verifikasi sesi belum lengkap."
      );

      return NextResponse.json(
        { error: "Konfigurasi autentikasi server belum lengkap." },
        { status: 500 }
      );
    }

    // 3. Validasi token ke Supabase Auth
    const authClient = createClient(
      supabaseUrl,
      publishableKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { data: authData, error: authError } =
      await authClient.auth.getUser(token);

    if (authError || !authData.user) {
      return NextResponse.json(
        {
          error:
            "Sesi login tidak valid atau sudah berakhir.",
        },
        { status: 401 }
      );
    }

    // 4. Validasi periode yang diminta
    const requestedDays = Number(
      new URL(request.url).searchParams.get("days") ?? "30"
    );

    if (![7, 30, 90].includes(requestedDays)) {
      return NextResponse.json(
        { error: "Periode harus 7, 30, atau 90 hari." },
        { status: 400 }
      );
    }

    // 5. Ambil data agregat dari fungsi Supabase
    const { data, error } = await supabaseAdmin.rpc(
      "get_website_analytics",
      { p_days: requestedDays }
    );

    if (error) {
      console.error(
        "Gagal mengambil analitik website:",
        error
      );

      return NextResponse.json(
        { error: "Gagal mengambil data analitik." },
        { status: 500 }
      );
    }

    // 6. Kirim hasil tanpa cache
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Kesalahan API analitik:", error);

    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
