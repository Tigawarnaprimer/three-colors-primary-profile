import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import { z } from "zod";
import {
  ArrowRight,
  MapPin,
  Mail,
  Phone,
  Sparkles,
  Leaf,
  Award,
  HeartHandshake,
  FlaskConical,
  Factory,
  ShieldCheck,
  Package,
  Truck,
  CheckCircle2,
  Zap,
  Palette,
  FileBadge,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Reveal } from "@/components/Reveal";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import buildingImg from "@/assets/building.jpg";
import slide2Img from "@/assets/slide 2.jpeg";
import factoryImg from "@/assets/factory.png";
import logoImg from "@/assets/logo.jpeg";
import logo1 from "@/assets/logo 1.png";
import logo2 from "@/assets/logo 2.png";
import logo3 from "@/assets/logo 3.jpeg";
import logo4 from "@/assets/logo 4.png";

import { FileText, Eye } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

const contactSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi").max(100),
  email: z.string().trim().email("Email tidak valid").max(255),
  message: z.string().trim().min(1, "Pesan wajib diisi").max(1000),
});

import posterImg from "@/assets/poster.jpeg";
import { X } from "lucide-react";

function Index() {
  const [showModal, setShowModal] = useState(true);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <About />
      <VisiMisi />
      <Nilai />
      <Simbolisme />
      <Proses />
      <Kekuatan />
      <Kontak />
      <Footer />
      <Toaster richColors position="top-center" />

      {/* Poster Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative max-w-sm w-full animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setShowModal(false)}
              className="absolute -top-4 -right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center text-black shadow-lg hover:scale-105 transition-transform"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            <img 
              src={posterImg} 
              alt="Poster Promosi" 
              className="w-full h-auto rounded-xl shadow-2xl object-contain max-h-[90vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Hero() {
  const slides = [
    {
      img: buildingImg,
      alt: "Kantor PT Tiga Warna Primer",
    },
    {
      img: slide2Img,
      alt: "Operasional PT Tiga Warna Primer",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Full-Screen Slider Background */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden bg-black">
        {slides.map((slide, idx) => (
          <img
            key={idx}
            src={slide.img}
            alt={slide.alt}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${idx === currentSlide ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0"
              }`}
          />
        ))}
        {/* Dark Gradient Overlay for optimal readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/35 z-10" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-32 grid lg:grid-cols-12 gap-12 items-center w-full relative z-20">
        <div className="lg:col-span-8">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 backdrop-blur px-4 py-1.5 text-xs font-medium text-white/90 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse" />
              Produsen Pewarna Tekstil — Tangerang, Indonesia
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-white">
              Menciptakan Warna,
              <br />
              <span className="bg-gradient-to-r from-brand-red via-brand-yellow to-brand-blue bg-clip-text text-transparent">
                Mendefinisikan Kualitas
              </span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-8 text-lg text-white/80 max-w-2xl leading-relaxed">
              PT Tiga Warna Primer adalah perusahaan manufaktur pewarna dan bahan kimia yang menghadirkan
              solusi presisi, andal, dan berkelanjutan untuk industri pewarnaan tekstil.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#tentang"
                className="inline-flex items-center gap-2 rounded-full bg-white text-black hover:bg-white/90 px-7 py-3.5 font-medium transition shadow-lg"
              >
                Pelajari Lebih Lanjut <ArrowRight size={18} />
              </a>
              <a
                href="/produk"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur px-7 py-3.5 font-medium text-white hover:bg-white/20 transition"
              >
                Lihat Produk
              </a>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-4 flex justify-center lg:justify-end">
          <div className="animate-float">
            <Reveal delay={600}>
              <div className="bg-white/10 backdrop-blur-xl p-5 rounded-3xl shadow-2xl border border-white/10 flex flex-col items-center gap-4 hover:scale-105 transition-transform duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-white/95 flex items-center justify-center p-2 shadow-inner">
                    <img src={logo3} alt="Quality Logo" className="w-full h-full object-contain" />
                  </div>
                <div className="w-20 h-20 rounded-2xl bg-white/95 flex items-center justify-center p-2 shadow-inner">
                  <img src={logo4} alt="Quality Logo" className="w-full h-full object-contain" />
                </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-2xl bg-white/95 flex items-center justify-center p-2 shadow-inner">
                    <img src={logo2} alt="Partner Logo" className="w-full h-full object-contain" />
                  </div>
                <div className="w-24 h-24 rounded-2xl bg-white/95 flex items-center justify-center p-2 shadow-inner">
                  <img src={logo1} alt="Quality Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="text-md font-bold uppercase tracking-widest text-brand-yellow leading-none mb-1">Quality</div>
                  <div className="text-md font-bold text-white">Standard</div>
                </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Manual Slider Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${idx === currentSlide ? "bg-white w-6" : "bg-white/40 hover:bg-white/60"}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

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

function About() {
  return (
    <section id="tentang" className="py-28 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <Reveal>
          <img src={factoryImg} alt="Fasilitas produksi" className="rounded-3xl shadow-xl w-full aspect-[4/3] object-cover" />
        </Reveal>
        <div>
          <SectionHeader
            eyebrow="Tentang Perusahaan"
            title="Mitra terpercaya untuk industri pewarnaan tekstil."
          />
          <Reveal delay={100}>
            <p className="text-muted-foreground text-lg leading-relaxed">
              PT Tiga Warna Primer berlokasi di Tangerang, Banten — berfokus pada produksi pewarna dan
              bahan kimia berkualitas tinggi. Kami berkomitmen menghadirkan solusi yang andal, layanan
              profesional, serta inovasi berkelanjutan untuk mendukung kebutuhan pelanggan.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-10 grid grid-cols-3 gap-6">
              {[
                { num: "100%", label: "Quality Assured" },
                { num: "10+", label: "Tahun Pengalaman" },
                { num: "24/7", label: "Dukungan Mitra" },
              ].map((s) => (
                <div key={s.label} className="border-l-2 border-brand-blue pl-4">
                  <div className="font-display text-3xl font-bold">{s.num}</div>
                  <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function VisiMisi() {
  const highlight = (text: string, words: string[]): React.ReactNode[] => {
    let parts: React.ReactNode[] = [text];
    words.forEach((w, i) => {
      const next: React.ReactNode[] = [];
      parts.forEach((part, k) => {
        if (typeof part !== "string") {
          next.push(part);
          return;
        }
        part.split(new RegExp(`(${w})`, "i")).forEach((p, j) => {
          if (p.toLowerCase() === w.toLowerCase()) {
            next.push(
              <span key={`${i}-${k}-${j}`} className="font-bold bg-gradient-to-r from-brand-red via-brand-yellow to-brand-blue bg-clip-text text-transparent">
                {p}
              </span>
            );
          } else if (p) {
            next.push(p);
          }
        });
      });
      parts = next;
    });
    return parts;
  };

  return (
    <section id="visi-misi" className="py-28 px-6 lg:px-8 bg-secondary/40">
      <div className="max-w-7xl mx-auto">
        <SectionHeader eyebrow="Visi & Misi" title="Membangun masa depan warna." />
        <div className="grid md:grid-cols-2 gap-8">
          <Reveal>
            <div className="bg-background rounded-3xl p-10 border-t-4 border-brand-red h-full">
              <div className="text-xs font-bold uppercase tracking-wider text-brand-red mb-4">Visi</div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {highlight(
                  "Menjadi produsen pewarna tekstil terkemuka di Indonesia yang dikenal akan kualitas produk. Kami berkomitmen pada inovasi berkelanjutan serta memberikan dampak positif untuk industri pewarna dan lingkungan.",
                  ["kualitas", "inovasi berkelanjutan", "dampak positif"]
                )}
              </p>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="bg-background rounded-3xl p-10 border-t-4 border-brand-blue h-full">
              <div className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-4">Misi</div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {highlight(
                  "Kami mengutamakan pelanggan, inovasi, dan kolaborasi. Dengan memahami kebutuhan secara tepat, kami menghadirkan solusi warna yang presisi, efisien, dan bernilai tinggi untuk meningkatkan daya saing serta mendukung pertumbuhan mitra secara berkelanjutan.",
                  ["inovasi", "presisi", "berkelanjutan"]
                )}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Nilai() {
  const items = [
    { icon: Sparkles, title: "Inovasi", desc: "Pengembangan formula dan teknologi pewarnaan yang terus berkembang.", color: "text-brand-red", bg: "bg-brand-red/10" },
    { icon: Leaf, title: "Keberlanjutan", desc: "Praktik bisnis ramah lingkungan untuk masa depan yang lebih hijau.", color: "text-brand-blue", bg: "bg-brand-blue/10" },
    { icon: Award, title: "Kualitas", desc: "Standar tinggi pada setiap batch produksi yang konsisten dan terukur.", color: "text-brand-yellow", bg: "bg-brand-yellow/15" },
    { icon: HeartHandshake, title: "Kepuasan Pelanggan", desc: "Keberhasilan pelanggan adalah keberhasilan kami.", color: "text-brand-red", bg: "bg-brand-red/10" },
  ];
  return (
    <section id="nilai" className="py-28 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Nilai & Komitmen"
          title="Empat pilar yang menjadi fondasi setiap langkah kami."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 80}>
              <div className="group h-full rounded-2xl border border-border p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-background">
                <div className={`w-12 h-12 rounded-xl ${it.bg} flex items-center justify-center mb-5`}>
                  <it.icon className={it.color} size={22} />
                </div>
                <h3 className="font-display font-bold text-xl mb-2">{it.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{it.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Simbolisme() {
  const colors = [
    { name: "Merah", meaning: "Energi & Inovasi", desc: "Mencerminkan semangat menyala dan keberanian memimpin inovasi dalam industri pewarna.", className: "bg-brand-red text-white" },
    { name: "Kuning", meaning: "Pertumbuhan", desc: "Membawa esensi pertumbuhan dinamis dan inspirasi untuk terus maju dengan ide-ide segar.", className: "bg-brand-yellow text-foreground" },
    { name: "Biru", meaning: "Kepercayaan & Profesionalisme", desc: "Mencerminkan komitmen pada profesionalisme dan kepercayaan dengan mitra bisnis.", className: "bg-brand-blue text-white" },
  ];
  return (
    <section className="py-28 px-6 lg:px-8 bg-secondary/40">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Simbolisme Warna"
          title="Tiga warna, satu identitas yang bermakna."
        />
        <div className="grid md:grid-cols-3 gap-6">
          {colors.map((c, i) => (
            <Reveal key={c.name} delay={i * 100}>
              <div className={`${c.className} rounded-3xl p-10 h-full flex flex-col justify-between min-h-[280px] hover:scale-[1.02] transition-transform duration-300`}>
                <div className="text-xs font-bold uppercase tracking-[0.25em] opacity-80">{c.name}</div>
                <div>
                  <div className="font-display text-3xl font-bold mb-3">{c.meaning}</div>
                  <p className="text-sm opacity-90 leading-relaxed">{c.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Proses() {
  const steps = [
    { icon: FlaskConical, title: "R&D", desc: "Riset dan pengembangan formula sesuai standar industri." },
    { icon: Factory, title: "Produksi", desc: "Manufaktur skala besar dengan kontrol parameter ketat." },
    { icon: ShieldCheck, title: "Quality Control", desc: "Pengujian setiap batch untuk konsistensi hasil." },
    { icon: Package, title: "Packaging", desc: "Kemasan ramah lingkungan dengan label informatif." },
    { icon: Truck, title: "Distribusi", desc: "Pengiriman terlacak, tepat waktu ke seluruh wilayah." },
  ];
  return (
    <section id="proses" className="py-28 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Proses Produksi"
          title="Lima tahap presisi dari ide hingga produk sampai ke pelanggan."
        />
        <div className="relative">
          <div className="hidden lg:block absolute top-7 left-[0%] right-[15%] h-px bg-gradient-to-r from-brand-red via-brand-yellow to-brand-blue" />
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-6">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 100}>
                <div className="relative text-center lg:text-left">
                  <div className="relative inline-flex w-14 h-14 rounded-full bg-background border-2 border-foreground items-center justify-center mb-5 mx-auto lg:mx-0">
                    <s.icon size={22} />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


function Kekuatan() {
  const items = [
    { icon: Award, title: "Kualitas Tinggi Konsisten", desc: "Setiap batch memenuhi standar kualitas tinggi dengan hasil pewarnaan seragam." },
    { icon: Zap, title: "Cepat Kering, Daya Tutup Tinggi", desc: "Formulasi untuk mempercepat pengeringan tanpa mengurangi kualitas hasil." },
    { icon: Palette, title: "Konsultasi Warna Gratis", desc: "Layanan konsultasi untuk menyesuaikan kebutuhan pewarnaan spesifik Anda." },
    { icon: FileBadge, title: "Jaminan Kualitas (COA)", desc: "Setiap produk dilengkapi sertifikat analisa untuk kepercayaan mitra." },
  ];
  return (
    <section className="py-28 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Kekuatan Kompetitif"
          title="Mengapa mitra industri memilih kami."
        />
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 80}>
              <div className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-foreground text-background flex items-center justify-center">
                  <it.icon size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl mb-2 flex items-center gap-2">
                    {/* <CheckCircle2 size={18} className="text-brand-blue" /> */}
                    {it.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{it.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Kontak() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        if (i.path[0]) errs[i.path[0] as string] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setForm({ name: "", email: "", message: "" });
      toast.success("Pesan terkirim! Tim kami akan menghubungi Anda segera.");
    }, 700);
  };

  return (
    <section id="kontak" className="py-28 px-6 lg:px-8 bg-secondary/40">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Hubungi Kami"
          title="Mari bicarakan kebutuhan warna Anda."
          desc="Tim kami siap memberikan konsultasi dan solusi terbaik untuk industri Anda."
        />
        <div className="grid lg:grid-cols-2 gap-10">
          <Reveal>
            <div className="space-y-6">
              <div className="bg-background rounded-2xl p-6 border border-border flex gap-4">
                <div className="w-11 h-11 rounded-lg bg-brand-red/10 text-brand-red flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="font-semibold mb-1">Alamat</div>
                  <p className="text-sm text-muted-foreground">
                    Ruko Victoria Park Blok A2/23, Karawaci, Kec. Karawaci, Kota Tangerang, Banten 15115
                  </p>
                </div>
              </div>
              <div className="bg-background rounded-2xl p-6 border border-border flex gap-4">
                <div className="w-11 h-11 rounded-lg bg-brand-yellow/15 text-foreground flex items-center justify-center flex-shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <div className="font-semibold mb-1">Telepon</div>
                  <a href="tel:+6285212102608" className="text-sm text-muted-foreground hover:text-foreground">
                    +62 852-1210-2608
                  </a>
                </div>
              </div>
              <div className="bg-background rounded-2xl p-6 border border-border flex gap-4">
                <div className="w-11 h-11 rounded-lg bg-brand-blue/10 text-brand-blue flex items-center justify-center flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="font-semibold mb-1">Email</div>
                  <a href="mailto:tigawarnaprimer88@gmail.com" className="text-sm text-muted-foreground hover:text-foreground break-all">
                    tigawarnaprimer88@gmail.com
                  </a>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden border border-border h-64">
                <iframe
                  title="Lokasi PT Tiga Warna Primer"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.4834476657875!2d106.61590699678953!3d-6.199771499999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ff5113cc7c3b%3A0xe5cdd55e635a8c80!2sHead%20Office%20PT%20Tiga%20Warna%20Primer!5e0!3m2!1sid!2sid!4v1778187429034!5m2!1sid!2sid"
                  className="w-full h-full border-0"
                  loading="lazy"
                />
                {/* <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.4834476657875!2d106.61590699678953!3d-6.199771499999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ff5113cc7c3b%3A0xe5cdd55e635a8c80!2sHead%20Office%20PT%20Tiga%20Warna%20Primer!5e0!3m2!1sid!2sid!4v1778187429034!5m2!1sid!2sid" 
                width="600" 
                height="450" 
                style="border:0;" 
                allowfullscreen="" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade" 
                /> */}
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <form onSubmit={onSubmit} className="bg-background rounded-3xl p-8 border border-border space-y-5">
              <div>
                <label className="text-sm font-medium mb-2 block">Nama</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  maxLength={100}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Nama lengkap Anda"
                />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  maxLength={255}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="email@perusahaan.com"
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Pesan</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  maxLength={1000}
                  rows={5}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Ceritakan kebutuhan Anda..."
                />
                {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-7 py-3.5 font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? "Mengirim..." : "Kirim Pesan"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 font-display font-bold">
          <img src={logoImg} alt="Logo Perusahaan" className="h-[30px]" />
          <span>PT Tiga Warna Primer</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Menciptakan Warna, Mendefinisikan Kualitas.
        </p>
        <p className="text-sm text-muted-foreground">© 2026 PT Tiga Warna Primer. All rights reserved.</p>
      </div>
    </footer>
  );
}
