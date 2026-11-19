import type { Metadata } from "next";
import AdminGuard from "@/components/AdminGuard";
import PublishButton from "@/components/PublishButton";

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
  return (
    <AdminGuard>
      {children}
      <PublishButton />
    </AdminGuard>
  );
}
