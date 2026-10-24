import { supabase } from "@/lib/supabase";
export const dynamic = "force-dynamic";
type TentangKami = {
  id: number;
  profil_judul: string | null;
  profil_deskripsi_1: string | null;
  profil_deskripsi_2: string | null;
  focus_judul: string | null;
  focus_deskripsi: string | null;
  focus_quality_judul: string | null;
  focus_quality_deskripsi: string | null;
  focus_solution_judul: string | null;
  focus_solution_deskripsi: string | null;
  video_url: string | null;
};

export default async function TentangKami() {
  const { data, error } = await supabase
    .from("tentang_kami")
    .select(`
      id,
      profil_judul,
      profil_deskripsi_1,
      profil_deskripsi_2,
      focus_judul,
      focus_deskripsi,
      focus_quality_judul,
      focus_quality_deskripsi,
      focus_solution_judul,
      focus_solution_deskripsi,
      video_url
    `)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Gagal mengambil data Tentang Kami:", error);
  }

  /*
   * Jika data belum tersedia di database,
   * jangan menampilkan data dummy.
   */
  const tentangKami: TentangKami | null = data;

  return (
    <main className="pt-20 bg-gray-50">

     
{/* =====================================================
    HERO
====================================================== */}

<section className="relative overflow-hidden bg-white">

  {/* BACKGROUND IMAGE */}
  <div
    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style={{
      backgroundImage: "url('/images/bg.jpg')",
    }}
  />

  {/* CONTENT */}
  <div
    className="
      relative
      mx-auto
      max-w-6xl
      px-6
      py-24
      lg:px-8
      md:py-28
    "
  >
    <div className="max-w-4xl">

      {/* LABEL */}
      <div className="flex items-center gap-4">
        <span className="h-[3px] w-16 bg-yellow-400" />

        <p
          className="
            text-sm
            font-bold
            uppercase
            tracking-[0.25em]
            text-yellow-400
            md:text-base
          "
        >
          Tentang Kami
        </p>
      </div>

      {/* HEADING */}
      <h1
        className="
          mt-7
          max-w-5xl
          text-4xl
          font-bold
          leading-[1.08]
          tracking-tight
          text-white
          md:text-5xl
          lg:text-6xl
        "
      >
        Mengenal PT Tiga Warna Primer
      </h1>

      {/* DESCRIPTION */}
      <p
        className="
          mt-7
          max-w-3xl
          text-base
          leading-8
          text-white
          md:text-lg
          lg:text-xl
        "
      >
        Perusahaan bahan kimia dan pewarna tekstil yang
        menghadirkan solusi untuk mendukung kebutuhan
        industri tekstil.
      </p>

    </div>
  </div>
</section>


      {/* =====================================================
          TENTANG PERUSAHAAN
      ====================================================== */}

      {tentangKami && (
        <section className="py-16 md:py-20">

          <div className="max-w-6xl mx-auto px-6 lg:px-8">

            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-stretch">

              {/* ================= PROFIL ================= */}

              <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100">

                <div className="flex items-center gap-3 mb-6">

                  <span className="w-10 h-[2px] bg-blue-700" />

                  <p className="text-sm font-semibold tracking-[0.15em] uppercase text-blue-700">
                    Profil Perusahaan
                  </p>

                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-blue-950 leading-tight">
                  {tentangKami.profil_judul}
                </h2>

                <p className="mt-6 text-gray-600 leading-7">
                  {tentangKami.profil_deskripsi_1}
                </p>

                <p className="mt-4 text-gray-600 leading-7">
                  {tentangKami.profil_deskripsi_2}
                </p>

              </div>

              {/* ================= OUR FOCUS ================= */}

              <div className="relative">

                <div className="h-full min-h-[360px] bg-blue-950 rounded-2xl p-8 md:p-10 flex flex-col justify-center overflow-hidden">

                  <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-blue-900" />

                  <div className="relative">

                    <div className="w-12 h-1 bg-yellow-400 mb-7" />

                    <p className="text-sm font-semibold tracking-[0.15em] uppercase text-yellow-400">
                      Our Focus
                    </p>

                    <h2 className="mt-3 text-3xl font-bold text-white leading-tight">
                      {tentangKami.focus_judul?.includes(" & ") ? (
                        <>
                          {tentangKami.focus_judul.split(" & ")[0]}
                          <br />
                          & {tentangKami.focus_judul.split(" & ")[1]}
                        </>
                      ) : (
                        tentangKami.focus_judul
                      )}
                    </h2>

                    <p className="mt-5 text-blue-100 leading-7">
                      {tentangKami.focus_deskripsi}
                    </p>

                    <div className="mt-7 grid grid-cols-2 gap-3">

                      {/* Quality */}
                      <div className="bg-white/10 rounded-xl p-4 border border-white/10">

                        <p className="text-yellow-400 font-bold text-xl">
                          {tentangKami.focus_quality_judul}
                        </p>

                        <p className="mt-1 text-sm text-blue-100 leading-5">
                          {tentangKami.focus_quality_deskripsi}
                        </p>

                      </div>

                      {/* Solution */}
                      <div className="bg-white/10 rounded-xl p-4 border border-white/10">

                        <p className="text-yellow-400 font-bold text-xl">
                          {tentangKami.focus_solution_judul}
                        </p>

                        <p className="mt-1 text-sm text-blue-100 leading-5">
                          {tentangKami.focus_solution_deskripsi}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

                {/* Aksen */}
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-red-500 rounded-full" />

                <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full" />

              </div>

            </div>

          </div>

        </section>
      )}

      {/* =====================================================
          VIDEO
      ====================================================== */}

      {tentangKami?.video_url && (
        <section className="pb-16 md:pb-20">

          <div className="max-w-6xl mx-auto px-6 lg:px-8">

            <div className="bg-blue-950 rounded-2xl px-7 py-8 md:px-10 md:py-10">

              {/* POSISI VIDEO TETAP SAMA */}

              <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-8 md:gap-10 items-center">

                {/* Teks */}
                <div>

                  <p className="text-sm font-semibold tracking-[0.15em] uppercase text-yellow-400">
                    PT Tiga Warna Primer
                  </p>

                  <h2 className="mt-3 text-2xl md:text-3xl font-bold text-white leading-tight">
                    Kualitas dan solusi untuk kebutuhan tekstil
                  </h2>

                  <p className="mt-4 text-blue-100 leading-7">
                    Berkomitmen menghadirkan produk yang mendukung
                    kebutuhan proses produksi industri tekstil.
                  </p>

                </div>

                {/* VIDEO */}
                <div className="w-full">

                  <div className="overflow-hidden rounded-xl bg-black shadow-lg">

                    <video
                      className="w-full aspect-video object-cover"
                      controls
                      playsInline
                      preload="metadata"
                    >
                      <source
                        src={tentangKami.video_url}
                        type="video/mp4"
                      />

                      Browser Anda tidak mendukung pemutaran video.

                    </video>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>
      )}

    </main>
  );
}