"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function AdminLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // Login menggunakan Supabase Auth
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        console.error("Login Supabase gagal:", loginError);

        if (loginError.message === "Invalid login credentials") {
          setError("Email atau password salah.");
        } else {
          setError(loginError.message);
        }

        setLoading(false);
        return;
      }

      // Pastikan session berhasil dibuat
      if (!data.session || !data.user) {
        console.error("Session Supabase tidak ditemukan:", data);

        setError(
          "Login berhasil tetapi session administrator tidak berhasil dibuat."
        );

        setLoading(false);
        return;
      }

      console.log("Login Supabase berhasil:", {
        userId: data.user.id,
        email: data.user.email,
      });

      // Tetap simpan status login untuk sistem admin yang sudah ada
      sessionStorage.setItem("adminLoggedIn", "true");

      // Ambil halaman tujuan jika sebelumnya diarahkan ke login
      const redirect = searchParams.get("redirect");

      // Pastikan redirect hanya menuju halaman admin
      if (redirect && redirect.startsWith("/admin/")) {
        router.push(redirect);
      } else {
        router.push("/admin/dashboard");
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat login:", error);

      setError("Terjadi kesalahan saat login. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex bg-white">

      {/* =====================================================
          LEFT BRAND PANEL
      ====================================================== */}
      <section className="hidden lg:flex lg:w-[44%] relative overflow-hidden bg-slate-950">

        {/* Texture */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(255,255,255,0.18) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255,255,255,0.18) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "42px 42px",
          }}
        />

        {/* Large decorative circles */}
        <div className="absolute -top-44 -right-44 w-[580px] h-[580px] rounded-full border border-blue-400/20" />

        <div className="absolute -bottom-52 -left-52 w-[650px] h-[650px] rounded-full border border-red-400/15" />

        {/* Soft grey shapes */}
        <div className="absolute top-20 right-[-100px] w-80 h-80 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="absolute bottom-20 left-[-100px] w-80 h-80 rounded-full bg-red-500/15 blur-3xl" />

        {/* Content */}
        <div className="relative z-10 w-full flex flex-col justify-between p-12 xl:p-16">

          {/* Logo */}
          <div>
            <Link href="/" className="inline-block">
              <img
                src="/images/logo.jpg"
                alt="PT Tiga Warna Primer"
                className="w-[220px] h-auto object-contain"
              />
            </Link>
          </div>

          {/* Main */}
          <div className="max-w-xl">

            {/* Brand colors */}
            <div className="flex items-center gap-2 mb-7">
              <span className="w-3.5 h-3.5 rounded-full bg-red-500" />
              <span className="w-3.5 h-3.5 rounded-full bg-yellow-400" />
              <span className="w-3.5 h-3.5 rounded-full bg-blue-500" />
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-200">
              Textile Dye & Chemical Specialist
            </p>

            <h1 className="mt-5 text-4xl xl:text-[46px] font-bold leading-[1.12] text-white">
              Menciptakan Warna,
              <br />
              Mendefinisikan Kualitas.
            </h1>

            <p className="mt-6 max-w-md text-sm leading-7 text-slate-300">
              Kelola informasi perusahaan dan konten website
              PT Tiga Warna Primer melalui sistem administrasi
              yang terintegrasi.
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-end justify-between">

            <div>
              <p className="text-xs text-slate-300">
                © {new Date().getFullYear()} PT Tiga Warna Primer
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Tangerang, Indonesia
              </p>
            </div>

            {/* Brand line */}
            <div className="flex items-center gap-1">
              <span className="w-7 h-1 rounded-full bg-red-500" />
              <span className="w-7 h-1 rounded-full bg-yellow-400" />
              <span className="w-7 h-1 rounded-full bg-blue-500" />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          RIGHT LOGIN AREA
      ====================================================== */}
      <section className="relative w-full lg:w-[56%] min-h-screen flex items-center justify-center bg-[#f7faff] px-5 py-10 overflow-hidden">

        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-[0.5] pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(
                rgba(37,99,235,0.07) 0.8px,
                transparent 0.8px
              )
            `,
            backgroundSize: "20px 20px",
          }}
        />

        {/* Soft shapes */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-200/40 blur-3xl" />

        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-red-200/30 blur-3xl" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-[430px]">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-block">
              <img
                src="/images/logo.jpg"
                alt="PT Tiga Warna Primer"
                className="h-24 w-auto mx-auto object-contain"
              />
            </Link>

            <div className="flex justify-center gap-2 mt-4">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="w-3 h-3 rounded-full bg-blue-600" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
            </div>
          </div>

          {/* =================================================
              LOGIN HEADER
          ================================================= */}
          <div className="mb-7">
            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 via-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M12 3 5 6v5c0 4.5 2.9 8.3 7 10 4.1-1.7 7-5.5 7-10V6l-7-3Z" />

                  <path
                    d="m9.5 12 1.7 1.7 3.5-3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Administrator
                </p>

                <h2 className="text-xl font-bold text-slate-900">
                  Admin Panel
                </h2>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-500">
              Masuk untuk mengelola informasi dan konten
              website PT Tiga Warna Primer.
            </p>
          </div>

          {/* =================================================
              LOGIN CARD
          ================================================= */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-[0_25px_70px_rgba(30,64,175,0.12)] overflow-hidden">

            {/* Top accent */}
            <div className="h-1 flex">
              <div className="w-1/3 bg-gradient-to-r from-red-500 to-red-400" />
              <div className="w-1/3 bg-gradient-to-r from-yellow-400 to-amber-300" />
              <div className="w-1/3 bg-gradient-to-r from-blue-500 to-cyan-400" />
            </div>

            <div className="p-7 md:p-8">

              <form onSubmit={handleLogin} className="space-y-5">

                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Email Administrator
                  </label>

                  <div className="relative group">

                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <rect
                          x="3"
                          y="5"
                          width="18"
                          height="14"
                          rx="2"
                        />

                        <path d="m3 7 9 6 9-6" />
                      </svg>
                    </div>

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@tigawarnaprimer.com"
                      autoComplete="email"
                      required
                      className="
                        w-full
                        h-13
                        pl-12
                        pr-4
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        text-sm
                        text-slate-800
                        placeholder:text-gray-400
                        outline-none
                        transition
                        focus:bg-white
                        focus:border-blue-500
                        focus:ring-4
                        focus:ring-blue-100
                      "
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Password
                    </label>
                  </div>

                  <div className="relative group">

                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <rect
                          x="4"
                          y="10"
                          width="16"
                          height="11"
                          rx="2"
                        />

                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                      </svg>
                    </div>

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password"
                      autoComplete="current-password"
                      required
                      className="
                        w-full
                        h-13
                        pl-12
                        pr-12
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        text-sm
                        text-slate-800
                        placeholder:text-gray-400
                        outline-none
                        transition
                        focus:bg-white
                        focus:border-blue-500
                        focus:ring-4
                        focus:ring-blue-100
                      "
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        w-9
                        h-9
                        rounded-lg
                        flex
                        items-center
                        justify-center
                        text-gray-400
                        hover:text-slate-800
                        hover:bg-blue-50
                        transition
                      "
                    >
                      {showPassword ? (
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M3 3l18 18" />
                          <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />

                          <path d="M9.9 4.2A10.7 10.7 0 0 1 12 4c5 0 8.5 4 9.5 6-.4.8-1.3 2.1-2.7 3.3" />

                          <path d="M6.2 6.2C4.5 7.4 3.3 9 2.5 10c1 2 4.5 6 9.5 6 1 0 1.9-.2 2.7-.5" />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />

                          <circle
                            cx="12"
                            cy="12"
                            r="2.5"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* ERROR */}
                {error && (
                  <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3">

                    <svg
                      className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                      />

                      <path d="M12 8v4" />

                      <path d="M12 16h.01" />
                    </svg>

                    <p className="text-sm text-red-600">
                      {error}
                    </p>
                  </div>
                )}

                {/* LOGIN BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full
                    h-13
                    rounded-xl
                    bg-[#2f2f2f]
                    hover:bg-[#1f1f1f]
                    disabled:bg-gray-400
                    text-white
                    text-sm
                    font-bold
                    flex
                    items-center
                    justify-center
                    gap-2
                    transition
                    shadow-sm
                    hover:shadow-lg
                    active:scale-[0.99]
                  "
                >
                  {loading ? (
                    <>
                      <svg
                        className="w-5 h-5 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="currentColor"
                          strokeWidth="2"
                          opacity="0.3"
                        />

                        <path
                          d="M21 12a9 9 0 0 0-9-9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>

                      Memproses...
                    </>
                  ) : (
                    <>
                      Masuk ke Dashboard

                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          d="M5 12h14"
                          strokeLinecap="round"
                        />

                        <path
                          d="m13 6 6 6-6 6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {/* Security information */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <div className="flex items-center gap-3">

                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M12 3 5 6v5c0 4.5 2.9 8.3 7 10 4.1-1.7 7-5.5 7-10V6l-7-3Z" />
                    </svg>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      Akses Administrator
                    </p>

                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Halaman ini khusus untuk pengelola website.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back */}
          <div className="text-center mt-6">
            <Link
              href="/"
              className="
                inline-flex
                items-center
                gap-2
                text-sm
                font-medium
                text-gray-500
                hover:text-slate-800
                transition
              "
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M19 12H5"
                  strokeLinecap="round"
                />

                <path
                  d="m12 19-7-7 7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              Kembali ke Website
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}