"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PromoPopup from "@/components/PromoPopup";

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Semua halaman admin tidak menggunakan Navbar, Footer,
  // maupun Popup iklan.
  const isAdminPage = pathname.startsWith("/admin");

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />

      {children}

      <Footer />

      <PromoPopup />
    </>
  );
}