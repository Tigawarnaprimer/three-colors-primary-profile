import { supabase } from "@/lib/supabase";
export const dynamic = "force-dynamic";
async function getContact() {
  const { data, error } = await supabase
    .from("kontak")
    
.select(
  "whatsapp, telepon_kantor, email, alamat, jam_weekday, jam_saturday, google_maps_url, google_maps_embed"
)

    .limit(1)
    .single();

  if (error) {
    console.error("Gagal mengambil data kontak:", error);
    return null;
  }

  return data;
}

function formatWhatsapp(number: string) {
  const digits = number.replace(/\D/g, "");

  if (digits.startsWith("62") && digits.length >= 11) {
    const local = digits.slice(2);

    return `+62 ${local.slice(0, 3)}-${local.slice(3, 7)}-${local.slice(7)}`;
  }

  return number;
}

const WhatsAppIcon = ({ className = "h-6 w-6" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.57-.01-.198 0-.52.075-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12.004 2C6.478 2 2 6.477 2 12c0 1.76.46 3.412 1.265 4.85L2 22l5.31-1.245A9.96 9.96 0 0 0 12.004 22C17.522 22 22 17.523 22 12S17.522 2 12.004 2zm0 18.2a8.15 8.15 0 0 1-4.16-1.14l-.298-.177-3.153.738.67-3.075-.194-.316A8.15 8.15 0 1 1 12.004 20.2z" />
  </svg>
);


const PhoneIcon = ({ className = "h-5 w-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 4h3l2 5-2 1.5a15 15 0 0 0 5.5 5.5L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"
    />
  </svg>
);


const MailIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8l9 6 9-6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
    />
  </svg>
);

const LocationIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21s7-5.2 7-11a7 7 0 10-14 0c0 5.8 7 11 7 11z"
    />
    <circle cx="12" cy="10" r="2.2" />
  </svg>
);

const ClockIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="9" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 7v5l3 2"
    />
  </svg>
);

const ChatIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 10h8M8 14h5M21 12a9 9 0 11-4.1-7.6L21 3l-1.1 4.1A8.96 8.96 0 0121 12z"
    />
  </svg>
);

const ShieldIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3l7 3v5c0 4.5-3 7.5-7 10-4-2.5-7-5.5-7-10V6l7-3z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.5 12l1.7 1.7 3.5-3.5"
    />
  </svg>
);

const TeamIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 12l-2 2a3 3 0 004 4l3-3"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 12l2-2a3 3 0 00-4-4l-3 3"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 15l6-6"
    />
  </svg>
);

export default async function Kontak() {
  const contact = await getContact();

  /*
   * Jika data Supabase belum tersedia, halaman tetap aman.
   * Namun data utama tetap berasal dari database.
   */
  if (!contact) {
    return (
      <main className="min-h-screen bg-white pt-20">
        <section className="relative overflow-hidden bg-blue-950">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-800/30 blur-3xl" />
          <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-blue-700/20 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-6 py-14 md:py-16">
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-1 w-10 rounded-full bg-yellow-400" />

                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-400">
                  Kontak
                </p>
              </div>

              <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
                Hubungi <span className="text-yellow-400">Kami</span>
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-blue-100 md:text-lg">
                Hubungi PT Tiga Warna Primer untuk mendapatkan informasi
                produk, konsultasi kebutuhan industri tekstil, maupun informasi
                lainnya.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-12 md:py-14">
          <div className="mx-auto max-w-7xl px-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
              <h2 className="text-xl font-bold text-blue-950">
                Informasi kontak belum tersedia
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Silakan hubungi administrator untuk memperbarui informasi
                kontak.
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const whatsappNumber = contact.whatsapp.replace(/\D/g, "");

  const whatsappMessage = encodeURIComponent(
    "Halo PT Tiga Warna Primer, saya ingin berkonsultasi mengenai produk."
  );

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const whatsappDisplay = formatWhatsapp(contact.whatsapp);

  return (
    <main className="min-h-screen bg-white pt-20">
      
{/* =====================================================
    HERO KONTAK
===================================================== */}
<section className="relative overflow-hidden bg-white">

  {/* BACKGROUND IMAGE */}
  <div
    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style={{
      backgroundImage: "url('/images/bg.jpg')",
    }}
  />

  {/* CONTENT */}
  <div className="relative mx-auto max-w-7xl px-6 py-14 md:py-16">
    <div className="max-w-3xl">

      {/* LABEL */}
      <div className="mb-4 flex items-center gap-3">
        <span className="h-1 w-10 rounded-full bg-yellow-400" />

        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-400">
          Kontak
        </p>
      </div>

      {/* HEADING */}
      <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
        Hubungi <span className="text-yellow-400">Kami</span>
      </h1>

      {/* DESCRIPTION */}
      <p className="mt-4 max-w-2xl text-base leading-7 text-white md:text-lg">
        Hubungi PT Tiga Warna Primer untuk mendapatkan informasi produk,
        konsultasi kebutuhan industri tekstil, maupun informasi lainnya.
      </p>

    </div>
  </div>
</section>


      {/* =====================================================
          CONTACT
      ===================================================== */}
      
{/* ===================== INFORMASI KONTAK ===================== */}
<section className="bg-slate-50 py-14 md:py-20">
  <div className="mx-auto max-w-7xl px-5 sm:px-6">
    <div className="grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">

      {/* Informasi Kontak */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-7">
          <div className="mb-4 h-1 w-12 rounded-full bg-amber-400" />
          <h2 className="text-2xl font-bold tracking-tight text-blue-950 sm:text-3xl">
            Informasi Kontak
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
            Hubungi tim PT Tiga Warna Primer untuk informasi dan konsultasi produk.
          </p>
        </div>

        <div className="divide-y divide-slate-100">

          {/* WhatsApp */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 py-4 first:pt-0"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600 transition-colors group-hover:bg-green-100">
              <WhatsAppIcon />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-500">
                WhatsApp Konsultasi
              </p>
              <p className="mt-1 break-words text-sm font-semibold text-blue-950 transition-colors group-hover:text-blue-700">
                {whatsappDisplay}
              </p>
            </div>
            <span className="text-slate-400 transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>

          {/* Telepon Kantor */}
          {contact.telepon_kantor?.trim() && (
            <a
              href={`tel:${contact.telepon_kantor.replace(/[^\d+]/g, "")}`}
              className="group flex items-center gap-4 py-4"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-100">
                <PhoneIcon />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-500">
                  Telepon Kantor
                </p>
                <p className="mt-1 break-words text-sm font-semibold text-blue-950 transition-colors group-hover:text-blue-700">
                  {contact.telepon_kantor}
                </p>
              </div>
              <span className="text-slate-400 transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          )}

          {/* Email */}
          <a
            href={`mailto:${contact.email}`}
            className="group flex items-center gap-4 py-4"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <MailIcon />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-500">Email</p>
              <p className="mt-1 break-all text-sm font-semibold text-blue-950 transition-colors group-hover:text-blue-700">
                {contact.email}
              </p>
            </div>
            <span className="text-slate-400 transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>

          {/* Alamat */}
          <div className="flex items-start gap-4 py-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-50 text-amber-600">
              <LocationIcon />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-500">
                Alamat Kantor
              </p>
              <p className="mt-1 text-sm font-semibold leading-6 text-blue-950">
                {contact.alamat}
              </p>
            </div>
          </div>

          {/* Jam Operasional */}
          <div className="flex items-start gap-4 py-4 last:pb-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
              <ClockIcon />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-500">
                Jam Operasional
              </p>
              <p className="mt-1 text-sm font-semibold leading-6 text-blue-950">
                {contact.jam_weekday}
              </p>
              <p className="text-sm leading-6 text-slate-600">
                {contact.jam_saturday}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Kartu Konsultasi */}
      <div className="relative isolate overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-white to-blue-50 p-6 shadow-sm sm:p-8">

        {/* Ornamen dekoratif */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 -z-10 h-56 w-56 rounded-full border-[28px] border-blue-100/40"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-4 top-12 -z-10 h-24 w-24 rounded-full bg-amber-100/40 blur-2xl"
        />

        <div className="mb-6 h-1 w-12 rounded-full bg-amber-400" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
              Konsultasi
            </p>
            <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-blue-950 sm:text-3xl">
              Butuh Informasi
              <br />
              <span className="text-blue-700">Produk?</span>
            </h2>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600 sm:h-14 sm:w-14">
            <WhatsAppIcon className="h-7 w-7 sm:h-8 sm:w-8" />
          </div>
        </div>

        <p className="mt-4 text-sm leading-7 text-slate-600">
          Konsultasikan kebutuhan produk tekstil Anda bersama tim
          PT Tiga Warna Primer melalui WhatsApp.
        </p>

        {/* Keunggulan */}
        <div className="mt-7 grid grid-cols-3 divide-x divide-blue-100 border-y border-blue-100 py-5">
          <div className="px-2 text-center first:pl-0">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-700">
              <ChatIcon />
            </div>
            <p className="mt-2 text-xs font-semibold leading-5 text-slate-700">
              Respon Cepat
            </p>
          </div>

          <div className="px-2 text-center">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-700">
              <ShieldIcon />
            </div>
            <p className="mt-2 text-xs font-semibold leading-5 text-slate-700">
              Konsultasi Gratis
            </p>
          </div>

          <div className="px-2 text-center last:pr-0">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-700">
              <TeamIcon />
            </div>
            <p className="mt-2 text-xs font-semibold leading-5 text-slate-700">
              Tim Profesional
            </p>
          </div>
        </div>

        {/* Tombol WhatsApp */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex w-full items-center gap-3 rounded-xl bg-green-600 px-5 py-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-green-200"
        >
          <WhatsAppIcon className="h-5 w-5 shrink-0" />
          <span>WhatsApp Konsultasi</span>
          <span aria-hidden="true" className="ml-auto text-lg">
            →
          </span>
        </a>

        <p className="mt-3 text-center text-xs text-slate-500">
          Tim kami siap membantu kebutuhan informasi produk Anda.
        </p>
      </div>

    </div>
  </div>
</section>

{/* ===================== LOKASI KANTOR ===================== */}
<section className="bg-white py-14 md:py-20">
  <div className="mx-auto max-w-7xl px-5 sm:px-6">

    {/* Header Lokasi */}
    <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-3 flex items-center gap-3">
          <span className="h-1 w-10 rounded-full bg-amber-400" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
            Lokasi Kami
          </p>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-blue-950 sm:text-3xl">
          Head Office PT Tiga Warna Primer
        </h2>

        <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-slate-500">
          <LocationIcon />
          <span>Ruko Victoria Park, Karawaci, Kota Tangerang</span>
        </p>
      </div>

      <a
        href={contact.google_maps_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-fit shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-800 transition-colors hover:border-blue-800 hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-100"
      >
        Buka di Google Maps
        <span aria-hidden="true">↗</span>
      </a>
    </div>

    {/* Peta */}
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
      <iframe
        src={contact.google_maps_embed}
        width="100%"
        height="420"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        title="Lokasi Head Office PT Tiga Warna Primer"
        className="block w-full"
      />

      {/* Kartu informasi di atas peta */}
      <a
        href={contact.google_maps_url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-xl border border-slate-100 bg-white/95 p-4 shadow-lg backdrop-blur-sm transition-shadow hover:shadow-xl sm:bottom-5 sm:left-5 sm:right-auto sm:min-w-72"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
          <LocationIcon />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-blue-950">
            Head Office
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Ruko Victoria Park, Karawaci, Kota Tangerang
          </p>
        </div>

        <span aria-hidden="true" className="text-slate-400">
          ↗
        </span>
      </a>
    </div>

  </div>
</section>

    </main>
  );
}