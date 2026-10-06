import { supabase } from "@/lib/supabase";

async function getContact() {
  const { data, error } = await supabase
    .from("kontak")
    .select(
      "whatsapp, email, alamat, jam_weekday, jam_saturday, google_maps_url, google_maps_embed"
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
          HERO
      ===================================================== */}
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
              Hubungi PT Tiga Warna Primer untuk mendapatkan informasi produk,
              konsultasi kebutuhan industri tekstil, maupun informasi lainnya.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT
      ===================================================== */}
      <section className="bg-gray-50 py-12 md:py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            {/* =================================================
                INFORMASI KONTAK
            ================================================= */}
            <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm md:p-8">
              <div className="mb-6">
                <div className="mb-4 h-1 w-10 rounded-full bg-yellow-400" />

                <h2 className="text-2xl font-bold text-blue-950 md:text-3xl">
                  Informasi Kontak
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Silakan hubungi kami melalui informasi kontak berikut.
                </p>
              </div>

              <div className="divide-y divide-gray-100">
                {/* WhatsApp */}
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 py-4 first:pt-0"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600 transition group-hover:bg-green-100">
                    <WhatsAppIcon />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-gray-500">
                      WhatsApp Konsultasi
                    </p>

                    <p className="mt-1 font-semibold text-blue-950 group-hover:text-blue-700">
                      {whatsappDisplay}
                    </p>
                  </div>

                  <span className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-blue-700">
                    →
                  </span>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${contact.email}`}
                  className="group flex items-center gap-4 py-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <MailIcon />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Email</p>

                    <p className="mt-1 break-all font-semibold text-blue-950 group-hover:text-blue-700">
                      {contact.email}
                    </p>
                  </div>

                  <span className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-blue-700">
                    →
                  </span>
                </a>

                {/* Alamat */}
                <div className="flex items-start gap-4 py-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
                    <LocationIcon />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Alamat Kantor
                    </p>

                    <p className="mt-1 font-semibold leading-6 text-blue-950">
                      {contact.alamat}
                    </p>
                  </div>
                </div>

                {/* Jam */}
                {/* Jam */}
<div className="flex items-start gap-4 py-4 last:pb-0">
  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
    <ClockIcon />
  </div>

  <div>
    <p className="text-sm text-gray-500">
      Jam Operasional
    </p>

    <p className="mt-1 font-semibold leading-6 text-blue-950">
      {contact.jam_weekday}
    </p>

    <p className="font-semibold leading-6 text-blue-950">
      {contact.jam_saturday}
    </p>
  </div>
</div>
              </div>
            </div>

            {/* =================================================
                KONSULTASI
            ================================================= */}
            <div className="relative overflow-hidden rounded-2xl bg-blue-950 p-7 md:p-8">
              {/* Decorative background */}
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-800/40 blur-2xl" />

              <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-blue-700/20 blur-2xl" />

              <div className="absolute right-[-100px] top-20 h-72 w-72 rounded-full border border-blue-400/10" />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <div className="mb-4 h-1 w-10 rounded-full bg-yellow-400" />

                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-yellow-400">
                      Konsultasi
                    </p>

                    <h2 className="mt-3 text-3xl font-bold leading-tight text-white md:text-[34px]">
                      Butuh Informasi
                      <br />
                      <span className="text-yellow-400">
                        Produk?
                      </span>
                    </h2>
                  </div>

                  {/* WhatsApp besar */}
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-green-500 shadow-lg shadow-green-950/30 md:h-24 md:w-24">
                    <WhatsAppIcon className="h-11 w-11 text-white md:h-14 md:w-14" />
                  </div>
                </div>

                {/* Deskripsi */}
                <p className="mt-4 max-w-lg text-sm leading-6 text-blue-100 md:text-base">
                  Konsultasikan kebutuhan produk tekstil Anda bersama tim
                  PT Tiga Warna Primer melalui WhatsApp.
                </p>

                {/* Benefits */}
                <div className="mt-6 grid grid-cols-3 divide-x divide-blue-400/20">
                  <div className="px-2 text-center first:pl-0">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-blue-800 text-white">
                      <ChatIcon />
                    </div>

                    <p className="mt-2 text-xs font-semibold leading-4 text-white">
                      Respon
                      <br />
                      Cepat
                    </p>
                  </div>

                  <div className="px-2 text-center">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-blue-800 text-white">
                      <ShieldIcon />
                    </div>

                    <p className="mt-2 text-xs font-semibold leading-4 text-white">
                      Konsultasi
                      <br />
                      Gratis
                    </p>
                  </div>

                  <div className="px-2 text-center last:pr-0">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-blue-800 text-white">
                      <TeamIcon />
                    </div>

                    <p className="mt-2 text-xs font-semibold leading-4 text-white">
                      Tim
                      <br />
                      Profesional
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex w-full items-center gap-3 rounded-xl bg-green-500 px-5 py-3.5 font-semibold text-white shadow-lg transition hover:bg-green-600"
                >
                  <WhatsAppIcon className="h-6 w-6" />

                  <span>WhatsApp Konsultasi</span>

                  <span className="ml-auto text-xl">
                    →
                  </span>
                </a>

                {/* Nomor */}
                <div className="mt-3 flex items-center gap-2 text-sm text-blue-200">
                  <WhatsAppIcon className="h-4 w-4 text-green-400" />

                  {whatsappDisplay}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          LOKASI
      ===================================================== */}
      <section className="bg-white py-12 md:py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="h-1 w-10 rounded-full bg-yellow-400" />

                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
                  Lokasi
                </p>
              </div>

              <h2 className="text-2xl font-bold text-blue-950 md:text-3xl">
                Head Office PT Tiga Warna Primer
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Ruko Victoria Park, Karawaci, Kota Tangerang
              </p>
            </div>

            <a
              href={contact.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-700 px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-700 hover:text-white"
            >
              Buka di Google Maps
              <span>↗</span>
            </a>
          </div>

          {/* MAP */}
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
            <iframe
              src={contact.google_maps_embed}
              width="100%"
              height="400"
              style={{
                border: 0,
                pointerEvents: "none",
              }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Head Office PT Tiga Warna Primer"
            />

            <a
              href={contact.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-5 left-5 rounded-xl bg-white px-4 py-3 shadow-lg transition hover:shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <LocationIcon />
                </div>

                <div>
                  <p className="text-sm font-semibold text-blue-950">
                    Head Office
                  </p>

                  <p className="text-xs text-gray-500">
                    Klik untuk melihat lokasi
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}