"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const menu = [
  { title: "Dashboard", href: "/admin/dashboard", icon: "dashboard" },
  { title: "Kontak", href: "/admin/kontak", icon: "kontak" },
  { title: "Visi & Misi", href: "/admin/visi-misi", icon: "target" },
  { title: "Produk", href: "/admin/produk", icon: "product" },
  { title: "Keunggulan", href: "/admin/keunggulan", icon: "star" },
  { title: "Karir", href: "/admin/karir", icon: "career" },
  { title: "Galeri", href: "/admin/galeri", icon: "gallery" },
  { title: "Artikel", href: "/admin/artikel", icon: "article" },
  {
    title: "Tentang Kami",
    href: "/admin/tentangkami",
    icon: "footer",
  },
];

function MenuIcon({ type }: { type: string }) {
  const common = {
    className: "w-5 h-5",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
  };

  switch (type) {
    case "dashboard":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );

    case "kontak":
      return (
        <svg {...common}>
          <path
            d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-5l-3 3-3-3H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M8 10h8M8 14h5" strokeLinecap="round" />
        </svg>
      );

    case "company":
      return (
        <svg {...common}>
          <path
            d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 9h2a2 2 0 0 1 2 2v10"
            strokeLinecap="round"
          />
          <path
            d="M8 7h4M8 11h4M8 15h4M10 21v-3"
            strokeLinecap="round"
          />
        </svg>
      );

    case "target":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="12" r="4.5" />
          <circle cx="12" cy="12" r="1.5" />
        </svg>
      );

    case "product":
      return (
        <svg {...common}>
          <path
            d="m4 7 8-4 8 4-8 4-8-4Z"
            strokeLinejoin="round"
          />
          <path
            d="m4 12 8 4 8-4M4 17l8 4 8-4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "star":
      return (
        <svg {...common}>
          <path
            d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "career":
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path
            d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
            strokeLinecap="round"
          />
          <path d="M3 12h18" strokeLinecap="round" />
          <path
            d="M10 12v2h4v-2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "gallery":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="8.5" cy="9" r="1.5" />
          <path
            d="m5 17 4.5-4 3.2 3 2.3-2 4 3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "article":
      return (
        <svg {...common}>
          <path
            d="M5 3h11l3 3v15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
            strokeLinejoin="round"
          />
          <path
            d="M8 10h8M8 14h8M8 18h5"
            strokeLinecap="round"
          />
          <path d="M16 3v4h4" strokeLinejoin="round" />
        </svg>
      );

    case "footer":
      return (
        <svg {...common}>
          <path
            d="M4 5h16M4 12h16M4 19h16"
            strokeLinecap="round"
          />
          <circle cx="7" cy="5" r="1" />
          <circle cx="17" cy="12" r="1" />
          <circle cx="10" cy="19" r="1" />
        </svg>
      );

    default:
      return null;
  }
}

function LogoutIcon() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
        strokeLinecap="round"
      />
      <path
        d="M16 17l5-5-5-5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 12H9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SidebarContent({
  onClose,
}: {
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [disableLogoutConfirmation, setDisableLogoutConfirmation] =
    useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const savedSetting = localStorage.getItem(
      "disableLogoutConfirmation"
    );

    setDisableLogoutConfirmation(savedSetting === "true");
  }, []);

  const handleLogoutClick = () => {
    if (disableLogoutConfirmation) {
      handleLogout();
      return;
    }

    setShowLogoutModal(true);
  };

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Gagal logout:", error);
        setLoggingOut(false);
        return;
      }

      setShowLogoutModal(false);
      onClose?.();

      router.replace("/admin/login");
    } catch (error) {
      console.error("Terjadi kesalahan saat logout:", error);
      setLoggingOut(false);
    }
  };

  const handleToggleLogoutConfirmation = () => {
    const newValue = !disableLogoutConfirmation;

    setDisableLogoutConfirmation(newValue);

    localStorage.setItem(
      "disableLogoutConfirmation",
      String(newValue)
    );
  };

  return (
    <>
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="h-20 px-5 flex items-center border-b border-blue-900">
          <Link
            href="/admin/dashboard"
            onClick={onClose}
            className="flex items-center gap-3 w-full"
          >
            <div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center overflow-hidden shrink-0">
              <img
                src="/images/logo-admin.jpg"
                alt="PT Tiga Warna Primer"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <p className="text-sm font-bold text-white">
                Tiga Warna
              </p>

              <p className="text-xs text-blue-300 mt-0.5">
                Admin Panel
              </p>
            </div>
          </Link>
        </div>

        {/* Menu */}
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <p className="px-3 mb-3 text-[10px] font-bold tracking-[0.18em] text-blue-400 uppercase">
            Konten Website
          </p>

          <nav className="space-y-1">
            {menu.map((item) => {
              const active =
                item.href === "/admin/dashboard"
                  ? pathname === "/admin/dashboard"
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "bg-white text-blue-950 shadow-sm"
                      : "text-blue-100 hover:bg-blue-900 hover:text-white"
                  }`}
                >
                  <span
                    className={`w-5 h-5 flex items-center justify-center shrink-0 ${
                      active
                        ? "text-blue-700"
                        : "text-blue-300 group-hover:text-yellow-400"
                    }`}
                  >
                    <MenuIcon type={item.icon} />
                  </span>

                  <span>{item.title}</span>

                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom */}
        <div className="p-4 border-t border-blue-900">
          <div className="mb-3 px-3 py-3 rounded-lg bg-blue-900/50">
            <p className="text-xs text-blue-300">
              Login sebagai
            </p>

            <p className="mt-1 text-sm font-semibold text-white truncate">
              Administrator
            </p>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogoutClick}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold text-blue-200 hover:bg-red-500/10 hover:text-red-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="w-5 h-5 flex items-center justify-center">
              <LogoutIcon />
            </span>

            {loggingOut ? "Keluar..." : "Keluar"}
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-red-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M16 17l5-5-5-5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21 12H9"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Keluar dari Admin Panel?
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Apakah Anda yakin ingin keluar dari akun
                    administrator?
                  </p>
                </div>
              </div>
            </div>

            {/* Toggle */}
            <div className="mx-6 mb-5 flex items-center justify-between gap-4 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Jangan tampilkan lagi
                </p>

                <p className="text-xs text-gray-500 mt-0.5">
                  Logout berikutnya akan langsung keluar
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={disableLogoutConfirmation}
                onClick={handleToggleLogoutConfirmation}
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                  disableLogoutConfirmation
                    ? "bg-blue-700"
                    : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    disableLogoutConfirmation
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Buttons */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                disabled={loggingOut}
                className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50"
              >
                {loggingOut ? "Keluar..." : "Ya, Keluar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ========================================
          DESKTOP SIDEBAR
      ======================================== */}
      <aside className="fixed left-0 top-0 bottom-0 z-40 w-64 bg-blue-950 text-white hidden lg:flex flex-col">
        <SidebarContent />
      </aside>

      {/* ========================================
          MOBILE/TABLET HEADER
      ======================================== */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-white border-b border-gray-200">
        <div className="h-full px-4 flex items-center justify-between">
          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Buka menu admin"
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-blue-950 hover:bg-gray-50 transition"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M4 7h16M4 12h16M4 17h16"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* Logo */}
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2"
          >
            <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 overflow-hidden flex items-center justify-center">
              <img
                src="/images/logo-admin.jpg"
                alt="PT Tiga Warna Primer"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-bold text-blue-950 leading-tight">
                Tiga Warna
              </p>

              <p className="text-[10px] text-gray-500">
                Admin Panel
              </p>
            </div>
          </Link>

          {/* Spacer */}
          <div className="w-10" />
        </div>
      </header>

      {/* ========================================
          MOBILE/TABLET OVERLAY
      ======================================== */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ========================================
          MOBILE/TABLET DRAWER
      ======================================== */}
      <aside
        className={`lg:hidden fixed left-0 top-0 bottom-0 z-[60] w-72 max-w-[85vw] bg-blue-950 text-white shadow-2xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Tutup menu admin"
          className="absolute top-5 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-lg bg-blue-900 text-blue-200 hover:bg-blue-800 hover:text-white transition"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M6 6l12 12M18 6L6 18"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <SidebarContent onClose={() => setOpen(false)} />
      </aside>
    </>
  );
}