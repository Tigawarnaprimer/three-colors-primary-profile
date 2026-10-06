import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logoImg from "@/assets/logo.jpeg";

const links = [
  { href: "/#tentang", label: "Tentang" },
  { href: "/#visi-misi", label: "Visi & Misi" },
  { href: "/#nilai", label: "Nilai" },
  { href: "/#proses", label: "Proses" },
  { href: "/produk", label: "Produk" },
  { href: "/karir", label: "Karir" },
  { href: "/berita", label: "Berita" },
  { href: "/#kontak", label: "Kontak" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-md border-b border-border" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="/#hero" className="flex items-center gap-2 font-display font-bold text-lg">
          <img src={logoImg} alt="Logo Perusahaan" className="h-[30px] rounded-sm" />
          <span className={`tracking-tight transition-colors duration-300 ${scrolled ? "text-foreground" : "text-white"}`}>
            Tiga Warna Primer
          </span>
        </a>

        <nav className={`hidden md:flex items-center gap-8 text-sm font-medium transition-colors duration-300 ${scrolled ? "text-muted-foreground" : "text-white/80"}`}>
          {links.map((l) => (
            <a key={l.label} href={l.href} className={`transition-colors duration-300 ${scrolled ? "hover:text-foreground" : "hover:text-white"}`}>
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="/#kontak"
          className={`hidden md:inline-flex items-center rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
            scrolled
              ? "bg-foreground text-background hover:opacity-90"
              : "bg-white text-black hover:bg-white/90 shadow-md"
          }`}
        >
          Hubungi Kami
        </a>

        <button className={`md:hidden transition-colors duration-300 ${scrolled ? "text-foreground" : "text-white"}`} onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background border-b border-border">
          <nav className="flex flex-col px-6 py-4 gap-3 text-sm">
            {links.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="py-1.5 text-muted-foreground">
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
