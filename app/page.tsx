"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const slides = [
  {
    image: "/images/hero-1.jpg",
  },
  {
    image: "/images/hero-2.jpg",
  },
];

type Keunggulan = {
  id: number;
  judul: string;
  deskripsi: string;
  status: "Aktif" | "Nonaktif";
};

type Article = {
  id: number;
  judul: string;
  slug: string;
  kategori: string;
  tanggal: string;
  ringkasan: string;
  gambar_url: string | null;
  status: "Aktif" | "Nonaktif";
};

type BestSellerVariant = {
  id: number;
  produk_id: number;
  kode: string;
  warna: string;
  warna_hex: string | null;
  gambar_url: string | null;
  best_seller: boolean;
  urutan_best_seller: number | null;
  produk: {
    nama: string;
    slug: string;
  } | null;
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

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [advantages, setAdvantages] = useState<Keunggulan[]>([]);
  const [advantagesLoading, setAdvantagesLoading] = useState(true);

  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);

  const [bestSellerVariants, setBestSellerVariants] = useState<
    BestSellerVariant[]
  >([]);
  const [bestSellerLoading, setBestSellerLoading] = useState(true);

  type TentangKami = {
  profil_judul: string;
  profil_deskripsi_1: string;
  profil_deskripsi_2: string;
  focus_judul: string;
  focus_deskripsi: string;
  focus_quality_judul: string;
  focus_quality_deskripsi: string;
  focus_solution_judul: string;
  focus_solution_deskripsi: string;
};

const [tentangKami, setTentangKami] = useState<TentangKami | null>(null);
const [tentangKamiLoading, setTentangKamiLoading] = useState(true);

  // =========================
  // HERO SLIDER
  // =========================

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);


  // =========================
// LOAD TENTANG KAMI
// =========================
useEffect(() => {
  async function loadTentangKami() {
    setTentangKamiLoading(true);

    const { data, error } = await supabase
      .from("tentang_kami")
      .select(`
        profil_judul,
        profil_deskripsi_1,
        profil_deskripsi_2,
        focus_judul,
        focus_deskripsi,
        focus_quality_judul,
        focus_quality_deskripsi,
        focus_solution_judul,
        focus_solution_deskripsi
      `)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Gagal mengambil data Tentang Kami:", error);
      setTentangKami(null);
    } else {
      setTentangKami(data as TentangKami | null);
    }

    setTentangKamiLoading(false);
  }

  loadTentangKami();
}, []);

  // =========================
  // LOAD KEUNGGULAN
  // =========================

  useEffect(() => {
    async function loadAdvantages() {
      setAdvantagesLoading(true);

      const { data, error } = await supabase
        .from("keunggulan")
        .select("id, judul, deskripsi, status")
        .eq("status", "Aktif")
        .order("id", { ascending: true });

      if (error) {
        console.error("Gagal mengambil data keunggulan:", error);
        setAdvantages([]);
      } else {
        setAdvantages((data ?? []) as Keunggulan[]);
      }

      setAdvantagesLoading(false);
    }

    loadAdvantages();
  }, []);

  // =========================
  // LOAD ARTIKEL TERBARU
  // =========================

  useEffect(() => {
    async function loadLatestArticles() {
      setArticlesLoading(true);

      const { data, error } = await supabase
        .from("artikel")
        .select(
          "id, judul, slug, kategori, tanggal, ringkasan, gambar_url, status"
        )
        .eq("status", "Aktif")
        .order("tanggal", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Gagal mengambil data artikel:", error);
        setLatestArticles([]);
      } else {
        setLatestArticles((data ?? []) as Article[]);
      }

      setArticlesLoading(false);
    }

    loadLatestArticles();
  }, []);

  // =========================
  // LOAD BEST SELLER
  // =========================

  useEffect(() => {
    async function loadBestSeller() {
      setBestSellerLoading(true);

      // Ambil varian Best Seller
      const { data: variantData, error: variantError } = await supabase
        .from("varian_produk")
        .select(
          "id, produk_id, kode, warna, warna_hex, gambar_url, best_seller, urutan_best_seller"
        )
        .eq("status", "Aktif")
        .eq("best_seller", true)
        .order("urutan_best_seller", {
          ascending: true,
          nullsFirst: false,
        })
        .limit(4);

      if (variantError) {
        console.error(
          "Gagal mengambil data Best Seller:",
          variantError
        );
        setBestSellerVariants([]);
        setBestSellerLoading(false);
        return;
      }

      if (!variantData || variantData.length === 0) {
        setBestSellerVariants([]);
        setBestSellerLoading(false);
        return;
      }

      // Ambil ID produk
      const productIds = [
        ...new Set(
          variantData.map((variant) => variant.produk_id)
        ),
      ];

      // Ambil data produk secara terpisah
      const { data: productData, error: productError } =
        await supabase
          .from("produk")
          .select("id, nama, slug")
          .eq("status", "Aktif")
          .in("id", productIds);

      if (productError) {
        console.error(
          "Gagal mengambil data produk Best Seller:",
          productError
        );
        setBestSellerVariants([]);
        setBestSellerLoading(false);
        return;
      }

      // Gabungkan produk dengan variannya
      const productsMap = new Map(
        (productData ?? []).map((product) => [
          product.id,
          {
            nama: product.nama,
            slug: product.slug,
          },
        ])
      );

      const combinedData: BestSellerVariant[] = variantData
        .map((variant) => ({
          ...variant,
          produk: productsMap.get(variant.produk_id) ?? null,
        }))
        .filter((variant) => variant.produk !== null) as BestSellerVariant[];

      setBestSellerVariants(combinedData);
      setBestSellerLoading(false);
    }

    loadBestSeller();
  }, []);

  return (
    <main className="pt-20">

      {/* ================= HERO ================= */}

      <section className="relative h-[calc(100vh-80px)] min-h-[600px] overflow-hidden">

        {slides.map((slide, index) => (
          <div
            key={slide.image}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ${
              currentSlide === index
                ? "opacity-100"
                : "opacity-0"
            }`}
          >
            <div
              className={`absolute inset-0 bg-cover bg-center ${
                currentSlide === index ? "hero-zoom" : ""
              }`}
              style={{
                backgroundImage: `url("${slide.image}")`,
              }}
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto w-full px-6 lg:px-8">
            <div className="max-w-3xl">

              <p className="text-sm md:text-base font-semibold tracking-[0.18em] uppercase text-white">
                Textile Dye & Chemical Specialist
              </p>

              <div className="mt-4 w-14 h-1 bg-yellow-400 rounded-full" />

              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-white">
                Menciptakan Warna,
                <br />
                <span className="text-yellow-400">
                  Mendefinisikan Kualitas.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base md:text-lg text-white leading-8 font-medium">
                PT Tiga Warna Primer menghadirkan solusi pewarna
                dan bahan kimia untuk memenuhi kebutuhan industri
                tekstil dengan kualitas dan konsistensi.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">

                <Link
                  href="/produk"
                  className="inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-7 py-3.5 rounded-lg text-sm font-semibold shadow-lg transition-all duration-300"
                >
                  Lihat Produk
                  <span>→</span>
                </Link>

                <Link
                  href="/tentang-kami"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-blue-950 px-7 py-3.5 rounded-lg text-sm font-semibold shadow-lg transition-all duration-300"
                >
                  Tentang Kami
                </Link>

              </div>

            </div>
          </div>
        </div>

        {/* SLIDE INDICATOR */}

        <div className="absolute z-20 bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">

          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Slide ${index + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                currentSlide === index
                  ? "w-10 bg-yellow-400"
                  : "w-5 bg-white/60 hover:bg-white"
              }`}
            />
          ))}

        </div>

      </section>

      {/* ================= TENTANG SINGKAT ================= */}
<section className="bg-white py-20 md:py-24">
  <div className="max-w-7xl mx-auto px-6 lg:px-8">
    {tentangKamiLoading ? (
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-center">
        <div>
          <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />

          <div className="mt-4 h-10 w-3/4 bg-gray-200 rounded animate-pulse" />

          <div className="mt-5 w-12 h-1 bg-gray-200 rounded-full" />

          <div className="mt-7 space-y-3">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-11/12 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-10/12 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="mt-4 space-y-3">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-9/12 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        <div className="bg-gray-200 rounded-2xl p-8 md:p-10 min-h-[350px] animate-pulse" />
      </div>
    ) : !tentangKami ? (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
        <p className="text-sm font-semibold text-gray-500">
          Data Tentang Kami belum tersedia.
        </p>
      </div>
    ) : (
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-center">

        {/* LEFT */}
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] uppercase text-blue-700">
            Tentang Kami
          </p>

          <h2 className="mt-3 text-3xl md:text-4xl font-bold leading-tight text-blue-950">
            {tentangKami.profil_judul}
          </h2>

          <div className="mt-5 w-12 h-1 bg-yellow-400 rounded-full" />

          <p className="mt-6 text-gray-600 leading-7">
            {tentangKami.profil_deskripsi_1}
          </p>

          <p className="mt-4 text-gray-600 leading-7">
            {tentangKami.profil_deskripsi_2}
          </p>

          <Link
            href="/tentang-kami"
            className="inline-flex items-center gap-2 mt-7 text-sm font-semibold text-blue-700 hover:text-blue-900 transition"
          >
            Selengkapnya
            <span>→</span>
          </Link>
        </div>

        {/* RIGHT */}
        <div>
          <div className="bg-blue-950 rounded-2xl p-8 md:p-10">

            <p className="text-sm font-semibold tracking-[0.15em] uppercase text-yellow-400">
              Our Focus
            </p>

            <h3 className="mt-3 text-3xl font-bold text-white leading-tight whitespace-pre-line">
              {tentangKami.focus_judul}
            </h3>

            <p className="mt-5 text-blue-100 leading-7">
              {tentangKami.focus_deskripsi}
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">

              <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                <p className="text-yellow-400 font-bold">
                  {tentangKami.focus_quality_judul}
                </p>

                <p className="mt-1 text-sm text-blue-100">
                  {tentangKami.focus_quality_deskripsi}
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                <p className="text-yellow-400 font-bold">
                  {tentangKami.focus_solution_judul}
                </p>

                <p className="mt-1 text-sm text-blue-100">
                  {tentangKami.focus_solution_deskripsi}
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    )}
  </div>
</section>
      {/* ================= KEUNGGULAN KAMI ================= */}

      <section className="bg-gray-50 py-20 md:py-24">

        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* HEADER */}

          <div className="max-w-3xl">

            <p className="text-sm font-semibold tracking-[0.18em] uppercase text-blue-700">
              Keunggulan Kami
            </p>

            <h2 className="mt-3 text-3xl md:text-4xl font-bold leading-tight text-blue-950">
              Mengutamakan Kualitas
              <br />
              <span className="text-blue-700">
                dan Kebutuhan Pelanggan
              </span>
            </h2>

            <div className="mt-5 w-12 h-1 bg-yellow-400 rounded-full" />

            <p className="mt-6 max-w-2xl text-gray-600 leading-7 text-base md:text-lg">
              Kami berkomitmen menghadirkan produk dan pelayanan
              yang mendukung kebutuhan pelanggan di industri tekstil.
            </p>

          </div>

          {/* ADVANTAGES GRID */}

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {advantagesLoading ? (

              <div className="col-span-full py-12 text-center">

                <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-blue-200 border-t-blue-700" />

                <p className="mt-4 text-sm font-semibold text-gray-500">
                  Memuat keunggulan...
                </p>

              </div>

            ) : advantages.length === 0 ? (

              <div className="col-span-full rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">

                <p className="text-sm font-semibold text-gray-500">
                  Belum ada keunggulan yang ditampilkan.
                </p>

              </div>

            ) : (

              advantages.map((item, index) => (

                <div
                  key={item.id}
                  className="group relative bg-white border border-gray-200 rounded-2xl p-7 shadow-sm hover:-translate-y-1 hover:shadow-xl hover:border-blue-200 transition-all duration-300"
                >

                  {/* NUMBER */}

                  <div className="flex items-start justify-between">

                    <span className="text-5xl font-bold text-blue-100 group-hover:text-blue-700 transition-colors duration-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* ARROW */}

                    <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 group-hover:bg-yellow-400 group-hover:text-blue-950 transition-all duration-300">
                      →
                    </div>

                  </div>

                  {/* CONTENT */}

                  <div className="mt-8">

                    <h3 className="text-xl font-bold text-blue-950">
                      {item.judul}
                    </h3>

                    <p className="mt-4 text-sm text-gray-600 leading-6">
                      {item.deskripsi}
                    </p>

                  </div>

                  {/* ACCENT */}

                  <div className="mt-7 w-10 h-1 bg-yellow-400 rounded-full group-hover:w-16 transition-all duration-300" />

                </div>

              ))

            )}

          </div>

          {/* KOMITMEN */}

          <div className="mt-8 bg-white border border-gray-200 rounded-2xl px-7 py-7 md:px-10 md:py-8 shadow-sm">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-7">

              <div className="flex items-start gap-5">

                {/* THREE COLOR DOTS */}

                <div className="flex items-center gap-2 pt-1">

                  <span className="w-3.5 h-3.5 rounded-full bg-red-500" />
                  <span className="w-3.5 h-3.5 rounded-full bg-blue-700" />
                  <span className="w-3.5 h-3.5 rounded-full bg-yellow-400" />

                </div>

                <div>

                  <p className="text-sm font-semibold text-blue-700">
                    Komitmen Kami
                  </p>

                  <p className="mt-2 text-blue-950 font-semibold leading-7 max-w-3xl">
                    Membangun kualitas melalui produk, pelayanan,
                    dan hubungan yang baik dengan pelanggan.
                  </p>

                </div>

              </div>

              <Link
                href="/keunggulan"
                className="inline-flex items-center gap-2 shrink-0 text-sm font-semibold text-blue-700 hover:text-blue-950 transition"
              >
                Selengkapnya
                <span>→</span>
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* ================= BEST SELLER ================= */}

      <section className="bg-white pt-16 md:pt-20 pb-10 md:pb-12">

        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* HEADER */}

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">

            <div>

              <p className="text-sm font-semibold tracking-[0.18em] uppercase text-blue-700">
                Produk Pilihan
              </p>

              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-blue-950">
                Produk Best Seller
              </h2>

              <div className="mt-4 w-12 h-1 bg-yellow-400 rounded-full" />

              <p className="mt-5 max-w-2xl text-gray-600 leading-7">
                Berbagai varian produk pilihan PT Tiga Warna Primer
                untuk mendukung kebutuhan pewarnaan dan proses
                industri tekstil.
              </p>

            </div>

            <Link
              href="/produk"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 transition"
            >
              Lihat Semua Produk
              <span>→</span>
            </Link>

          </div>

          {/* BEST SELLER GRID */}

          {bestSellerLoading ? (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

              {[1, 2, 3, 4].map((item) => (

                <div
                  key={item}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm animate-pulse"
                >

                  <div className="h-48 bg-gray-200" />

                  <div className="p-5">

                    <div className="h-3 w-20 bg-gray-200 rounded" />

                    <div className="mt-3 h-5 w-28 bg-gray-200 rounded" />

                    <div className="mt-4 flex items-center gap-3">

                      <div className="w-6 h-6 rounded-full bg-gray-200" />

                      <div className="h-3 w-20 bg-gray-200 rounded" />

                    </div>

                  </div>

                </div>

              ))}

            </div>

          ) : bestSellerVariants.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">

              <p className="text-sm font-semibold text-gray-500">
                Belum ada produk Best Seller yang ditampilkan.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

              {bestSellerVariants.map((variant) => (

                <Link
                  key={variant.id}
                  href={`/produk/${variant.produk?.slug ?? ""}`}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    border-gray-100
                    bg-white
                    shadow-[0_6px_0_0_rgba(15,23,42,0.05),0_10px_22px_rgba(15,23,42,0.08)]
                    transition-all
                    duration-300
                    hover:-translate-y-2
                    hover:border-blue-100
                    hover:shadow-[0_9px_0_0_rgba(15,23,42,0.07),0_18px_30px_rgba(15,23,42,0.13)]
                  "
                >

                  {/* IMAGE */}

                  <div className="relative h-48 bg-gray-100 overflow-hidden">

                    {variant.gambar_url ? (

                      <img
                        src={variant.gambar_url}
                        alt={`${variant.kode} - ${variant.warna}`}
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

                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          backgroundColor:
                            variant.warna_hex || "#f3f4f6",
                        }}
                      >

                        <span className="text-sm font-semibold text-gray-600">
                          {variant.warna || "Varian"}
                        </span>

                      </div>

                    )}

                    {/* BEST SELLER */}

                    <div className="absolute top-4 left-4 z-10">

                      <span
                        className="
                          inline-flex
                          items-center
                          rounded-full
                          bg-yellow-400
                          px-3
                          py-1.5
                          text-xs
                          font-bold
                          text-blue-950
                          shadow-md
                        "
                      >
                        Best Seller
                      </span>

                    </div>

                    {/* IMAGE OVERLAY */}

                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/10
                        via-transparent
                        to-transparent
                        pointer-events-none
                      "
                    />

                  </div>

                  {/* CONTENT */}

                  <div className="p-5">

                    {/* PRODUK */}

                    <p className="text-xs font-semibold text-blue-700">
                      {variant.produk?.nama || "Produk"}
                    </p>

                    {/* KODE */}

                    <p className="mt-1 text-[10px] font-bold tracking-[0.15em] uppercase text-blue-500">
                      {variant.kode}
                    </p>

                    {/* WARNA */}

                    <h3 className="mt-2 text-lg font-bold text-blue-950 line-clamp-1 group-hover:text-blue-700 transition">
                      {variant.warna}
                    </h3>

                    {/* COLOR */}

                    {variant.warna_hex && (

                      <div className="mt-4 flex items-center gap-3">

                        <span
                          className="
                            w-6
                            h-6
                            rounded-full
                            border
                            border-gray-200
                            shadow-inner
                            shrink-0
                          "
                          style={{
                            backgroundColor: variant.warna_hex,
                          }}
                        />

                        <span className="text-xs text-gray-500 uppercase">
                          {variant.warna_hex}
                        </span>

                      </div>

                    )}

                    {/* LINK */}

                    <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-gray-500 group-hover:text-blue-700 transition">

                      Lihat Produk

                      <span className="group-hover:translate-x-1 transition-transform">
                        →
                      </span>

                    </div>

                  </div>

                  {/* BOTTOM ELEVATION */}

                  <div
                    className="
                      absolute
                      -bottom-1
                      left-6
                      right-6
                      h-2
                      rounded-full
                      bg-blue-950/10
                      blur-sm
                    "
                  />

                </Link>

              ))}

            </div>

          )}

        </div>

      </section>

      {/* ================= ARTIKEL TERBARU ================= */}

      <section className="bg-white pt-6 pb-20 md:pb-24">

        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">

            <div>

              <p className="text-sm font-semibold tracking-[0.18em] uppercase text-blue-700">
                Informasi & Wawasan
              </p>

              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-blue-950">
                Artikel Terbaru
              </h2>

              <div className="mt-4 w-12 h-1 bg-yellow-400 rounded-full" />

              <p className="mt-5 max-w-2xl text-gray-600 leading-7">
                Informasi terbaru seputar industri tekstil, pewarna,
                bahan kimia, serta perkembangan teknologi industri.
              </p>

            </div>

            <Link
              href="/artikel"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 transition"
            >
              Lihat Semua Artikel
              <span>→</span>
            </Link>

          </div>

          {/* ARTIKEL DARI SUPABASE */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">

            {articlesLoading ? (

              <div className="col-span-full py-12 text-center">

                <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-blue-200 border-t-blue-700" />

                <p className="mt-4 text-sm font-semibold text-gray-500">
                  Memuat artikel...
                </p>

              </div>

            ) : latestArticles.length === 0 ? (

              <div className="col-span-full rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">

                <p className="text-sm font-semibold text-gray-500">
                  Belum ada artikel yang ditampilkan.
                </p>

              </div>

            ) : (

              latestArticles.map((article) => (

                <Link
                  key={article.id}
                  href={`/artikel/${article.slug}`}
                  className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                >

                  {/* IMAGE */}

                  <div className="aspect-[16/9] overflow-hidden bg-gray-100">

                    {article.gambar_url ? (

                      <img
                        src={article.gambar_url}
                        alt={article.judul}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                    ) : (

                      <div className="w-full h-full flex items-center justify-center">

                        <p className="text-sm text-gray-400">
                          Tidak ada gambar
                        </p>

                      </div>

                    )}

                  </div>

                  {/* CONTENT */}

                  <div className="p-6">

                    <div className="flex items-center gap-3 text-xs">

                      <span className="font-semibold text-blue-700">
                        {article.kategori}
                      </span>

                      <span className="text-gray-300">
                        |
                      </span>

                      <span className="text-gray-500">
                        {formatDate(article.tanggal)}
                      </span>

                    </div>

                    <h3 className="mt-4 text-xl font-bold text-blue-950 leading-7 group-hover:text-blue-700 transition">
                      {article.judul}
                    </h3>

                    <p className="mt-3 text-sm text-gray-600 leading-6 line-clamp-3">
                      {article.ringkasan}
                    </p>

                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 group-hover:text-blue-700 transition">

                      Baca Artikel

                      <span className="group-hover:translate-x-1 transition-transform">
                        →
                      </span>

                    </div>

                  </div>

                </Link>

              ))

            )}

          </div>

        </div>

      </section>

      {/* ================= CTA HUBUNGI KAMI ================= */}

      <section className="bg-gray-50 pb-20 md:pb-24 pt-4">

        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          <div className="relative overflow-hidden rounded-2xl bg-blue-950 px-7 py-10 md:px-12 md:py-12">

            {/* DECORATION */}

            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-blue-900/70" />

            <div className="absolute -left-16 -bottom-20 w-48 h-48 rounded-full bg-blue-900/50" />

            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-7">

              <div className="max-w-2xl">

                <p className="text-sm font-semibold tracking-[0.18em] uppercase text-yellow-400">
                  Hubungi Kami
                </p>

                <h2 className="mt-3 text-2xl md:text-3xl font-bold text-white leading-tight">
                  Butuh informasi mengenai produk kami?
                </h2>

                <p className="mt-4 text-blue-100 leading-7">
                  Hubungi PT Tiga Warna Primer untuk mendapatkan informasi
                  mengenai produk dan kebutuhan industri tekstil Anda.
                </p>

              </div>

              <Link
                href="/kontak"
                className="shrink-0 inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-blue-950 px-6 py-3.5 rounded-lg text-sm font-bold transition"
              >
                Hubungi Kami
                <span>→</span>
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}