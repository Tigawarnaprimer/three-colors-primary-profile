import { supabase } from "@/lib/supabase";

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

      <section className="relative overflow-hidden bg-blue-950">

        {/* ================= BACKGROUND SHAPES ================= */}

        {/* Glow / Circle kiri atas */}
        <div
          className="
            absolute
            -left-32
            -top-40
            h-[28rem]
            w-[28rem]
            rounded-full
            bg-blue-900/40
          "
        />

        {/* Circle kanan atas */}
        <div
          className="
            absolute
            -right-40
            -top-48
            h-[30rem]
            w-[30rem]
            rounded-full
            bg-blue-900/40
          "
        />

        {/* Circle kiri bawah */}
        <div
          className="
            absolute
            -bottom-48
            -left-32
            h-[32rem]
            w-[32rem]
            rounded-full
            bg-blue-900/30
          "
        />

        {/* ================= DOT PATTERN ================= */}

        <div
          className="
            absolute
            left-4
            top-4
            h-36
            w-36
            opacity-60
          "
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(37, 129, 255, 0.8) 2px, transparent 2px)",
            backgroundSize: "18px 18px",
          }}
        />

        <div
          className="
            absolute
            bottom-4
            right-4
            h-36
            w-36
            opacity-50
          "
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(37, 129, 255, 0.7) 2px, transparent 2px)",
            backgroundSize: "18px 18px",
          }}
        />

        {/* ================= FLOWING LINES ================= */}

        <svg
          className="
            pointer-events-none
            absolute
            -bottom-16
            left-0
            h-[360px]
            w-full
            opacity-60
          "
          viewBox="0 0 1440 360"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M-100 230 C300 380 650 380 1000 180 C1190 70 1330 30 1540 -50"
            stroke="#1687ff"
            strokeWidth="1.2"
          />

          <path
            d="M-100 245 C300 395 660 395 1010 195 C1200 85 1340 45 1540 -35"
            stroke="#1687ff"
            strokeWidth="1.2"
          />

          <path
            d="M-100 260 C300 410 670 410 1020 210 C1210 100 1350 60 1540 -20"
            stroke="#1687ff"
            strokeWidth="1.2"
          />

          <path
            d="M-100 275 C300 425 680 425 1030 225 C1220 115 1360 75 1540 -5"
            stroke="#1687ff"
            strokeWidth="1.2"
          />

          <path
            d="M-100 290 C300 440 690 440 1040 240 C1230 130 1370 90 1540 10"
            stroke="#1687ff"
            strokeWidth="1.2"
          />

          <path
            d="M-100 305 C300 455 700 455 1050 255 C1240 145 1380 105 1540 25"
            stroke="#1687ff"
            strokeWidth="1.2"
          />
        </svg>

        {/* ================= RIGHT FLOWING LINES ================= */}

        <svg
          className="
            pointer-events-none
            absolute
            right-0
            top-0
            h-full
            w-[45%]
            opacity-50
          "
          viewBox="0 0 650 700"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M700 -100 C520 80 530 230 400 340 C300 425 170 500 0 570"
            stroke="#1687ff"
            strokeWidth="1"
          />

          <path
            d="M720 -80 C540 100 550 250 420 360 C320 445 190 520 20 590"
            stroke="#1687ff"
            strokeWidth="1"
          />

          <path
            d="M740 -60 C560 120 570 270 440 380 C340 465 210 540 40 610"
            stroke="#1687ff"
            strokeWidth="1"
          />

          <path
            d="M760 -40 C580 140 590 290 460 400 C360 485 230 560 60 630"
            stroke="#1687ff"
            strokeWidth="1"
          />

          <path
            d="M780 -20 C600 160 610 310 480 420 C380 505 250 580 80 650"
            stroke="#1687ff"
            strokeWidth="1"
          />

          <path
            d="M800 0 C620 180 630 330 500 440 C400 525 270 600 100 670"
            stroke="#1687ff"
            strokeWidth="1"
          />
        </svg>

        {/* ================= CONTENT ================= */}

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

            {/* Label */}
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

            {/* Heading */}
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

            {/* Description */}
            <p
              className="
                mt-7
                max-w-3xl
                text-base
                leading-8
                text-blue-100
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