import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { useState } from "react";
import { X } from "lucide-react";
import beritaImg from "@/assets/berita1.jpeg";

export const Route = createFileRoute("/berita")({
  component: Berita,
});

function Berita() {
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  const articles = [
    {
      title: "PT Tiga Warna Primer Hadir di INDO INTERTEX 2026, Perkuat Langkah di Industri Tekstil Indonesia",
      date: "April 2026",
      category: "Event",
      image: beritaImg,
      excerpt: "PT Tiga Warna Primer turut hadir dalam ajang INDO INTERTEX 2026 yang diselenggarakan pada 15–18 April 2026 di Jakarta International Expo (JIExpo).",
      content: (
        <div className="space-y-4">
          <p>
            Jakarta, April 2026, PT Tiga Warna Primer turut hadir dalam ajang INDO INTERTEX 2026 yang diselenggarakan pada 15–18 April 2026 di Jakarta International Expo (JIExpo) Kemayoran, Jakarta. Pameran ini menjadi salah satu momentum penting bagi pelaku industri tekstil, garmen, dan pendukung produksi kain untuk melihat perkembangan teknologi, inovasi produk, serta peluang kerja sama di sektor tekstil.
          </p>
          <p>
            Kehadiran PT Tiga Warna Primer dalam pameran ini menjadi wujud komitmen perusahaan untuk terus mengikuti perkembangan industri tekstil yang semakin dinamis. Sebagai perusahaan yang berfokus pada pewarna tekstil dan solusi pendukung kebutuhan produksi kain, PT Tiga Warna Primer memanfaatkan kesempatan ini untuk memperluas wawasan pasar, membangun relasi bisnis, serta memahami kebutuhan industri secara lebih dekat.
          </p>
          <p>
            INDO INTERTEX 2026 mempertemukan berbagai pelaku industri, mulai dari produsen, supplier, buyer, hingga penyedia teknologi tekstil dari berbagai sektor. Melalui pameran ini, PT Tiga Warna Primer dapat melihat secara langsung tren terbaru dalam dunia tekstil, mulai dari perkembangan mesin produksi, teknologi pewarnaan, inovasi bahan, hingga kebutuhan pasar yang terus berkembang.
          </p>
          <p>
            Bagi PT Tiga Warna Primer, warna bukan hanya sekadar hasil akhir pada kain, tetapi juga menjadi bagian penting dalam menciptakan kualitas, karakter, dan nilai tambah pada sebuah produk tekstil. Oleh karena itu, pemilihan pewarna yang tepat menjadi faktor utama untuk menghasilkan warna yang lebih cerah, merata, kuat, dan sesuai dengan kebutuhan produksi.
          </p>
          <p>
            Melalui keikutsertaan dalam kegiatan industri seperti INDO INTERTEX 2026, PT Tiga Warna Primer terus memperkuat langkahnya untuk hadir sebagai mitra terpercaya bagi pelaku usaha tekstil, garment, printing kain, batik, dan berbagai industri berbasis kain lainnya. Perusahaan berkomitmen untuk terus menghadirkan produk dan layanan yang relevan, berkualitas, serta mampu menjawab kebutuhan industri tekstil Indonesia.
          </p>
          <p>
            Dengan semangat inovasi dan pelayanan terbaik, PT Tiga Warna Primer berharap dapat terus berkontribusi dalam mendukung perkembangan industri tekstil nasional, khususnya melalui penyediaan solusi pewarna tekstil yang tepat, berkualitas, dan terpercaya.
          </p>
        </div>
      )
    },
    // {
    //   title: "Peluncuran Produk Pewarna Ramah Lingkungan Terbaru",
    //   date: "12 Mei 2026",
    //   category: "Inovasi",
    //   excerpt: "PT Tiga Warna Primer kembali menghadirkan inovasi dengan merilis lini pewarna tekstil ramah lingkungan yang dapat mengurangi limbah cair hingga 40%.",
    // },
    // {
    //   title: "Pencapaian Sertifikasi ISO 9001:2015",
    //   date: "15 Februari 2026",
    //   category: "Perusahaan",
    //   excerpt: "Komitmen kami terhadap kualitas diakui secara internasional. PT Tiga Warna Primer resmi menerima sertifikasi sistem manajemen mutu ISO 9001:2015.",
    // },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20 px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-12">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue mb-3">Berita & Artikel</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight leading-tight">Kabar Terbaru</h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Ikuti perkembangan, inovasi, dan acara terbaru dari PT Tiga Warna Primer.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <div 
              key={i} 
              onClick={() => setSelectedArticle(article)}
              className="flex flex-col h-full rounded-3xl border border-border bg-background overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
            >
              <div className="aspect-video bg-muted relative overflow-hidden">
                {article.image && (
                  <img src={article.image} alt={article.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/20 to-brand-red/20 group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4 text-xs font-medium text-muted-foreground">
                  <span className="text-brand-blue">{article.category}</span>
                  <span>•</span>
                  <span>{article.date}</span>
                </div>
                <h3 className="font-display font-bold text-xl mb-3 leading-tight group-hover:text-brand-blue transition-colors line-clamp-3">{article.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">{article.excerpt}</p>
                <div className="mt-6 text-sm font-semibold inline-flex items-center gap-1 group-hover:text-brand-blue transition-colors">
                  Baca Selengkapnya <span className="translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
          <div className="relative max-w-4xl w-full max-h-[90vh] bg-background rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            
            <div className="overflow-y-auto w-full h-full p-6 sm:p-10 no-scrollbar">
              <div className="flex items-center gap-3 mb-4 text-sm font-medium text-brand-blue">
                <span>{selectedArticle.category}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{selectedArticle.date}</span>
              </div>
              
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6 leading-tight">
                {selectedArticle.title}
              </h2>
              
              {selectedArticle.image && (
                <div className="w-full mb-8 rounded-2xl overflow-hidden shadow-sm">
                  <img 
                    src={selectedArticle.image} 
                    alt={selectedArticle.title} 
                    className="w-full max-h-[400px] object-cover"
                  />
                </div>
              )}
              
              <div className="prose prose-slate max-w-none text-foreground/90">
                {selectedArticle.content ? (
                  selectedArticle.content
                ) : (
                  <p>{selectedArticle.excerpt}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-display font-bold">
            <span>PT Tiga Warna Primer</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 PT Tiga Warna Primer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
