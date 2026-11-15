
import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import VisitorTracker from "@/components/VisitorTracker";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://tigawarnaprimer.com"),
  title: {
    default: "PT Tiga Warna Primer",
    template: "%s | PT Tiga Warna Primer",
  },
  description: "Textile Dye & Chemical Specialist",
  icons: { icon: "/images/logo2.png" },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <VisitorTracker />
          <SiteChrome>{children}</SiteChrome>
        </ThemeProvider>
      </body>
    </html>
  );
}
