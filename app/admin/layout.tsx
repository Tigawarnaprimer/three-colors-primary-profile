import type { Metadata } from "next";
import AdminGuard from "@/components/AdminGuard";

// Halaman admin tidak boleh muncul di Google
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminGuard>{children}</AdminGuard>;
}
