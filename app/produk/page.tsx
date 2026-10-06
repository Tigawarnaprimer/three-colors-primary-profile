"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Product = {
  id: number;
  nama: string;
  slug: string;
  deskripsi: string | null;
  gambar_url: string | null;
  nomor: string | null;
  status: "Aktif" | "Nonaktif";
};

export default function Produk() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(false);

      const { data, error } = await supabase
        .from("produk")
        .select(
          "id, nama, slug, deskripsi, gambar_url, nomor, status"
        )
        .eq("status", "Aktif")
        .order("nomor", { ascending: true });

      if (error) {
        console.error("Gagal mengambil produk:", error);
        setError(true);
        setProducts([]);
      } else {
        setProducts(data ?? []);
      }

      setLoading(false);
    };

    loadProducts();
  }, []);

  return (
    <main className="pt-20 bg-white">
      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative h-[400px] overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("/images/produk-banner.jpg")',
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative z-10 h-full">
          <div className="max-w-6xl mx-auto h-full px-6 lg:px-8 flex items-center">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="w-10 h-[2px] bg-yellow-400" />

                <p className="text-sm font-semibold tracking-[0.22em] uppercase text-yellow-400">
                  Produk
                </p>
              </div>

              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] text-white">
                Solusi Produk untuk
                <br />
                Industri Tekstil
              </h1>

              <p className="mt-5 max-w-2xl text-base md:text-lg leading-7 text-white/85">
                Produk pewarna dan bahan kimia yang dirancang untuk
                mendukung berbagai kebutuhan proses industri tekstil.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PRODUCT SECTION
      ===================================================== */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-blue-700">
              Produk Kami
            </p>

            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-blue-950">
              Pilihan Produk
            </h2>

            <p className="mt-4 text-gray-600 leading-7">
              Jelajahi kategori produk yang tersedia untuk mendukung
              kebutuhan proses produksi dan pengolahan tekstil.
            </p>
          </div>

          {/* =================================================
              LOADING
          ================================================= */}
          {loading && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden bg-white border border-gray-200 rounded-2xl animate-pulse"
                >
                  <div className="h-64 bg-gray-200" />

                  <div className="p-7">
                    <div className="w-10 h-1 bg-gray-200 rounded-full" />

                    <div className="mt-5 h-6 w-40 bg-gray-200 rounded" />

                    <div className="mt-4 h-4 w-full bg-gray-100 rounded" />
                    <div className="mt-2 h-4 w-4/5 bg-gray-100 rounded" />

                    <div className="mt-6 h-4 w-24 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* =================================================
              ERROR
          ================================================= */}
          {!loading && error && (
            <div className="mt-12 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <p className="text-sm font-semibold text-red-700">
                Data produk tidak dapat dimuat.
              </p>

              <p className="mt-2 text-sm text-red-600">
                Silakan coba kembali beberapa saat lagi.
              </p>
            </div>
          )}

          {/* =================================================
              EMPTY
          ================================================= */}
          {!loading && !error && products.length === 0 && (
            <div className="mt-12 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-8 w-8 text-blue-300"
                >
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="16"
                    rx="2"
                  />

                  <circle
                    cx="8.5"
                    cy="9"
                    r="1.5"
                  />

                  <path d="M3 16l5-5 4 4 3-3 6 6" />
                </svg>
              </div>

              <h3 className="mt-5 text-lg font-bold text-blue-950">
                Belum Ada Produk
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Produk yang aktif akan ditampilkan pada halaman ini.
              </p>
            </div>
          )}

          {/* =================================================
              PRODUCT CARDS
          ================================================= */}
          {!loading && !error && products.length > 0 && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((product, index) => {
                const number =
                  product.nomor ||
                  String(index + 1).padStart(2, "0");

                return (
                  <Link
                    key={product.id}
                    href={`/produk/${product.slug}`}
                    className="
                      group
                      block
                      overflow-hidden
                      bg-white
                      border
                      border-gray-200
                      rounded-2xl
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-blue-200
                      hover:shadow-xl
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-600
                      focus:ring-offset-2
                    "
                  >
                    {/* Product Image */}
                    <div className="relative h-64 bg-gray-100 overflow-hidden">
                      {product.gambar_url ? (
                        <img
                          src={product.gambar_url}
                          alt={product.nama}
                          className="
                            w-full
                            h-full
                            object-cover
                            transition-transform
                            duration-500
                            group-hover:scale-105
                          "
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-blue-50">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="w-12 h-12 text-blue-200"
                          >
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="16"
                              rx="2"
                            />

                            <circle
                              cx="8.5"
                              cy="9"
                              r="1.5"
                            />

                            <path d="M3 16l5-5 4 4 3-3 6 6" />
                          </svg>

                          <p className="mt-3 text-sm font-medium text-blue-300">
                            Gambar Produk
                          </p>
                        </div>
                      )}

                      {/* Number */}
                      <div className="absolute top-4 left-4 w-11 h-11 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm">
                        <span className="text-sm font-bold text-blue-700">
                          {number}
                        </span>
                      </div>
                    </div>

                    {/* Product Content */}
                    <div className="p-7">
                      <div className="w-10 h-1 bg-yellow-400 rounded-full mb-5 group-hover:w-16 transition-all duration-300" />

                      <h3 className="text-xl font-bold text-blue-950">
                        {product.nama}
                      </h3>

                      <p className="mt-3 text-sm text-gray-600 leading-6">
                        {product.deskripsi ||
                          "Informasi produk belum tersedia."}
                      </p>

                      {/* Detail Link */}
                      <div
                        className="
                          inline-flex
                          items-center
                          gap-2
                          mt-5
                          text-sm
                          font-semibold
                          text-blue-700
                          group-hover:text-blue-900
                          transition
                        "
                      >
                        Lihat Detail

                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* =================================================
              INFORMATION
          ================================================= */}
          <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Text */}
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] uppercase text-blue-700">
                Solusi untuk Kebutuhan Anda
              </p>

              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-blue-950 leading-tight">
                Membutuhkan produk yang sesuai dengan proses produksi?
              </h2>

              <p className="mt-5 text-gray-600 leading-7">
                Setiap kebutuhan produksi memiliki karakteristik yang
                berbeda. Konsultasikan kebutuhan Anda bersama tim
                PT Tiga Warna Primer untuk mendapatkan informasi
                produk yang sesuai.
              </p>

              <Link
                href="/kontak"
                className="
                  inline-flex
                  items-center
                  gap-2
                  mt-7
                  bg-blue-700
                  hover:bg-blue-800
                  text-white
                  px-6
                  py-3.5
                  rounded-lg
                  font-semibold
                  transition-all
                  duration-300
                  shadow-sm
                  hover:shadow-lg
                "
              >
                Hubungi Kami

                <span>→</span>
              </Link>
            </div>

            {/* Information Card */}
            <div className="relative">
              <div className="bg-blue-950 rounded-2xl p-8 md:p-10">
                <div className="w-12 h-12 rounded-xl bg-yellow-400 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="w-6 h-6 text-blue-950"
                  >
                    <path d="M12 3 4 6v5c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V6l-8-3Z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>

                <h3 className="mt-6 text-2xl font-bold text-white">
                  Kualitas dan Konsistensi
                </h3>

                <p className="mt-4 text-blue-100 leading-7">
                  Produk dirancang untuk mendukung proses industri
                  tekstil dengan memperhatikan kebutuhan kualitas,
                  konsistensi, dan proses produksi.
                </p>

                <div className="mt-7 h-px bg-blue-800" />

                <p className="mt-5 text-sm text-blue-200">
                  Konsultasikan kebutuhan produk Anda bersama kami.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}