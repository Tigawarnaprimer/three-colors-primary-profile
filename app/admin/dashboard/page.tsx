import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import { supabase } from "@/lib/supabase";

type RecentContent = {
  id: string;
  title: string;
  type: "Produk" | "Artikel";
  status: string;
  date: string | null;
};

function formatDate(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateLong() {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

async function getDashboardData() {
  const [
    produkResult,
    artikelResult,
    galeriResult,
    karirResult,
    varianResult,
    keunggulanResult,
    kontakResult,
    recentProductsResult,
    recentArticlesResult,
  ] = await Promise.all([
    // Produk aktif
    supabase
      .from("produk")
      .select("id", { count: "exact", head: true })
      .eq("status", "Aktif"),

    // Artikel aktif
    supabase
      .from("artikel")
      .select("id", { count: "exact", head: true })
      .eq("status", "Aktif"),

    // Galeri aktif
    supabase
      .from("galeri")
      .select("id", { count: "exact", head: true })
      .eq("status", "Aktif"),

    // Total lowongan
    supabase
      .from("karir")
      .select("id", { count: "exact", head: true }),

    // Varian produk aktif
    supabase
      .from("varian_produk")
      .select("id", { count: "exact", head: true })
      .eq("status", "Aktif"),

    // Keunggulan
    supabase
      .from("keunggulan")
      .select("id", { count: "exact", head: true }),

    // Kontak
    supabase
      .from("kontak")
      .select("id", { count: "exact", head: true }),

    // Produk terbaru
    // Tidak menggunakan created_at karena menyebabkan error
    supabase
      .from("produk")
      .select("id, nama, status")
      .order("id", { ascending: false })
      .limit(5),

    // Artikel terbaru
    supabase
      .from("artikel")
      .select("id, judul, tanggal, status")
      .order("tanggal", { ascending: false })
      .limit(5),
  ]);

  // Log error tanpa menghentikan dashboard
  if (produkResult.error) {
    console.error("Produk:", produkResult.error);
  }

  if (artikelResult.error) {
    console.error("Artikel:", artikelResult.error);
  }

  if (galeriResult.error) {
    console.error("Galeri:", galeriResult.error);
  }

  if (karirResult.error) {
    console.error("Karir:", karirResult.error);
  }

  if (varianResult.error) {
    console.error("Varian:", varianResult.error);
  }

  if (keunggulanResult.error) {
    console.error("Keunggulan:", keunggulanResult.error);
  }

  if (kontakResult.error) {
    console.error("Kontak:", kontakResult.error);
  }

  const products = recentProductsResult.data ?? [];
  const articles = recentArticlesResult.data ?? [];

  /*
   * Konten terbaru
   */
  const recentContent: RecentContent[] = [
    ...products.map((item) => ({
      id: `produk-${item.id}`,
      title: item.nama,
      type: "Produk" as const,
      status: item.status ?? "-",
      date: null,
    })),

    ...articles.map((item) => ({
      id: `artikel-${item.id}`,
      title: item.judul,
      type: "Artikel" as const,
      status: item.status ?? "-",
      date: item.tanggal,
    })),
  ]
    .sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;

      return dateB - dateA;
    })
    .slice(0, 6);

  return {
    produk: produkResult.count ?? 0,
    artikel: artikelResult.count ?? 0,
    galeri: galeriResult.count ?? 0,
    karir: karirResult.count ?? 0,
    varian: varianResult.count ?? 0,
    keunggulan: keunggulanResult.count ?? 0,
    kontak: kontakResult.count ?? 0,
    recentContent,
  };
}

/* =========================================================
   ICONS
========================================================= */

function ProductIcon({
  className = "h-5 w-5",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m3 7.5 9 4.5 9-4.5M12 12v9" />
    </svg>
  );
}

function ArticleIcon({
  className = "h-5 w-5",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 8h8M8 12h8M8 16h5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GalleryIcon({
  className = "h-5 w-5",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2"
      />
      <circle cx="8.5" cy="9" r="1.5" />
      <path
        d="m4 17 5-5 3.5 3.5 2.5-2.5 5 5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CareerIcon({
  className = "h-5 w-5",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect
        x="3"
        y="7"
        width="18"
        height="13"
        rx="2"
      />
      <path
        d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarIcon({
  className = "h-5 w-5",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ActivityClockIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="9" />
      <path
        d="M12 7v5l3 2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="m9 18 6-6-6-6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M14 5h5v5M19 5l-8 8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default async function AdminDashboard() {
  const data = await getDashboardData();

  const totalContent =
    data.produk +
    data.artikel +
    data.galeri +
    data.karir +
    data.keunggulan;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <AdminSidebar />

      <main className="min-h-screen lg:ml-64">
        {/* Background */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" />

          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-yellow-100/30 blur-3xl" />

          <div
            className="absolute inset-0 opacity-[0.018]"
            style={{
              backgroundImage:
                "linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="mx-auto max-w-[1500px] px-5 py-6 sm:px-7 lg:px-10 lg:py-8">
          {/* =====================================================
              HEADER
          ===================================================== */}
          <header className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                Admin Dashboard
              </p>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-blue-950 md:text-3xl">
                Selamat datang kembali
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Ringkasan pengelolaan website PT Tiga Warna Primer.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-xs font-medium text-gray-400">
                  {formatDateLong()}
                </p>

                <p className="mt-1 text-sm font-semibold text-blue-950">
                  {totalContent} total data
                </p>
              </div>

              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
              >
                <ExternalIcon />
                Lihat Website
              </Link>
            </div>
          </header>

          {/* =====================================================
              MAIN STATISTICS
          ===================================================== */}
          <section className="mb-8">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-5">
              {/* Produk */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <ProductIcon />
                  </div>

                  <span className="text-[11px] font-medium text-gray-400">
                    Aktif
                  </span>
                </div>

                <p className="mt-5 text-3xl font-bold tracking-tight text-blue-950">
                  {data.produk}
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-700">
                  Produk
                </p>
              </div>

              {/* Artikel */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <ArticleIcon />
                  </div>

                  <span className="text-[11px] font-medium text-gray-400">
                    Aktif
                  </span>
                </div>

                <p className="mt-5 text-3xl font-bold tracking-tight text-blue-950">
                  {data.artikel}
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-700">
                  Artikel
                </p>
              </div>

              {/* Galeri */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 text-yellow-500">
                    <GalleryIcon />
                  </div>

                  <span className="text-[11px] font-medium text-gray-400">
                    Aktif
                  </span>
                </div>

                <p className="mt-5 text-3xl font-bold tracking-tight text-blue-950">
                  {data.galeri}
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-700">
                  Galeri
                </p>
              </div>

              {/* Karir */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <CareerIcon />
                  </div>

                  <span className="text-[11px] font-medium text-gray-400">
                    Data
                  </span>
                </div>

                <p className="mt-5 text-3xl font-bold tracking-tight text-blue-950">
                  {data.karir}
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-700">
                  Lowongan
                </p>
              </div>

              {/* Varian */}
              <div className="col-span-2 rounded-2xl border border-gray-200 bg-blue-950 p-5 shadow-sm md:col-span-4 xl:col-span-1">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-yellow-400">
                    <ProductIcon />
                  </div>

                  <span className="text-[11px] font-medium text-blue-200">
                    Produk
                  </span>
                </div>

                <p className="mt-5 text-3xl font-bold tracking-tight text-white">
                  {data.varian}
                </p>

                <p className="mt-1 text-sm font-semibold text-blue-100">
                  Varian Produk
                </p>
              </div>
            </div>
          </section>

          {/* =====================================================
              ACTIVITY + WEBSITE SUMMARY
          ===================================================== */}
          <section className="grid grid-cols-1 gap-5 lg:grid-cols-5">
            {/* Aktivitas */}
            <div className="lg:col-span-3 rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-700">
                    Aktivitas
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-blue-950">
                    Terbaru
                  </h2>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <ActivityClockIcon />
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {/* Sistem */}
                <div className="flex items-center gap-4 px-6 py-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        d="M20 6 9 17l-5-5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-green-600">
                      Sistem
                    </p>

                    <p className="mt-0.5 text-sm font-semibold text-blue-950">
                      Dashboard terhubung dengan database
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500">
                      Data pengelolaan website dapat ditampilkan dan dikelola
                      melalui panel admin.
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                    Aktif
                  </span>
                </div>

                {/* Produk */}
                <div className="flex items-center gap-4 px-6 py-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <ProductIcon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-700">
                      Produk
                    </p>

                    <p className="mt-0.5 text-sm font-semibold text-blue-950">
                      {data.produk} produk aktif tersedia
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500">
                      Data produk siap ditampilkan pada website publik.
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                    {data.produk}
                  </span>
                </div>

                {/* Artikel */}
                <div className="flex items-center gap-4 px-6 py-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
                    <ArticleIcon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-yellow-600">
                      Artikel
                    </p>

                    <p className="mt-0.5 text-sm font-semibold text-blue-950">
                      {data.artikel} artikel aktif tersedia
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500">
                      Informasi artikel dapat dikelola melalui menu artikel.
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-yellow-50 px-2.5 py-1 text-[11px] font-semibold text-yellow-700">
                    {data.artikel}
                  </span>
                </div>
              </div>
            </div>

            {/* Ringkasan Website */}
            <div className="lg:col-span-2 rounded-2xl bg-blue-950 p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-yellow-400">
                    Ringkasan
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-white">
                    Kondisi Website
                  </h2>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-yellow-400">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      d="M12 3v18M3 12h18"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {/* Produk */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-xs text-blue-100">
                      Produk aktif
                    </span>

                    <span className="text-xs font-semibold text-white">
                      {data.produk}
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-full rounded-full bg-yellow-400" />
                  </div>
                </div>

                {/* Artikel */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-xs text-blue-100">
                      Artikel aktif
                    </span>

                    <span className="text-xs font-semibold text-white">
                      {data.artikel}
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-full rounded-full bg-yellow-400" />
                  </div>
                </div>

                {/* Galeri */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-xs text-blue-100">
                      Galeri aktif
                    </span>

                    <span className="text-xs font-semibold text-white">
                      {data.galeri}
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-full rounded-full bg-yellow-400" />
                  </div>
                </div>

                {/* Lowongan */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-xs text-blue-100">
                      Lowongan
                    </span>

                    <span className="text-xs font-semibold text-white">
                      {data.karir}
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-full rounded-full bg-yellow-400" />
                  </div>
                </div>
              </div>

              <div className="mt-7 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-400" />

                  <p className="text-xs font-semibold text-white">
                    Website aktif dan siap dikelola
                  </p>
                </div>

                <p className="mt-1 text-[11px] leading-5 text-blue-200">
                  Data dashboard diperbarui langsung dari database.
                </p>
              </div>
            </div>
          </section>

          {/* =====================================================
              CONTENT TERBARU
          ===================================================== */}
          <section className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-gray-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-700">
                  Konten
                </p>

                <h2 className="mt-1 text-lg font-bold text-blue-950">
                  Konten Terbaru
                </h2>
              </div>

              <p className="text-xs text-gray-400">
                Data terakhir yang ditambahkan
              </p>
            </div>

            {data.recentContent.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-sm font-medium text-gray-400">
                  Belum ada konten.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/70">
                      <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        Konten
                      </th>

                      <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        Jenis
                      </th>

                      <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        Status
                      </th>

                      <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        Tanggal
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {data.recentContent.map((item) => (
                      <tr
                        key={item.id}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <p className="max-w-md truncate text-sm font-semibold text-blue-950">
                            {item.title}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                                item.type === "Produk"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-yellow-50 text-yellow-600"
                              }`}
                            >
                              {item.type === "Produk" ? (
                                <ProductIcon className="h-3.5 w-3.5" />
                              ) : (
                                <ArticleIcon className="h-3.5 w-3.5" />
                              )}
                            </span>

                            <span className="text-xs font-medium text-gray-600">
                              {item.type}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              item.status === "Aktif"
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right text-xs text-gray-400">
                          {formatDate(item.date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* =====================================================
              MANAGEMENT ACCESS
          ===================================================== */}
          <section className="mt-5">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-700">
                Pengelolaan
              </p>

              <h2 className="mt-1 text-lg font-bold text-blue-950">
                Akses Menu
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {/* Kontak */}
              <Link
                href="/admin/kontak"
                className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-5l-3 3-3-3H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 10h8M8 14h5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <ArrowIcon />
                </div>

                <p className="mt-3 text-sm font-semibold text-blue-950">
                  Kontak
                </p>
              </Link>

              {/* Visi Misi */}
              <Link
                href="/admin/visi-misi"
                className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <circle cx="12" cy="12" r="8.5" />
                      <path
                        d="M12 8v8M8 12h8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <ArrowIcon />
                </div>

                <p className="mt-3 text-sm font-semibold text-blue-950">
                  Visi & Misi
                </p>
              </Link>

              {/* Keunggulan */}
              <Link
                href="/admin/keunggulan"
                className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-50 text-yellow-600">
                    <StarIcon className="h-4 w-4" />
                  </div>

                  <ArrowIcon />
                </div>

                <p className="mt-3 text-sm font-semibold text-blue-950">
                  Keunggulan
                </p>
              </Link>

              {/* Karir */}
              <Link
                href="/admin/karir"
                className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
                    <CareerIcon className="h-4 w-4" />
                  </div>

                  <ArrowIcon />
                </div>

                <p className="mt-3 text-sm font-semibold text-blue-950">
                  Karir
                </p>
              </Link>

              {/* Galeri */}
              <Link
                href="/admin/galeri"
                className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <GalleryIcon className="h-4 w-4" />
                  </div>

                  <ArrowIcon />
                </div>

                <p className="mt-3 text-sm font-semibold text-blue-950">
                  Galeri
                </p>
              </Link>

              {/* Footer */}
              <Link
                href="/admin/footer"
                className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        d="M4 5h16v14H4z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 9h8M8 13h5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <ArrowIcon />
                </div>

                <p className="mt-3 text-sm font-semibold text-blue-950">
                  Footer
                </p>
              </Link>
            </div>
          </section>

          {/* =====================================================
              FOOTER
          ===================================================== */}
          <footer className="mt-8 border-t border-gray-200 pt-5">
            <div className="flex flex-col gap-2 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
              <p>
                © {new Date().getFullYear()} PT Tiga Warna Primer
              </p>

              <p>
                Admin Panel
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}