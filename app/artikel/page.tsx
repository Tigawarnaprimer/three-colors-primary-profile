"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Article = {
  id: number;
  judul: string;
  slug: string;
  kategori: string;
  tanggal: string;
  ringkasan: string;
  isi: string;
  gambar_url: string | null;
  status: "Aktif" | "Nonaktif";
};

export default function ArtikelPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    setLoading(true);

    const { data, error } = await supabase
      .from("artikel")
      .select(
        "id, judul, slug, kategori, tanggal, ringkasan, isi, gambar_url, status"
      )
      .eq("status", "Aktif")
      .order("tanggal", { ascending: false });

    if (error) {
      console.error("Gagal mengambil data artikel:", error);
      setArticles([]);
    } else {
      setArticles((data ?? []) as Article[]);
    }

    setLoading(false);
  }

  function formatDate(date: string) {
    if (!date) return "";

    const [year, month, day] = date.split("-");

    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    return `${Number(day)} ${monthNames[Number(month) - 1]} ${year}`;
  }

  return (
    <main className="pt-20 bg-white">
    
    {/* Hero */}
<section className="relative overflow-hidden bg-blue-950">

  {/* ================= BACKGROUND SHAPES ================= */}

  <div
    className="
      absolute
      -left-32
      -top-40
      h-[28rem]
      w-[28rem]
      rounded-full
      bg-blue-900/40
    "
  />

  <div
    className="
      absolute
      -right-40
      -top-48
      h-[30rem]
      w-[30rem]
      rounded-full
      bg-blue-900/40
    "
  />

  <div
    className="
      absolute
      -bottom-48
      -left-32
      h-[32rem]
      w-[32rem]
      rounded-full
      bg-blue-900/30
    "
  />

  {/* ================= DOT PATTERN ================= */}

  <div
    className="absolute left-4 top-4 h-36 w-36 opacity-60"
    style={{
      backgroundImage:
        "radial-gradient(circle, rgba(37, 129, 255, 0.8) 2px, transparent 2px)",
      backgroundSize: "18px 18px",
    }}
  />

  <div
    className="absolute bottom-4 right-4 h-36 w-36 opacity-50"
    style={{
      backgroundImage:
        "radial-gradient(circle, rgba(37, 129, 255, 0.7) 2px, transparent 2px)",
      backgroundSize: "18px 18px",
    }}
  />

  {/* ================= FLOWING LINES ================= */}

  <svg
    className="
      pointer-events-none
      absolute
      -bottom-16
      left-0
      h-[360px]
      w-full
      opacity-60
    "
    viewBox="0 0 1440 360"
    fill="none"
    preserveAspectRatio="none"
  >
    <path
      d="M-100 230 C300 380 650 380 1000 180 C1190 70 1330 30 1540 -50"
      stroke="#1687ff"
      strokeWidth="1.2"
    />
    <path
      d="M-100 245 C300 395 660 395 1010 195 C1200 85 1340 45 1540 -35"
      stroke="#1687ff"
      strokeWidth="1.2"
    />
    <path
      d="M-100 260 C300 410 670 410 1020 210 C1210 100 1350 60 1540 -20"
      stroke="#1687ff"
      strokeWidth="1.2"
    />
    <path
      d="M-100 275 C300 425 680 425 1030 225 C1220 115 1360 75 1540 -5"
      stroke="#1687ff"
      strokeWidth="1.2"
    />
    <path
      d="M-100 290 C300 440 690 440 1040 240 C1230 130 1370 90 1540 10"
      stroke="#1687ff"
      strokeWidth="1.2"
    />
    <path
      d="M-100 305 C300 455 700 455 1050 255 C1240 145 1380 105 1540 25"
      stroke="#1687ff"
      strokeWidth="1.2"
    />
  </svg>

  {/* ================= RIGHT FLOWING LINES ================= */}

  <svg
    className="
      pointer-events-none
      absolute
      right-0
      top-0
      h-full
      w-[45%]
      opacity-50
    "
    viewBox="0 0 650 700"
    fill="none"
    preserveAspectRatio="none"
  >
    <path
      d="M700 -100 C520 80 530 230 400 340 C300 425 170 500 0 570"
      stroke="#1687ff"
      strokeWidth="1"
    />
    <path
      d="M720 -80 C540 100 550 250 420 360 C320 445 190 520 20 590"
      stroke="#1687ff"
      strokeWidth="1"
    />
    <path
      d="M740 -60 C560 120 570 270 440 380 C340 465 210 540 40 610"
      stroke="#1687ff"
      strokeWidth="1"
    />
    <path
      d="M760 -40 C580 140 590 290 460 400 C360 485 230 560 60 630"
      stroke="#1687ff"
      strokeWidth="1"
    />
    <path
      d="M780 -20 C600 160 610 310 480 420 C380 505 250 580 80 650"
      stroke="#1687ff"
      strokeWidth="1"
    />
    <path
      d="M800 0 C620 180 630 330 500 440 C400 525 270 600 100 670"
      stroke="#1687ff"
      strokeWidth="1"
    />
  </svg>

  {/* ================= CONTENT ================= */}

  <div
    className="
      relative
      mx-auto
      max-w-6xl
      px-6
      py-24
      md:py-28
      lg:px-8
    "
  >
    <div className="max-w-4xl">

      {/* Label */}
      <div className="flex items-center gap-4">
        <span className="h-[3px] w-16 bg-yellow-400" />

        <p
          className="
            text-sm
            font-bold
            uppercase
            tracking-[0.25em]
            text-yellow-400
            md:text-base
          "
        >
          Artikel
        </p>
      </div>

      {/* Heading */}
      <h1
        className="
          mt-7
          max-w-5xl
          text-4xl
          font-bold
          leading-[1.08]
          tracking-tight
          text-white
          md:text-5xl
          lg:text-6xl
        "
      >
        Informasi Seputar
        <span className="block text-yellow-400">
          Industri Tekstil
        </span>
      </h1>

      {/* Description */}
      <p
        className="
          mt-7
          max-w-3xl
          text-base
          leading-8
          text-blue-100
          md:text-lg
          lg:text-xl
        "
      >
        Temukan informasi dan wawasan mengenai pewarna tekstil, bahan kimia
        tekstil, serta perkembangan industri tekstil.
      </p>

    </div>
  </div>

</section>
      {/* =========================
          ARTIKEL
      ========================= */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-blue-700 text-sm font-semibold tracking-[0.15em] uppercase">
              Wawasan
            </p>

            <h2 className="mt-2 text-2xl md:text-3xl font-bold text-blue-950">
              Artikel Terbaru
            </h2>
          </div>

          {/* =========================
              LOADING
          ========================= */}
          {loading && (
            <div className="py-16 text-center">
              <div className="w-8 h-8 mx-auto border-2 border-blue-100 border-t-blue-700 rounded-full animate-spin" />

              <p className="mt-4 text-sm text-gray-400">
                Memuat artikel...
              </p>
            </div>
          )}

          {/* =========================
              EMPTY
          ========================= */}
          {!loading && articles.length === 0 && (
            <div className="py-16 text-center border border-gray-200 rounded-2xl bg-gray-50">
              <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 5.5A2.5 2.5 0 016.5 3H20v17H6.5A2.5 2.5 0 014 17.5v-12z"
                  />

                  <path
                    strokeLinecap="round"
                    d="M4 17.5A2.5 2.5 0 016.5 15H20"
                  />
                </svg>
              </div>

              <h3 className="mt-4 text-base font-bold text-gray-700">
                Belum ada artikel
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                Artikel terbaru akan ditampilkan di halaman ini.
              </p>
            </div>
          )}

          {/* =========================
              ARTICLE GRID
          ========================= */}
          {!loading && articles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* IMAGE */}
                  <Link href={`/artikel/${article.slug}`}>
                    <div className="relative h-56 overflow-hidden bg-gray-100">
                      {article.gambar_url ? (
                        <img
                          src={article.gambar_url}
                          alt={article.judul}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <svg
                              className="w-8 h-8 mx-auto text-gray-300"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            >
                              <rect
                                x="3"
                                y="3"
                                width="18"
                                height="18"
                                rx="2"
                              />

                              <circle
                                cx="8.5"
                                cy="8.5"
                                r="1.5"
                              />

                              <path d="M21 15l-5-5L5 21" />
                            </svg>

                            <p className="mt-2 text-xs text-gray-400">
                              Tidak ada gambar
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* CONTENT */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs mb-4">
                      <span className="text-blue-700 font-semibold">
                        {article.kategori}
                      </span>

                      <span className="text-gray-400">
                        {formatDate(article.tanggal)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-blue-950 leading-snug group-hover:text-blue-700 transition-colors">
                      {article.judul}
                    </h3>

                    <p className="mt-3 text-sm text-gray-600 leading-6 line-clamp-3">
                      {article.ringkasan}
                    </p>

                    <Link
                      href={`/artikel/${article.slug}`}
                      className="inline-flex items-center mt-5 text-sm font-semibold text-blue-700 hover:text-blue-900 transition"
                    >
                      Baca Selengkapnya

                      <span className="ml-2 transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}