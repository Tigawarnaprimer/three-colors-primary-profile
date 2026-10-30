import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type GalleryPhoto = {
  id: number;
  gambar_url: string;
  urutan: number;
};

type DisplayPhoto = {
  id: string;
  gambar_url: string;
};

export default async function GaleriDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const galleryId = Number(id);

  if (!Number.isInteger(galleryId) || galleryId <= 0) {
    notFound();
  }

  // ================= DATA GALERI =================
  const { data: gallery, error: galleryError } = await supabase
    .from("galeri")
    .select("id, judul, deskripsi, gambar_url, status")
    .eq("id", galleryId)
    .eq("status", "Aktif")
    .maybeSingle();

  if (galleryError) {
    console.error("Gagal mengambil galeri:", galleryError);
    throw new Error("Gagal mengambil data galeri.");
  }

  if (!gallery) {
    notFound();
  }

  // ================= FOTO TAMBAHAN =================
  const { data: photos, error: photosError } = await supabase
    .from("galeri_foto")
    .select("id, gambar_url, urutan")
    .eq("galeri_id", galleryId)
    .order("urutan", { ascending: true });

  if (photosError) {
    console.error("Gagal mengambil foto:", photosError);
    throw new Error("Gagal mengambil dokumentasi foto.");
  }

  const galleryPhotos = (photos ?? []) as GalleryPhoto[];

  // ================= GABUNG SAMPUL + FOTO TAMBAHAN =================
  const allPhotos: DisplayPhoto[] = [
    ...(gallery.gambar_url
      ? [
          {
            id: `cover-${gallery.id}`,
            gambar_url: gallery.gambar_url,
          },
        ]
      : []),
    ...galleryPhotos.map((photo) => ({
      id: `photo-${photo.id}`,
      gambar_url: photo.gambar_url,
    })),
  ];

  return (
    <main className="min-h-screen bg-white">
      <style>{`
        @keyframes galeriMasuk {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .galeri-item {
          animation: galeriMasuk 0.7s cubic-bezier(0.22, 1, 0.36, 1) backwards;
        }
        .galeri-item:hover {
          transform: translateY(-6px);
        }
        .galeri-item {
          transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s;
        }
        @media (prefers-reduced-motion: reduce) {
          .galeri-item { animation: none; transition: none; }
          .galeri-item:hover { transform: none; }
          .galeri-img { transition: none; }
        }
      `}</style>
      {/* ================= HERO ================= */}
      <section className="relative isolate overflow-hidden bg-blue-950">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/bg.jpg')" }}
        />
        <div className="absolute inset-0 -z-10 bg-blue-950/85" />

        <div className="mx-auto max-w-7xl px-6 pb-20 pt-10 md:pb-24 lg:px-8">
          {/* BREADCRUMB */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm text-white/70"
          >
            <Link href="/" className="transition hover:text-white">
              Beranda
            </Link>
            <span className="text-white/30">/</span>
            <Link href="/galeri" className="transition hover:text-white">
              Galeri
            </Link>
            <span className="text-white/30">/</span>
            <span className="font-semibold text-white">Detail</span>
          </nav>

          {/* CONTENT */}
          <div className="mt-14 max-w-4xl">
            <div className="flex items-center gap-4">
              <span className="h-[3px] w-16 bg-yellow-400" />
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-400">
                Dokumentasi
              </p>
            </div>

            <h1 className="mt-7 text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
              {gallery.judul}
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-white/85 md:text-lg">
              {gallery.deskripsi ||
                "Dokumentasi kegiatan PT Tiga Warna Primer."}
            </p>

            <p className="mt-8 text-sm font-medium text-white/70">
              {allPhotos.length} foto dokumentasi
            </p>
          </div>
        </div>
      </section>

      {/* ================= DOKUMENTASI FOTO ================= */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* SECTION HEADER */}
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-blue-950 md:text-4xl">
                Dokumentasi Foto
              </h2>
              <p className="mt-3 leading-7 text-gray-500">
                Klik foto untuk melihat ukuran penuh.
              </p>
            </div>

            <Link
              href="/galeri"
              className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-blue-900"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                aria-hidden="true"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Semua Galeri
            </Link>
          </div>

          {/* PHOTO GRID */}
          {allPhotos.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white px-6 py-20 text-center shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
              <p className="text-lg font-semibold text-gray-700">
                Belum ada foto dokumentasi.
              </p>
              <p className="mt-2 text-sm text-gray-400">
                Foto akan ditampilkan setelah tersedia.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {allPhotos.map((photo, index) => (
                <a
                  key={photo.id}
                  href={photo.gambar_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Lihat foto ${index + 1} dari ${allPhotos.length} - ${gallery.judul}`}
                  style={{ animationDelay: `${Math.min(index, 11) * 80}ms` }}
                  className="galeri-item group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 shadow-[0_8px_25px_rgba(15,23,42,0.08)] outline-none transition-shadow duration-500 hover:shadow-[0_18px_40px_rgba(15,23,42,0.18)] focus-visible:ring-4 focus-visible:ring-blue-700/40"
                >
                  {/* FOTO */}
                  <img
                    src={photo.gambar_url}
                    alt={`Dokumentasi ${gallery.judul} ${index + 1}`}
                    loading={index < 3 ? "eager" : "lazy"}
                    className="galeri-img absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />

                  {/* OVERLAY GELAP */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-blue-950/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* BINGKAI TIPIS */}
                  <div className="absolute inset-3 rounded-xl border border-white/70 opacity-0 transition-all duration-500 ease-out [transform:scale(0.94)] group-hover:opacity-100 group-hover:[transform:scale(1)]" />

                  {/* NOMOR FOTO */}
                  <span className="absolute left-5 top-5 rounded-lg bg-white/90 px-3 py-1 text-xs font-semibold text-blue-950 shadow-sm">
                    {index + 1} / {allPhotos.length}
                  </span>

                  {/* IKON ZOOM (di tengah) */}
                  <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 scale-50 items-center justify-center rounded-full bg-white text-blue-950 opacity-0 shadow-xl transition-all duration-500 ease-out group-hover:scale-100 group-hover:opacity-100">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-6 w-6"
                      aria-hidden="true"
                    >
                      <circle cx="11" cy="11" r="7" />
                      <path d="m20 20-4-4M11 8v6M8 11h6" />
                    </svg>
                  </span>

                  {/* CAPTION (naik dari bawah) */}
                  <div className="absolute inset-x-0 bottom-0 translate-y-3 px-6 pb-6 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="truncate text-sm font-semibold text-white">
                      {gallery.judul}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}

        </div>
      </section>

      
{/* ================= BOTTOM ================= */}
<section className="pb-10 md:pb-12">
  <div className="mx-auto max-w-7xl px-6 lg:px-8">

    <div className="relative overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-yellow-50 px-5 py-6 shadow-sm md:px-8 md:py-7">

      {/* DEKORASI */}
      <div className="pointer-events-none absolute -bottom-16 -left-12 h-32 w-32 rounded-full bg-blue-300/25 blur-2xl" />
      <div className="pointer-events-none absolute -right-12 -top-16 h-32 w-32 rounded-full bg-yellow-300/25 blur-2xl" />
      <div className="pointer-events-none absolute -right-8 -top-12 h-32 w-32 rounded-full border border-yellow-300/30" />

      {/* CONTENT */}
      <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">

        <div className="max-w-xl">

          <div className="mb-2 flex items-center gap-2">
            <span className="h-0.5 w-7 rounded-full bg-gradient-to-r from-blue-500 to-yellow-400" />

            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-yellow-600">
              PT Tiga Warna Primer
            </p>
          </div>

          <h2 className="text-lg font-extrabold leading-snug text-blue-950 md:text-xl">
            Menciptakan Warna, Mendefinisikan Kualitas.
          </h2>

          <p className="mt-2 text-xs leading-5 text-gray-500 md:text-sm">
            Lihat dokumentasi aktivitas dan produk kami lainnya.
          </p>

        </div>

        {/* BUTTON */}
        
{/* AKSEN VISUAL */}
<div className="relative hidden shrink-0 items-center justify-center sm:flex">
  <div className="absolute h-16 w-16 rounded-full bg-blue-400/20 blur-xl" />

  <div className="relative flex items-center -space-x-3">
    <span className="h-9 w-9 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-blue-700 shadow-sm" />
    <span className="h-9 w-9 rounded-full border-2 border-white bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-sm" />
    <span className="h-9 w-9 rounded-full border-2 border-white bg-gradient-to-br from-orange-400 to-red-500 shadow-sm" />
  </div>
</div>


      </div>
    </div>

  </div>
</section>

    </main>
  );
}
