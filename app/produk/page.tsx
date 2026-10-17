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
  const [searchTerm, setSearchTerm] = useState("");
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
const filteredProducts = products.filter((product) => {
  const keyword = searchTerm.trim().toLowerCase();

  return (
    product.nama.toLowerCase().includes(keyword) ||
    (product.nomor ?? "").toLowerCase().includes(keyword) ||
    (product.deskripsi ?? "").toLowerCase().includes(keyword)
  );
});
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
          
{!loading && !error && filteredProducts.length === 0 && (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-14 text-center">
    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <circle cx="11" cy="11" r="7" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m16 16 4 4"
        />
      </svg>
    </div>

    <h3 className="text-lg font-semibold text-slate-800">
      {searchTerm.trim()
        ? "Produk Tidak Ditemukan"
        : "Belum Ada Produk"}
    </h3>

    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
      {searchTerm.trim()
        ? `Maaf, tidak ada produk yang cocok dengan kata kunci "${searchTerm}". Coba gunakan nama, nomor, atau kata kunci lain.`
        : "Saat ini belum ada produk yang tersedia. Silakan kunjungi kembali halaman ini nanti."}
    </p>

    {searchTerm.trim() && (
      <button
        type="button"
        onClick={() => setSearchTerm("")}
        className="mt-5 rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
      >
        Tampilkan Semua Produk
      </button>
    )}
  </div>
)}


            <div className="mb-8">
  <div className="relative mx-auto max-w-xl">
    <svg
      className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <circle cx="11" cy="11" r="7" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m16 16 4 4"
      />
    </svg>

    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Cari nama, nomor, atau deskripsi produk..."
      aria-label="Cari produk berdasarkan nama, nomor, atau deskripsi"
      className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-12 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
    />

    {searchTerm && (
      <button
        type="button"
        onClick={() => setSearchTerm("")}
        aria-label="Hapus pencarian"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
      >
        ✕
      </button>
    )}
  </div>

  {searchTerm.trim() && (
    <p className="mt-3 text-center text-sm text-slate-500">
      Ditemukan{" "}
      <span className="font-semibold text-slate-700">
        {filteredProducts.length}
      </span>{" "}
      produk untuk "{searchTerm}"
    </p>
  )}
</div>
          {/* =================================================
              PRODUCT CARDS
          ================================================= */}
          {!loading && !error && filteredProducts.length > 0 && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const originalIndex = products.findIndex(
              (item) => item.id === product.id
              );

const number =
  product.nomor || String(originalIndex + 1).padStart(2, "0");

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