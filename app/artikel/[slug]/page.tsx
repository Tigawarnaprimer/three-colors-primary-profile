import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ArtikelDetailClient, { type Article } from "./ArtikelDetailClient";

const ARTICLE_COLUMNS =
  "id, judul, slug, kategori, tanggal, ringkasan, isi, gambar_url, status";

// Hanya slug yang dibuat saat build yang tersedia (static export).
export const dynamicParams = false;

export async function generateStaticParams() {
  const { data, error } = await supabase
    .from("artikel")
    .select("slug")
    .eq("status", "Aktif");

  if (error) {
    throw new Error(`Gagal mengambil slug artikel: ${error.message}`);
  }

  return (data ?? [])
    .filter((item) => item.slug)
    .map((item) => ({ slug: item.slug as string }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const { data: article } = await supabase
    .from("artikel")
    .select("judul, ringkasan, gambar_url, tanggal")
    .eq("slug", slug)
    .eq("status", "Aktif")
    .maybeSingle();

  if (!article) return {};

  const description = (article.ringkasan ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);

  return {
    title: article.judul,
    description,
    alternates: { canonical: `/artikel/${slug}/` },
    openGraph: {
      title: article.judul,
      description,
      type: "article",
      url: `/artikel/${slug}/`,
      publishedTime: article.tanggal ?? undefined,
      images: article.gambar_url ? [{ url: article.gambar_url }] : undefined,
    },
  };
}

export default async function ArtikelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: article, error } = await supabase
    .from("artikel")
    .select(ARTICLE_COLUMNS)
    .eq("slug", slug)
    .eq("status", "Aktif")
    .maybeSingle();

  if (error) {
    throw new Error(`Gagal mengambil artikel: ${error.message}`);
  }

  if (!article) notFound();

  const { data: related } = await supabase
    .from("artikel")
    .select(ARTICLE_COLUMNS)
    .eq("status", "Aktif")
    .neq("slug", slug)
    .order("tanggal", { ascending: false })
    .limit(3);

  return (
    <ArtikelDetailClient
      slug={slug}
      initialArticle={article as Article}
      initialRelated={(related ?? []) as Article[]}
    />
  );
}
