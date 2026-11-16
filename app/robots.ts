import type { MetadataRoute } from "next";

// Wajib untuk static export
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/"],
    },
    sitemap: "https://tigawarnaprimer.com/sitemap.xml",
  };
}
