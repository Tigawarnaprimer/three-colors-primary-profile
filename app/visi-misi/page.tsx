import { supabase } from "@/lib/supabase";
export const dynamic = "force-dynamic";
type NilaiPerusahaan = {
  id: number;
  nomor: string;
  judul: string;
  deskripsi: string;
};

type VisiMisiData = {
  visi: string;
  visi_deskripsi: string;
  misi: string;
  misi_deskripsi: string;
};

async function getVisiMisi(): Promise<{
  visiMisi: VisiMisiData | null;
  nilaiPerusahaan: NilaiPerusahaan[];
}> {
  const [
    { data: visiMisiData, error: visiMisiError },
    { data: nilaiData, error: nilaiError },
  ] = await Promise.all([
    supabase
      .from("visi_misi")
      .select(
        "id, visi, visi_deskripsi, misi, misi_deskripsi, updated_at"
      )
      .limit(1)
      .maybeSingle(),

    supabase
      .from("nilai_perusahaan")
      .select("id, nomor, judul, deskripsi")
      .order("id", { ascending: true }),
  ]);

  if (visiMisiError) {
    console.error(
      "Gagal mengambil data visi & misi:",
      visiMisiError
    );
  }

  if (nilaiError) {
    console.error(
      "Gagal mengambil data nilai perusahaan:",
      nilaiError
    );
  }

  return {
    visiMisi: visiMisiData
      ? {
          visi: visiMisiData.visi || "",
          visi_deskripsi:
            visiMisiData.visi_deskripsi || "",
          misi: visiMisiData.misi || "",
          misi_deskripsi:
            visiMisiData.misi_deskripsi || "",
        }
      : null,

    nilaiPerusahaan: nilaiData || [],
  };
}

export default async function VisiMisi() {
  const { visiMisi, nilaiPerusahaan } =
    await getVisiMisi();

  return (
    <main className="pt-20 bg-gray-50">

      
{/* ================= HERO ================= */}
<section className="relative overflow-hidden bg-white">

  {/* BACKGROUND IMAGE */}
  <div
    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style={{
      backgroundImage: "url('/images/bg.jpg')",
    }}
  />

  {/* CONTENT */}
  <div className="relative mx-auto max-w-6xl px-6 py-24 lg:px-8 md:py-28">
    <div className="max-w-4xl">

      {/* LABEL */}
      <div className="flex items-center gap-4">
        <span className="h-[3px] w-16 bg-yellow-400" />

        <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-400 md:text-base">
          Visi &amp; Misi
        </p>
      </div>

      {/* HEADING */}
      <h1 className="mt-7 max-w-5xl text-4xl font-bold leading-[1.08] tracking-tight text-white md:text-5xl lg:text-6xl">
        Visi &amp; Misi PT Tiga Warna Primer
      </h1>

      {/* DESCRIPTION */}
      <p className="mt-7 max-w-3xl text-base leading-8 text-white md:text-lg lg:text-xl">
        Visi dan misi PT Tiga Warna Primer sebagai landasan
        dalam memberikan produk dan solusi terbaik untuk
        mendukung kebutuhan industri tekstil.
      </p>

    </div>
  </div>
</section>


      {/* ================= VISI & MISI ================= */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* VISI */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm md:p-10">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-[100%] bg-blue-50" />

              <div className="relative">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-950">
                    <span className="text-lg font-bold text-yellow-400">
                      V
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                      Visi
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Arah perusahaan
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-2xl font-bold leading-tight text-blue-950 md:text-3xl">
                    {visiMisi?.visi || "Visi belum tersedia."}
                  </h2>

                  <div className="mt-5 h-1 w-10 rounded-full bg-yellow-400" />

                  <p className="mt-5 leading-7 text-gray-600">
                    {visiMisi?.visi_deskripsi ||
                      "Deskripsi visi belum tersedia."}
                  </p>
                </div>
              </div>
            </div>

            {/* MISI */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm md:p-10">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-[100%] bg-yellow-50" />

              <div className="relative">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-700">
                    <span className="text-lg font-bold text-white">
                      M
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                      Misi
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Komitmen perusahaan
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-2xl font-bold leading-tight text-blue-950 md:text-3xl">
                    {visiMisi?.misi || "Misi belum tersedia."}
                  </h2>

                  <div className="mt-5 h-1 w-10 rounded-full bg-yellow-400" />

                  <p className="mt-5 leading-7 text-gray-600">
                    {visiMisi?.misi_deskripsi ||
                      "Deskripsi misi belum tersedia."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= NILAI PERUSAHAAN ================= */}
      <section className="pb-16 md:pb-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-8 md:mb-10">
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-10 bg-blue-700" />

              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                Nilai Perusahaan
              </p>
            </div>

            <h2 className="mt-4 text-2xl font-bold text-blue-950 md:text-3xl">
              Prinsip yang menjadi dasar kami
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-gray-600">
              Nilai-nilai yang menjadi dasar dalam menjalankan
              aktivitas perusahaan dan membangun hubungan dengan
              pelanggan.
            </p>
          </div>

          {nilaiPerusahaan.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {nilaiPerusahaan.map((value) => (
                <div
                  key={value.id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-950">
                      <span className="text-sm font-bold text-yellow-400">
                        {value.nomor}
                      </span>
                    </div>

                    <span className="h-[2px] w-8 bg-yellow-400" />
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-blue-950">
                    {value.judul}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {value.deskripsi}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
              <p className="text-sm text-gray-500">
                Data nilai perusahaan belum tersedia.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ================= BOTTOM STATEMENT ================= */}
      <section className="pb-16 md:pb-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-blue-950 px-8 py-8 md:px-10 md:py-9">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-full bg-blue-900" />

            <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-yellow-400">
                  Komitmen Kami
                </p>

                <p className="mt-2 text-lg font-semibold text-white md:text-xl">
                  Kualitas, inovasi, dan keberlanjutan.
                </p>
              </div>

              <div className="text-sm text-blue-200">
                PT Tiga Warna Primer
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}