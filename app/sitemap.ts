import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

// Wajib untuk static export
export const dynamic = "force-static";

const SITE_URL = "https://tigawarnaprimer.com";

// Halaman tetap, dengan garis miring di akhir (sesuai trailingSlash: true)
const STATIC_PATHS = [
  "",
  "tentang-kami",
  "visi-misi",
  "produk",
  "keunggulan",
  "karir",
  "galeri",
  "artikel",
  "kontak",
];

type Slug = { slug: string | null };
type Article = { slug: string | null; tanggal: string | null };
type Gallery = { id: number | string };

function url(path: string) {
  return path ? `${SITE_URL}/${path}/` : `${SITE_URL}/`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [produk, artikel, galeri] = await Promise.all([
    supabase.from("produk").select("slug").eq("status", "Aktif"),
    supabase.from("artikel").select("slug, tanggal").eq("status", "Aktif"),
    supabase.from("galeri").select("id").eq("status", "Aktif"),
  ]);

  // Gagal ambil data = build berhenti, jangan terbitkan sitemap tidak lengkap.
  for (const result of [produk, artikel, galeri]) {
    if (result.error) {
      throw new Error(`Gagal membuat sitemap: ${result.error.message}`);
    }
  }

  const pages: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: url(path),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const products: MetadataRoute.Sitemap = ((produk.data ?? []) as Slug[])
    .filter((item) => item.slug)
    .map((item) => ({
      url: url(`produk/${item.slug}`),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  const articles: MetadataRoute.Sitemap = ((artikel.data ?? []) as Article[])
    .filter((item) => item.slug)
    .map((item) => ({
      url: url(`artikel/${item.slug}`),
      lastModified: item.tanggal ? new Date(item.tanggal) : undefined,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  const galleries: MetadataRoute.Sitemap = ((galeri.data ?? []) as Gallery[]).map((item) => ({
    url: url(`galeri/${item.id}`),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...pages, ...products, ...articles, ...galleries];
}
