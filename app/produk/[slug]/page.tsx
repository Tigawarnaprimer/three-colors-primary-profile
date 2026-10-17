
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PdfViewer from "@/components/PdfViewer";
import VariantSearch from "@/components/VariantSearch";
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

  // Ambil data produk
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

  // Ambil varian produk yang aktif
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
    <main className="bg-white pt-20">
      {/* HERO BANNER */}
      <section className="relative h-[320px] overflow-hidden sm:h-[360px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("/images/produk-banner.jpg")',
          }}
        />

        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 mx-auto flex h-full max-w-6xl items-center px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-10 bg-yellow-400" />
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-400">
                Produk
              </p>
            </div>

            <h1 className="mt-5 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              {product.nama}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/85 md:text-lg">
              Informasi produk, pilihan varian, dan katalog
              produk untuk kebutuhan industri tekstil Anda.
            </p>
          </div>
        </div>
      </section>

      {/* DETAIL PRODUK */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
            {/* GAMBAR PRODUK */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
              {product.gambar_url ? (
                <img
                  src={product.gambar_url}
                  alt={product.nama}
                  className="h-[300px] w-full object-cover sm:h-[420px]"
                />
              ) : (
                <div className="flex h-[300px] flex-col items-center justify-center bg-blue-50 sm:h-[420px]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-16 w-16 text-blue-200"
                    aria-hidden="true"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="16"
                      rx="2"
                    />
                    <circle cx="8.5" cy="9" r="1.5" />
                    <path d="M3 16l5-5 4 4 3-3 6 6" />
                  </svg>

                  <p className="mt-4 text-sm font-medium text-blue-300">
                    Gambar Produk
                  </p>
                </div>
              )}
            </div>

            {/* INFORMASI PRODUK */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
                Produk {product.nomor || ""}
              </p>

              <h2 className="mt-3 text-3xl font-bold text-blue-950 md:text-4xl">
                {product.nama}
              </h2>

              <div className="mt-5 h-1 w-12 rounded-full bg-yellow-400" />

              <p className="mt-6 whitespace-pre-line leading-8 text-gray-600">
                {product.deskripsi ||
                  "Informasi produk belum tersedia."}
              </p>

              <p className="mt-5 leading-8 text-gray-600">
                PT Tiga Warna Primer menyediakan solusi pewarna
                dan bahan kimia untuk mendukung kebutuhan proses
                industri tekstil dengan memperhatikan kualitas
                dan konsistensi.
              </p>

              {/* TOMBOL AKSI */}
              <div className="mt-8 flex flex-wrap gap-3">
                
{product.pdf_url && (
  <a
    href="#katalog-produk"
    className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-950 via-blue-800 to-blue-700 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/30 focus:outline-none focus:ring-4 focus:ring-blue-200"
  >
    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-400 text-blue-950 transition-transform duration-300 group-hover:scale-110">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="23"
        height="23"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8M8 17h5" />
      </svg>
    </span>

    <span className="flex flex-col items-start gap-1">
      <span className="text-base font-bold tracking-wide">
        Lihat Katalog Produk
      </span>
      <span className="text-xs font-normal text-blue-100">
        Baca spesifikasi dan informasi produk
      </span>
    </span>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  </a>
)}


                <Link
                  href="/produk"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-6 py-3.5 text-sm font-semibold text-blue-950 transition duration-300 hover:border-blue-700 hover:text-blue-700"
                >
                  ← Kembali ke Produk
                </Link>
              </div>

              {product.pdf_url && (
                <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-0.5 shrink-0"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                  Katalog dapat dilihat langsung melalui browser
                  tanpa perlu mengunduhnya terlebih dahulu.
                </p>
              )}
            </div>
          </div>

          
          
{/* VARIAN PRODUK */}
<VariantSearch variants={activeVariants} />

{/* KATALOG PDF */}

          {/* KATALOG PDF */}
          {product.pdf_url && (
            <section
              id="katalog-produk"
              className="mt-16 scroll-mt-24 md:mt-20"
            >
              {/* JUDUL KATALOG */}
              <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
                    Pusat Informasi Produk
                  </p>

                  <h2 className="mt-3 text-3xl font-bold text-blue-950 md:text-4xl">
                    Katalog Produk
                  </h2>

                  <p className="mt-4 max-w-2xl leading-7 text-gray-600">
                    Pelajari informasi lebih lengkap mengenai{" "}
                    <span className="font-semibold text-blue-950">
                      {product.nama}
                    </span>{" "}
                    melalui katalog berikut.
                  </p>
                </div>

                <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                  Pratinjau Katalog
                </span>
              </div>

              {/* PDF VIEWER */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm">
                <div className="flex items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="21"
                        height="21"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <path d="M14 2v6h6" />
                        <path d="M8 13h8M8 17h8" />
                      </svg>
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-blue-950">
                        Katalog {product.nama}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Dokumen PDF
                      </p>
                    </div>
                  </div>

                  <span className="hidden shrink-0 text-xs text-gray-500 sm:inline">
                    Tampilan dokumen
                  </span>
                </div>

                <div className="bg-gray-100 p-2 sm:p-4">
                  {product.pdf_url ? (
  <PdfViewer
    url={product.pdf_url}
    title={`Katalog ${product.nama}`}
  />
) : (
  <div className="rounded-xl border border-gray-200 p-8 text-center">
    <p className="text-gray-500">
      Katalog PDF belum tersedia.
    </p>
  </div>
)}
                </div>

                <div className="flex items-start gap-3 border-t border-gray-200 bg-white px-4 py-4 sm:px-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-0.5 shrink-0 text-blue-700"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>

                  <p className="text-xs leading-6 text-gray-500 sm:text-sm">
                    Jika katalog tidak muncul, gunakan tombol{" "}
                    <span className="font-semibold text-blue-800">
                      Lihat Katalog Produk
                    </span>{" "}
                    di atas untuk membukanya pada tab browser baru.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* CALL TO ACTION */}
          <section className="mt-16 rounded-2xl bg-blue-950 p-7 md:mt-20 md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400">
                  Butuh Informasi Lebih Lanjut?
                </p>

                <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">
                  Konsultasikan kebutuhan produk Anda
                </h2>

                <p className="mt-3 max-w-2xl leading-7 text-blue-100">
                  Hubungi PT Tiga Warna Primer untuk mendapatkan
                  informasi lebih lanjut mengenai produk dan
                  kebutuhan proses produksi Anda.
                </p>
              </div>

              <Link
                href="/kontak"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-yellow-400 px-6 py-3.5 font-semibold text-blue-950 transition duration-300 hover:bg-yellow-300"
              >
                Hubungi Kami
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
