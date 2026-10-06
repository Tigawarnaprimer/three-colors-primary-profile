import Link from "next/link";

function Icon({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center text-yellow-400">
      {children}
    </span>
  );
}

function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

function CompanyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M4 21V4h16v17" />
      <path d="M8 8h2M14 8h2M8 12h2M14 12h2M8 16h2M14 16h2" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  );
}

function ProductIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M4 7h16v13H4z" />
      <path d="M8 7V4h8v3" />
      <path d="M8 12h8M8 16h5" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
    </svg>
  );
}

function GalleryIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9" r="1.5" />
      <path d="m4 17 5-5 4 4 2-2 5 5" />
    </svg>
  );
}

function ArticleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M5 3h14v18H5z" />
      <path d="M8 7h8M8 11h8M8 15h5" />
    </svg>
  );
}

function CareerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 12h18" />
      <path d="M10 12v2h4v-2" />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M4 5h16v14H4z" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L4 20l1.1-3.8A8.5 8.5 0 1 1 20.5 11.5Z" />
      <path d="M8.5 8.5c.3-.5.6-.5.9-.4l1 .4c.2.1.3.2.4.5l.4 1c.1.2 0 .4-.1.6l-.5.6c.6 1 1.4 1.8 2.4 2.4l.6-.5c.2-.2.4-.2.6-.1l1 .4c.3.1.4.2.5.4l.4 1c.1.3 0 .6-.4.9-.4.3-1 .4-1.5.3-1.1-.2-2.5-.9-3.8-2.2s-2-2.7-2.2-3.8c-.1-.5 0-1.1.3-1.5Z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function AdminIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path d="M12 3 4 6v5c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V6l-8-3Z" />
      <path d="M9.5 12 11 13.5l3.5-3.5" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">

          {/* COMPANY */}
          <div>
            <h2 className="text-xl font-bold text-white">
              PT Tiga Warna Primer
            </h2>

            <div className="mt-3 h-1 w-12 rounded-full bg-yellow-400" />

            <p className="mt-5 max-w-sm text-sm font-medium leading-7 text-blue-100">
              Textile Dye & Chemical Specialist yang menyediakan solusi
              pewarna dan bahan kimia untuk kebutuhan industri tekstil.
            </p>
          </div>

          {/* NAVIGASI */}
          <div>
            <h3 className="text-base font-bold text-white">
              Navigasi
            </h3>

            <div className="mt-3 h-1 w-12 rounded-full bg-yellow-400" />

            <nav className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">

              <Link
                href="/"
                className="flex items-center gap-2 text-sm font-semibold text-blue-100 transition hover:text-white"
              >
                <Icon>
                  <HomeIcon />
                </Icon>
                Home
              </Link>

              <Link
                href="/tentang-kami"
                className="flex items-center gap-2 text-sm font-semibold text-blue-100 transition hover:text-white"
              >
                <Icon>
                  <CompanyIcon />
                </Icon>
                Tentang Kami
              </Link>

              <Link
                href="/visi-misi"
                className="flex items-center gap-2 text-sm font-semibold text-blue-100 transition hover:text-white"
              >
                <Icon>
                  <TargetIcon />
                </Icon>
                Visi & Misi
              </Link>

              <Link
                href="/produk"
                className="flex items-center gap-2 text-sm font-semibold text-blue-100 transition hover:text-white"
              >
                <Icon>
                  <ProductIcon />
                </Icon>
                Produk
              </Link>

              <Link
                href="/keunggulan"
                className="flex items-center gap-2 text-sm font-semibold text-blue-100 transition hover:text-white"
              >
                <Icon>
                  <StarIcon />
                </Icon>
                Keunggulan
              </Link>

              <Link
                href="/galeri"
                className="flex items-center gap-2 text-sm font-semibold text-blue-100 transition hover:text-white"
              >
                <Icon>
                  <GalleryIcon />
                </Icon>
                Galeri
              </Link>

              <Link
                href="/artikel"
                className="flex items-center gap-2 text-sm font-semibold text-blue-100 transition hover:text-white"
              >
                <Icon>
                  <ArticleIcon />
                </Icon>
                Artikel
              </Link>

              {/* KARIR */}
              <Link
                href="/karir"
                className="flex items-center gap-2 text-sm font-semibold text-blue-100 transition hover:text-white"
              >
                <Icon>
                  <CareerIcon />
                </Icon>
                Karir
              </Link>

              <Link
                href="/kontak"
                className="flex items-center gap-2 text-sm font-semibold text-blue-100 transition hover:text-white"
              >
                <Icon>
                  <ContactIcon />
                </Icon>
                Kontak
              </Link>

            </nav>
          </div>

          {/* KONTAK */}
          <div>
            <h3 className="text-base font-bold text-white">
              Hubungi Kami
            </h3>

            <div className="mt-3 h-1 w-12 rounded-full bg-yellow-400" />

            <div className="mt-5 space-y-4">

              {/* Lokasi */}
              <div className="flex items-start gap-3">
                <Icon>
                  <LocationIcon />
                </Icon>

                <p className="text-sm font-medium leading-6 text-blue-100">
                  Tangerang, Banten
                </p>
              </div>

              {/* WhatsApp */}
              <div className="flex items-center gap-3">
                <Icon>
                  <WhatsAppIcon />
                </Icon>

                <a
                  href="https://wa.me/6285136035632"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-100 transition hover:text-white"
                >
                  +62 851-3603-5632
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <Icon>
                  <EmailIcon />
                </Icon>

                <a
                  href="mailto:tigawarnaprimer88@gmail.com"
                  className="break-all text-sm font-medium text-blue-100 transition hover:text-white"
                >
                  tigawarnaprimer88@gmail.com
                </a>
              </div>

            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-blue-800 pt-5 sm:flex-row">

          <p className="text-center text-sm font-medium text-blue-200 sm:text-left">
            © {new Date().getFullYear()} PT Tiga Warna Primer. All rights
            reserved.
          </p>

          <Link
            href="/admin/login"
            className="flex items-center gap-2 text-xs font-semibold text-blue-300 transition hover:text-white"
          >
            <AdminIcon />
            Login Admin
          </Link>

        </div>
      </div>
    </footer>
  );
}