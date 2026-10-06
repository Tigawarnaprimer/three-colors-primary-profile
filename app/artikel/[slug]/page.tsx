"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
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

export default function ArtikelDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;

    async function loadArticle() {
      setLoading(true);

      const { data: articleData, error } = await supabase
        .from("artikel")
        .select(
          "id, judul, slug, kategori, tanggal, ringkasan, isi, gambar_url, status"
        )
        .eq("slug", slug)
        .eq("status", "Aktif")
        .single();

      if (error || !articleData) {
        console.error("Gagal mengambil artikel:", error);
        setArticle(null);
        setLoading(false);
        return;
      }

      const currentArticle = articleData as Article;
      setArticle(currentArticle);

      const { data: relatedData, error: relatedError } = await supabase
        .from("artikel")
        .select(
          "id, judul, slug, kategori, tanggal, ringkasan, isi, gambar_url, status"
        )
        .eq("status", "Aktif")
        .neq("slug", slug)
        .order("tanggal", { ascending: false })
        .limit(3);

      if (relatedError) {
        console.error("Gagal mengambil artikel lainnya:", relatedError);
      }

      setRelatedArticles((relatedData ?? []) as Article[]);
      setLoading(false);
    }

    loadArticle();
  }, [slug]);

  function getArticleUrl() {
    if (typeof window === "undefined") return "";

    return `${window.location.origin}/artikel/${article?.slug ?? ""}`;
  }

  function shareWhatsApp() {
    const url = getArticleUrl();

    const text = `${article?.judul ?? "Artikel"}\n\nBaca selengkapnya: ${url}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function shareFacebook() {
    const url = getArticleUrl();

    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function shareX() {
    const url = getArticleUrl();

    const text = article?.judul ?? "Artikel";

    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  async function copyLink() {
    const url = getArticleUrl();

    try {
      if (navigator.share) {
        await navigator.share({
          title: article?.judul ?? "Artikel",
          text: article?.ringkasan ?? "",
          url,
        });

        return;
      }

      await navigator.clipboard.writeText(url);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Gagal membagikan artikel:", error);
    }
  }

  if (loading) {
    return (
      <main className="pt-20 bg-white">
        <section className="py-24">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-4xl">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />

              <div className="mt-5 h-12 md:h-16 w-full max-w-4xl bg-gray-200 rounded animate-pulse" />

              <div className="mt-6 h-4 w-64 bg-gray-200 rounded animate-pulse" />
            </div>

            <div className="mt-12 w-full aspect-[16/8.5] bg-gray-100 rounded-2xl animate-pulse" />
          </div>
        </section>
      </main>
    );
  }

  if (!article) {
    notFound();
  }

  const paragraphs = article.isi
    ? article.isi
        .split(/\r?\n+/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
    : [];

  return (
    <main className="pt-20 bg-white">
      {/* =========================
          BREADCRUMB
      ========================= */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-5">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link
              href="/"
              className="hover:text-blue-700 transition"
            >
              Beranda
            </Link>

            <span>/</span>

            <Link
              href="/artikel"
              className="hover:text-blue-700 transition"
            >
              Artikel
            </Link>

            <span>/</span>

            <span className="text-gray-700 truncate">
              {article.kategori}
            </span>
          </div>
        </div>
      </section>

      {/* =========================
          ARTICLE HEADER
      ========================= */}
      <section className="pt-10 md:pt-14">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="max-w-4xl">
            {/* Category */}
            <Link
              href="/artikel"
              className="inline-flex text-sm font-semibold text-blue-700 hover:text-blue-900 transition"
            >
              {article.kategori}
            </Link>

            {/* Title */}
            <h1 className="mt-4 text-3xl md:text-5xl lg:text-[52px] font-bold text-blue-950 leading-[1.12]">
              {article.judul}
            </h1>

            {/* Meta */}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
              <span>{formatDate(article.tanggal)}</span>

              <span className="hidden sm:block w-1 h-1 rounded-full bg-gray-300" />

              <span>
                Oleh{" "}
                <span className="font-medium text-gray-700">
                  PT Tiga Warna Primer
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <section className="py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-12">
            {/* =========================
                ARTICLE
            ========================= */}
            <article>
              {/* Featured Image */}
              <div className="relative w-full aspect-[16/8.5] rounded-2xl overflow-hidden bg-gray-100">
                {article.gambar_url ? (
                  <img
                    src={article.gambar_url}
                    alt={article.judul}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <svg
                        className="w-10 h-10 mx-auto text-gray-300"
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

                      <p className="mt-2 text-sm text-gray-400">
                        Tidak ada gambar
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Excerpt */}
              <p className="mt-8 text-lg md:text-xl font-medium text-gray-700 leading-8">
                {article.ringkasan}
              </p>

              {/* Content */}
              <div className="mt-8">
                {paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="mb-6 text-base md:text-[17px] text-gray-700 leading-8"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* =========================
                  SHARE ARTICLE
              ========================= */}
              <div className="mt-10 pt-7 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                  <div>
                    <p className="text-sm font-semibold text-blue-950">
                      Bagikan Artikel
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Bagikan informasi ini melalui media sosial.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* WhatsApp */}
                    <button
                      type="button"
                      onClick={shareWhatsApp}
                      aria-label="Bagikan ke WhatsApp"
                      title="WhatsApp"
                      className="w-10 h-10 rounded-full bg-green-50 text-green-600 border border-green-100 flex items-center justify-center hover:bg-green-600 hover:text-white transition"
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M20.52 3.48A11.83 11.83 0 0012.04 0C5.5 0 .17 5.33.17 11.87c0 2.09.55 4.13 1.59 5.93L.1 24l6.35-1.66a11.88 11.88 0 005.59 1.42h.01c6.54 0 11.87-5.33 11.87-11.87 0-3.17-1.23-6.15-3.4-8.41zM12.05 21.8h-.01a9.9 9.9 0 01-5.05-1.38l-.36-.21-3.77.99 1.01-3.67-.23-.38a9.9 9.9 0 01-1.52-5.28C2.12 6.4 6.57 1.95 12.04 1.95c2.65 0 5.14 1.03 7.01 2.91a9.85 9.85 0 012.9 7.02c0 5.47-4.44 9.92-9.9 9.92zm5.44-7.43c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.67-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.09 4.5.71.31 1.26.49 1.69.63.71.23 1.35.2 1.86.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
                      </svg>
                    </button>

                    {/* Facebook */}
                    <button
                      type="button"
                      onClick={shareFacebook}
                      aria-label="Bagikan ke Facebook"
                      title="Facebook"
                      className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center hover:bg-blue-600 hover:text-white transition"
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M14 8h3V4h-3c-3.31 0-5 1.69-5 5v3H6v4h3v8h4v-8h3.5l.5-4H13V9c0-.67.33-1 1-1z" />
                      </svg>
                    </button>

                    {/* X */}
                    <button
                      type="button"
                      onClick={shareX}
                      aria-label="Bagikan ke X"
                      title="X"
                      className="w-10 h-10 rounded-full bg-gray-50 text-gray-700 border border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:text-white transition"
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.41L6.47 22H3.36l7.24-8.28L2.8 2h6.4l4.42 5.84L18.9 2zm-1.09 17.67h1.72L8.26 4.2H6.42l11.39 15.47z" />
                      </svg>
                    </button>

                    {/* Copy / Share */}
                    <button
                      type="button"
                      onClick={copyLink}
                      aria-label="Bagikan atau salin link"
                      title={copied ? "Link berhasil disalin" : "Salin Link"}
                      className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 border border-yellow-100 flex items-center justify-center hover:bg-yellow-500 hover:text-white transition"
                    >
                      {copied ? (
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.828 10.172a4 4 0 010 5.656l-2 2a4 4 0 01-5.656-5.656l1-1"
                          />

                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.172 13.828a4 4 0 010-5.656l2-2a4 4 0 015.656 5.656l-1 1"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Copy success message */}
                {copied && (
                  <p className="mt-3 text-xs font-medium text-green-600">
                    Link artikel berhasil disalin.
                  </p>
                )}
              </div>

              {/* Back */}
              <div className="mt-7 pt-7 border-t border-gray-200">
                <Link
                  href="/artikel"
                  className="text-sm font-semibold text-blue-700 hover:text-blue-900 transition"
                >
                  ← Kembali ke Artikel
                </Link>
              </div>
            </article>

            {/* =========================
                SIDEBAR
            ========================= */}
            <aside className="lg:pt-[calc((100vw-768px)/100000)]">
              <div className="lg:sticky lg:top-28">
                <div className="border border-gray-200 rounded-2xl p-6">
                  <p className="text-xs font-semibold tracking-[0.15em] uppercase text-blue-700">
                    Artikel Lainnya
                  </p>

                  {relatedArticles.length > 0 ? (
                    <div className="mt-5 space-y-5">
                      {relatedArticles.map((item) => (
                        <Link
                          key={item.id}
                          href={`/artikel/${item.slug}`}
                          className="group block"
                        >
                          {/* Image */}
                          <div className="relative w-full h-32 rounded-xl overflow-hidden bg-gray-100">
                            {item.gambar_url ? (
                              <img
                                src={item.gambar_url}
                                alt={item.judul}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg
                                  className="w-7 h-7 text-gray-300"
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
                              </div>
                            )}
                          </div>

                          {/* Category */}
                          <p className="mt-3 text-xs font-semibold text-blue-700">
                            {item.kategori}
                          </p>

                          {/* Title */}
                          <h3 className="mt-1 text-sm font-bold text-blue-950 leading-5 group-hover:text-blue-700 transition">
                            {item.judul}
                          </h3>

                          {/* Date */}
                          <p className="mt-1 text-xs text-gray-400">
                            {formatDate(item.tanggal)}
                          </p>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-5 text-sm text-gray-400">
                      Belum ada artikel lainnya.
                    </p>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}