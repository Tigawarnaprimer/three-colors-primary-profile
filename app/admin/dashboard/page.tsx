
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import VisitorStats from "@/components/VisitorStats";
import { supabase } from "@/lib/supabase";
import VisitorAnalytics from "@/components/VisitorAnalytics";
type ContentItem = {
  id: string;
  title: string;
  type: "Produk" | "Artikel";
  status: string;
  date: string | null;
};

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: "package" | "article" | "image" | "briefcase" | "layers" | "external" | "arrow";
  className?: string;
}) {
  const common = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
  };

  switch (name) {
    case "package":
      return (
        <svg {...common}>
          <path d="m12 3 9 5-9 5-9-5 9-5Z" />
          <path d="m3 8 9 5 9-5M3 8v9l9 5 9-5V8M12 13v9" />
        </svg>
      );
    case "article":
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
          <path d="M14 2v6h6M8 13h8M8 17h8" />
        </svg>
      );
    case "image":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      );
    case "briefcase":
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="14" rx="2" />
          <path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2" />
        </svg>
      );
    case "layers":
      return (
        <svg {...common}>
          <path d="m12 3 9 5-9 5-9-5 9-5Z" />
          <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
        </svg>
      );
    case "external":
      return (
        <svg {...common}>
          <path d="M14 3h7v7M10 14 21 3" />
          <path d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
  }
}

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

async function getDashboardData() {
  const [
    produk,
    artikel,
    galeri,
    karir,
    varian,
    recentProducts,
    recentArticles,
  ] = await Promise.all([
    supabase.from("produk").select("id", { count: "exact", head: true }).eq("status", "Aktif"),
    supabase.from("artikel").select("id", { count: "exact", head: true }).eq("status", "Aktif"),
    supabase.from("galeri").select("id", { count: "exact", head: true }).eq("status", "Aktif"),
    supabase.from("karir").select("id", { count: "exact", head: true }),
    supabase.from("varian_produk").select("id", { count: "exact", head: true }).eq("status", "Aktif"),
    supabase.from("produk").select("id, nama, status").order("id", { ascending: false }).limit(5),
    supabase.from("artikel").select("id, judul, tanggal, status").order("tanggal", { ascending: false }).limit(5),
  ]);

  const errors = [produk.error, artikel.error, galeri.error, karir.error, varian.error, recentProducts.error, recentArticles.error].filter(Boolean);
  if (errors.length) console.error("Gagal mengambil data dashboard:", errors);

  const items: ContentItem[] = [
    ...(recentProducts.data ?? []).map((item) => ({
      id: `produk-${item.id}`,
      title: item.nama,
      type: "Produk" as const,
      status: item.status ?? "-",
      date: null,
    })),
    ...(recentArticles.data ?? []).map((item) => ({
      id: `artikel-${item.id}`,
      title: item.judul,
      type: "Artikel" as const,
      status: item.status ?? "-",
      date: item.tanggal,
    })),
  ]
    .sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    })
    .slice(0, 6);

  return {
    produk: produk.count ?? 0,
    artikel: artikel.count ?? 0,
    galeri: galeri.count ?? 0,
    karir: karir.count ?? 0,
    varian: varian.count ?? 0,
    items,
  };
}

const cards = [
  { key: "produk", label: "Produk Aktif", icon: "package", accent: "bg-blue-50 text-blue-700" },
  { key: "artikel", label: "Artikel Aktif", icon: "article", accent: "bg-violet-50 text-violet-700" },
  { key: "galeri", label: "Foto Galeri", icon: "image", accent: "bg-emerald-50 text-emerald-700" },
  { key: "karir", label: "Lowongan", icon: "briefcase", accent: "bg-amber-50 text-amber-700" },
  { key: "varian", label: "Varian Produk", icon: "layers", accent: "bg-cyan-50 text-cyan-700" },
] as const;

export default async function AdminDashboard() {
  const data = await getDashboardData();
  const total = data.produk + data.artikel + data.galeri + data.karir + data.varian;

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      <main className="min-h-screen lg:ml-64">
        <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10">
          <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                PT Tiga Warna Primer
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Dashboard Admin
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Pantau konten dan performa website dari satu tempat.
              </p>
            </div>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-blue-950 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 sm:self-auto"
            >
              Lihat Website
              <Icon name="external" className="h-4 w-4" />
            </Link>
          </header>

          <section className="mb-8">
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Ringkasan Konten</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Data utama yang dikelola pada website.
                </p>
              </div>
              <p className="text-sm text-slate-500">
                Total <span className="font-semibold text-slate-800">{total.toLocaleString("id-ID")}</span> data
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {cards.map((card) => (
                <div
                  key={card.key}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.accent}`}>
                      <Icon name={card.icon} className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium text-slate-400">Total</span>
                  </div>
                  <p className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                    {data[card.key].toLocaleString("id-ID")}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-500">{card.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <VisitorStats />

<div className="mt-8">
  <VisitorAnalytics />
</div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Konten Terbaru</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Produk dan artikel terakhir yang tercatat.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href="/admin/produk" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  Kelola Produk
                </Link>
                <Link href="/admin/artikel" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  Kelola Artikel
                </Link>
              </div>
            </div>

            {data.items.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-sm font-medium text-slate-600">Belum ada konten untuk ditampilkan.</p>
                <p className="mt-1 text-xs text-slate-400">Konten terbaru akan muncul di sini.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Nama Konten</th>
                      <th className="px-6 py-4 font-semibold">Jenis</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.items.map((item) => (
                      <tr key={item.id} className="transition hover:bg-slate-50">
                        <td className="max-w-md px-6 py-4 font-semibold text-slate-800">
                          <span className="block truncate">{item.title || "Tanpa judul"}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{item.type}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            item.status.toLowerCase() === "aktif"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                          {formatDate(item.date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <footer className="mt-8 flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} PT Tiga Warna Primer</p>
            <p>Admin Panel</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
