import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Reveal } from "@/components/Reveal";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import disperseImg from "@/assets/disperse.jpeg";
import reaktifImg from "@/assets/reaktif.jpg";
import acidImg from "@/assets/acid.jpeg";
import liquidImg from "@/assets/liquid.jpg";
import dispersePdf from "@/assets/Catalogue Disperse Fix.pdf";
import reaktifPdf from "@/assets/612cbf3f-df16-4788-8204-fbe746c9539c-halaman.pdf";

export const Route = createFileRoute("/produk")({
  component: ProdukPage,
});

function SectionHeader({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
  return (
    <Reveal>
      <div className="max-w-2xl mb-16">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red mb-3">{eyebrow}</div>
        <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight leading-tight">{title}</h2>
        {desc && <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{desc}</p>}
      </div>
    </Reveal>
  );
}

function ProdukPage() {
  const products = [
    {
      img: disperseImg,
      name: "Pewarna Disperse",
      desc: "Khusus serat sintetis seperti polyester. Hasil tajam, merata, tahan pencucian dan suhu tinggi.",
      pdf: dispersePdf
    },
    {
      img: reaktifImg,
      name: "Pewarna Reaktif",
      desc: "Ikatan kimia kuat dengan serat selulosa untuk warna tahan lama dan cerah.",
      pdf: reaktifPdf
    },
    {
      img: acidImg,
      name: "Pewarna Acid",
      desc: "Ideal untuk wool, nylon, dan silk. Hasil halus dengan ketahanan warna baik."
    },
    {
      img: liquidImg,
      name: "Nano Disperse",
      desc: "Solusi praktis: mudah diaplikasikan, mengurangi debu, efisien dalam skala produksi."
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20">
        <section id="produk" className="py-12 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <SectionHeader
              eyebrow="Kategori Produk"
              title="Rangkaian pewarna untuk setiap kebutuhan tekstil Anda."
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p, i) => (
                <Reveal key={p.name} delay={i * 80}>
                  <div
                    onClick={() => {
                      if (p.pdf) {
                        window.open(p.pdf, '_blank');
                      } else {
                        toast.info(`Katalog untuk ${p.name} akan segera tersedia.`);
                      }
                    }}
                    className="group relative aspect-square rounded-3xl overflow-hidden bg-muted border border-border/50 shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer"
                  >
                    <img
                      src={p.img}
                      alt={p.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                    <div className="absolute inset-0 p-7 flex flex-col justify-end">
                      <div className="flex items-end justify-between gap-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-bold text-xl text-white mb-2 leading-tight">{p.name}</h3>
                          <p className="text-sm text-white/70 line-clamp-2 leading-relaxed mb-1">{p.desc}</p>
                        </div>

                        {p.pdf && (
                          <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-brand-red hover:text-white transition-all duration-300 shadow-xl flex-shrink-0">
                            <ArrowUpRight size={22} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-display font-bold">
            <span>PT Tiga Warna Primer</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 PT Tiga Warna Primer. All rights reserved.</p>
        </div>
      </footer>
      <Toaster richColors position="top-center" />
    </div>
  );
}
