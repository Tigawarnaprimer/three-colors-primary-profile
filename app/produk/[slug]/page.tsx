import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Product = {
  id: number;
  nama: string;
  slug: string;
  deskripsi: string | null;
  gambar_url: string | null;
  pdf_url: string | null;
  nomor: string | null;
  status: "Aktif" | "Nonaktif";
};

type Variant = {
  id: number;
  produk_id: number;
  kode: string;
  warna: string;
  warna_hex: string | null;
  gambar_url: string | null;
  status: "Aktif" | "Nonaktif";
  best_seller: boolean;
  urutan_best_seller: number | null;
};

type ProductDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductDetail({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;

  // =====================================================
  // AMBIL DATA PRODUK
  // =====================================================

  const { data: product, error: productError } = await supabase
    .from("produk")
    .select(
      "id, nama, slug, deskripsi, gambar_url, pdf_url, nomor, status"
    )
    .eq("slug", slug)
    .eq("status", "Aktif")
    .single();

  if (productError || !product) {
    notFound();
  }

  // =====================================================
  // AMBIL VARIAN PRODUK
  // =====================================================

  const { data: variants } = await supabase
    .from("varian_produk")
    .select(
      "id, produk_id, kode, warna, warna_hex, gambar_url, status, best_seller, urutan_best_seller"
    )
    .eq("produk_id", product.id)
    .eq("status", "Aktif")
    .order("urutan_best_seller", {
      ascending: true,
      nullsFirst: false,
    });

  const activeVariants: Variant[] = variants ?? [];

  return (
    <main className="pt-20 bg-white">
      {/* =====================================================
          HERO
      ===================================================== */}
      {/* HERO / BANNER */}
<section className="relative h-[360px] overflow-hidden">
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{
      backgroundImage: 'url("/images/produk-banner.jpg")',
    }}
  />

  <div className="absolute inset-0 bg-black/55" />

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
          {product.nama}
        </h1>

        <p className="mt-5 max-w-2xl text-base md:text-lg leading-7 text-white/85">
          Informasi produk dan varian yang tersedia.
        </p>
      </div>
    </div>
  </div>
</section>

      {/* =====================================================
          DETAIL PRODUK
      ===================================================== */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Product Image */}
            <div className="overflow-hidden rounded-2xl bg-gray-100 border border-gray-200">
              {product.gambar_url ? (
                <img
                  src={product.gambar_url}
                  alt={product.nama}
                  className="w-full h-[420px] object-cover"
                />
              ) : (
                <div className="w-full h-[420px] flex flex-col items-center justify-center bg-blue-50">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-16 h-16 text-blue-200"
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

                  <p className="mt-4 text-sm font-medium text-blue-300">
                    Gambar Produk
                  </p>
                </div>
              )}
            </div>

            {/* Product Information */}
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] uppercase text-blue-700">
                Produk {product.nomor || ""}
              </p>

              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-blue-950">
                {product.nama}
              </h2>

              <div className="mt-5 w-12 h-1 bg-yellow-400 rounded-full" />

              <p className="mt-6 text-gray-600 leading-8">
                {product.deskripsi ||
                  "Informasi produk belum tersedia."}
              </p>

              <p className="mt-5 text-gray-600 leading-8">
                PT Tiga Warna Primer menyediakan solusi pewarna dan
                bahan kimia untuk mendukung kebutuhan proses industri
                tekstil dengan memperhatikan kualitas dan konsistensi.
              </p>

              {/* Action */}
              <div className="mt-8 flex flex-wrap gap-3">
                {product.pdf_url && (
                  <>
                    <a
                      href={product.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        bg-blue-700
                        hover:bg-blue-800
                        text-white
                        px-6
                        py-3.5
                        rounded-lg
                        text-sm
                        font-semibold
                        transition
                        duration-300
                      "
                    >
                      Lihat Detail Produk
                      <span>→</span>
                    </a>

                    <a
                      href={product.pdf_url}
                      download
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        border
                        border-gray-300
                        hover:border-blue-700
                        text-blue-950
                        hover:text-blue-700
                        px-6
                        py-3.5
                        rounded-lg
                        text-sm
                        font-semibold
                        transition
                        duration-300
                      "
                    >
                      Download PDF
                    </a>
                  </>
                )}

                <Link
                  href="/produk"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    border
                    border-gray-300
                    hover:border-blue-700
                    text-blue-950
                    hover:text-blue-700
                    px-6
                    py-3.5
                    rounded-lg
                    text-sm
                    font-semibold
                    transition
                    duration-300
                  "
                >
                  ← Kembali
                </Link>
              </div>
            </div>
          </div>
{/* =================================================
    VARIAN PRODUK
================================================= */}
{activeVariants.length > 0 && (
  <div className="mt-16">
    {/* SECTION HEADER */}
    <div className="mb-8">
      <p className="text-sm font-semibold tracking-[0.2em] uppercase text-blue-700">
        Pilihan Varian
      </p>

      <h2 className="mt-3 text-3xl md:text-4xl font-bold text-blue-950">
        Varian Produk
      </h2>

      <p className="mt-4 text-gray-600 leading-7 max-w-2xl">
        Pilih varian produk yang sesuai dengan kebutuhan
        proses produksi Anda.
      </p>
    </div>

    {/* VARIANT GRID */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {activeVariants.map((variant) => (
        <div
          key={variant.id}
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
          {/* =========================================
              VARIANT IMAGE
          ========================================= */}
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
                className="
                  w-full
                  h-full
                  flex
                  items-center
                  justify-center
                "
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

            {/* =========================================
                BEST SELLER BADGE
            ========================================= */}
            {variant.best_seller && (
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
            )}

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

          {/* =========================================
              VARIANT CONTENT
          ========================================= */}
          <div className="p-5">
            {/* KODE */}
            <p className="text-xs font-bold tracking-[0.15em] uppercase text-blue-700">
              {variant.kode}
            </p>

            {/* NAMA WARNA */}
            <h3 className="mt-2 text-lg font-bold text-blue-950 line-clamp-1">
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
          </div>

          {/* =========================================
              BOTTOM ELEVATION SHADOW
          ========================================= */}
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
        </div>
      ))}
    </div>
  </div>
)}
          {/* =================================================
              PDF PREVIEW
          ================================================= */}
          {product.pdf_url && (
            <div className="mt-20">
              <div className="mb-8">
                <p className="text-sm font-semibold tracking-[0.2em] uppercase text-blue-700">
                  Informasi Produk
                </p>

                <h2 className="mt-3 text-3xl md:text-4xl font-bold text-blue-950">
                  Detail Produk
                </h2>

                <p className="mt-4 text-gray-600 leading-7">
                  Lihat dokumen detail produk untuk informasi lebih
                  lengkap mengenai {product.nama}.
                </p>
              </div>

              {/* PDF Viewer */}
              <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm">
                <iframe
                  src={product.pdf_url}
                  title={`Detail Produk ${product.nama}`}
                  className="w-full h-[700px]"
                />
              </div>
            </div>
          )}

          {/* =================================================
              BOTTOM CTA
          ================================================= */}
          <div className="mt-16 rounded-2xl bg-blue-950 p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-sm font-semibold tracking-[0.2em] uppercase text-yellow-400">
                  Butuh Informasi Lebih Lanjut?
                </p>

                <h3 className="mt-3 text-2xl md:text-3xl font-bold text-white">
                  Konsultasikan kebutuhan produk Anda
                </h3>

                <p className="mt-3 text-blue-100 leading-7 max-w-2xl">
                  Hubungi PT Tiga Warna Primer untuk mendapatkan
                  informasi lebih lanjut mengenai produk dan kebutuhan
                  proses produksi Anda.
                </p>
              </div>

              <Link
                href="/kontak"
                className="
                  shrink-0
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  bg-yellow-400
                  hover:bg-yellow-300
                  text-blue-950
                  px-6
                  py-3.5
                  rounded-lg
                  font-semibold
                  transition
                  duration-300
                "
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