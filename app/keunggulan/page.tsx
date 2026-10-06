import { supabase } from "@/lib/supabase";

type Advantage = {
  id: number;
  judul: string;
  deskripsi: string;
  status: string;
};

async function getAdvantages(): Promise<Advantage[]> {
  const { data, error } = await supabase
    .from("keunggulan")
    .select("id, judul, deskripsi, status")
    .eq("status", "Aktif")
    .order("id", { ascending: true });

  if (error) {
    console.error("Gagal mengambil data keunggulan:", error);
    return [];
  }

  return data ?? [];
}

export default async function Keunggulan() {
  const advantages = await getAdvantages();

  return (
    <main className="pt-20 bg-gray-50">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-blue-950">
        {/* Dekorasi */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-900/60" />

        <div className="absolute -bottom-40 -left-20 w-80 h-80 rounded-full bg-blue-900/40" />

        <div className="absolute top-20 right-20 w-3 h-3 rounded-full bg-yellow-400/70" />

        <div className="absolute bottom-16 right-40 w-2 h-2 rounded-full bg-blue-400/60" />

        <div className="relative max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-3xl">

            <div className="flex items-center gap-3">
              <span className="w-10 h-[2px] bg-yellow-400" />

              <p className="text-sm font-semibold tracking-[0.2em] uppercase text-yellow-400">
                Keunggulan Kami
              </p>
            </div>

            <h1 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Mengutamakan Kualitas
              <br />
              dan Kebutuhan Pelanggan
            </h1>

            <p className="mt-5 max-w-2xl text-base md:text-lg text-blue-100 leading-7">
              Kami berkomitmen menghadirkan produk dan pelayanan yang
              mendukung kebutuhan pelanggan di industri tekstil.
            </p>

          </div>
        </div>
      </section>

      {/* ================= KEUNGGULAN ================= */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">

          {/* HEADER */}
          <div className="mb-8 md:mb-10">

            <div className="flex items-center gap-3">
              <span className="w-10 h-[2px] bg-blue-700" />

              <p className="text-sm font-semibold tracking-[0.18em] uppercase text-blue-700">
                Keunggulan
              </p>
            </div>

            <h2 className="mt-4 text-2xl md:text-3xl font-bold text-blue-950">
              Nilai yang kami utamakan
            </h2>

            <p className="mt-3 max-w-2xl text-gray-600 leading-7">
              Kami berusaha memberikan produk dan pelayanan yang sesuai
              dengan kebutuhan pelanggan di industri tekstil.
            </p>

          </div>

          {/* ================= ADVANTAGES GRID ================= */}
          {advantages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
              <p className="text-sm font-semibold text-gray-500">
                Belum ada keunggulan yang ditampilkan.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

              {advantages.map((item, index) => (
                <div
                  key={item.id}
                  className="group relative bg-white border border-gray-200 rounded-2xl p-7 shadow-sm hover:bg-blue-950 hover:border-blue-950 hover:shadow-md transition-all duration-300"
                >

                  {/* NUMBER */}
                  <div className="flex items-center justify-between">
                   <span className="text-4xl font-bold text-blue-100 group-hover:text-yellow-400 transition-colors duration-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="w-8 h-[2px] bg-yellow-400 group-hover:w-12 transition-all duration-300" />
                  </div>

                  {/* CONTENT */}
                  <div className="mt-7">

                    <h3 className="text-xl font-bold text-blue-950 group-hover:text-white transition-colors duration-300">
                      {item.judul}
                    </h3>

                    <p className="mt-3 text-sm text-gray-600 group-hover:text-blue-100 leading-6 transition-colors duration-300">
                      {item.deskripsi}
                    </p>

                  </div>

                  {/* ACCENT */}
                  <div className="mt-7 w-10 h-1 bg-yellow-400 group-hover:w-16 transition-all duration-300" />

                </div>
              ))}

            </div>
          )}

          {/* ================= KOMITMEN ================= */}
          <div className="mt-7 relative overflow-hidden bg-blue-950 rounded-2xl px-7 py-7 md:px-9">

            {/* Background decoration */}
            <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-blue-900/70" />

            <div className="absolute -left-10 -bottom-16 w-32 h-32 rounded-full bg-blue-900/40" />

            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              <div>

                <p className="text-sm font-semibold tracking-[0.15em] uppercase text-yellow-400">
                  Komitmen Kami
                </p>

                <p className="mt-2 text-white font-semibold leading-6">
                  Membangun kualitas melalui produk, pelayanan, dan hubungan
                  yang baik dengan pelanggan.
                </p>

              </div>

              {/* THREE COLOR DOTS */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="w-3 h-3 rounded-full bg-blue-700" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-red-500" />
              </div>

            </div>
          </div>

        </div>
      </section>

    </main>
  );
}