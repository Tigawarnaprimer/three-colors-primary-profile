"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "Beranda", href: "/" },
  { label: "Tentang Kami", href: "/tentang-kami" },
  { label: "Visi & Misi", href: "/visi-misi" },
  { label: "Produk", href: "/produk" },
  { label: "Keunggulan", href: "/keunggulan" },
  { label: "Karir", href: "/karir" },
  { label: "Galeri", href: "/galeri" },
  { label: "Artikel", href: "/artikel" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">

        {/* HEADER */}
        <div className="h-[68px] lg:h-[80px] flex items-center">

          {/* HAMBURGER MOBILE */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-md border border-gray-200 text-blue-950 hover:bg-gray-50 transition"
            aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
          >
            {mobileMenuOpen ? (
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  d="M6 6l12 12M18 6L6 18"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  d="M4 7h16M4 12h16M4 17h16"
                />
              </svg>
            )}
          </button>

          {/* LOGO */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="ml-auto lg:ml-0 flex items-center"
          >
            <div
              className="
                relative
                w-[125px]
                h-[48px]
                flex
                items-center
                justify-end
                translate-y-[10px]
                lg:translate-y-5
                lg:w-[190px]
                lg:h-[60px]
              "
            >
              <Image
                src="/images/logo.jpg"
                alt="PT Tiga Warna Primer"
                width={220}
                height={70}
                priority
                className="
                  w-[120px]
                  h-auto
                  object-contain
                  lg:w-[175px]
                "
              />
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 ml-auto">
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-[13px] font-bold transition-colors ${
                    active
                      ? "text-blue-700"
                      : "text-gray-700 hover:text-blue-700"
                  }`}
                >
                  {item.label}

                  {active && (
                    <span className="absolute -bottom-2 left-0 right-0 mx-auto h-[2px] bg-yellow-400 rounded-full" />
                  )}
                </Link>
              );
            })}

            {/* DESKTOP CTA */}
            <Link
              href="/kontak"
              className="ml-1 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg text-[13px] font-semibold transition"
            >
              Hubungi Kami
            </Link>
          </nav>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <nav className="py-2">

              {navItems.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-1 py-3.5 border-b border-gray-50 text-sm font-semibold ${
                      active
                        ? "text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    <span>{item.label}</span>

                    {active && (
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    )}
                  </Link>
                );
              })}

              {/* MOBILE CTA */}
              <Link
                href="/kontak"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-3 mb-2 flex items-center justify-center bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-lg text-sm font-semibold transition"
              >
                Hubungi Kami
              </Link>

            </nav>
          </div>
        )}

      </div>
    </header>
  );
}