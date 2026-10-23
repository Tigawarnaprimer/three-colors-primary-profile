import { supabase } from "@/lib/supabase";
export const dynamic = "force-dynamic";
type GalleryItem = {
  id: number;
  judul: string;
  deskripsi: string;
  gambar_url: string;
  status: "Aktif" | "Nonaktif";
};

async function getGallery() {
  const { data, error } = await supabase
    .from("galeri")
    .select("id, judul, deskripsi, gambar_url, status")
    .eq("status", "Aktif")
    .order("id", { ascending: true });

  if (error) {
    console.error("Gagal mengambil data galeri:", error);
    return [];
  }

  return (data ?? []) as GalleryItem[];
}

export default async function GaleriPage() {
  const gallery = await getGallery();

  return (
    <main className="min-h-screen bg-white">
      
{/* ================= HERO GALERI ================= */}
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
          Galeri
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
        Mengenal Lebih Dekat
        <span className="block text-white">
          PT Tiga Warna Primer
        </span>
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
        Dokumentasi aktivitas, produk, dan kegiatan PT Tiga Warna Primer
        dalam mendukung kebutuhan industri tekstil.
      </p>

    </div>
  </div>
</section>


      {/* ================= GALERI ================= */}
      <section className="py-20 md:py-24">

        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          {/* SECTION HEADER */}
          <div className="mb-12 max-w-2xl">

            <h2 className="text-3xl font-bold text-blue-950 md:text-4xl">
              Aktivitas dan Produk
            </h2>

            <p className="mt-4 leading-7 text-gray-500">
              Lihat berbagai aktivitas dan produk PT Tiga Warna Primer.
            </p>

          </div>


          {/* ================= DATA GALERI ================= */}

          {gallery.length === 0 ? (

            <div
              className="
                rounded-2xl
                border
                border-gray-100
                bg-white
                px-6
                py-20
                text-center
                shadow-[0_8px_30px_rgba(15,23,42,0.06)]
              "
            >

              <p className="text-lg font-semibold text-gray-700">
                Belum ada dokumentasi galeri.
              </p>

              <p className="mt-2 text-sm text-gray-400">
                Dokumentasi akan ditampilkan setelah tersedia.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">

              {gallery.map((item) => (

                <article
                  key={item.id}
                  className="
                    group
                    overflow-hidden
                    rounded-2xl
                    border
                    border-gray-100
                    bg-white
                    shadow-[0_8px_25px_rgba(15,23,42,0.07)]
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-[0_14px_30px_rgba(15,23,42,0.10)]
                  "
                >

                  {/* IMAGE */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">

                    <img
                      src={item.gambar_url}
                      alt={item.judul}
                      className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-105
                      "
                    />

                  </div>


                  {/* CONTENT */}
                  <div className="p-6">

                    <h3 className="text-lg font-bold leading-snug text-blue-950">
                      {item.judul}
                    </h3>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500">
                      {item.deskripsi}
                    </p>

                  </div>

                </article>

              ))}

            </div>

          )}

        </div>
      </section>


      {/* ================= BOTTOM STATEMENT ================= */}
      <section className="pb-20 md:pb-24">

        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              border
              border-gray-100
              bg-gray-50
              px-7
              py-10
              shadow-[0_8px_25px_rgba(15,23,42,0.06)]
              md:px-12
              md:py-12
            "
          >

            {/* SHAPE KANAN */}
            <div
              className="
                pointer-events-none
                absolute
                -right-16
                -top-16
                h-48
                w-48
                rounded-full
                border
                border-blue-100
              "
            />

            {/* SHAPE KIRI */}
            <div
              className="
                pointer-events-none
                absolute
                -bottom-10
                -left-10
                h-32
                w-32
                rotate-45
                rounded-2xl
                border
                border-yellow-100
              "
            />

            {/* CONTENT */}
            <div className="relative max-w-3xl">

              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                PT Tiga Warna Primer
              </p>

              <h2 className="mt-3 text-2xl font-bold leading-tight text-blue-950 md:text-3xl">
                Menciptakan Warna,
                <br className="hidden md:block" />
                Mendefinisikan Kualitas.
              </h2>

              <p className="mt-4 leading-7 text-gray-500">
                Kami terus berupaya memberikan produk dan solusi
                yang sesuai dengan kebutuhan industri tekstil
                melalui kualitas dan konsistensi.
              </p>

              {/* COLOR DOTS */}
              <div className="mt-6 flex items-center gap-2">

                <span className="h-3 w-3 rounded-full bg-red-500 shadow-sm" />

                <span className="h-3 w-3 rounded-full bg-blue-700 shadow-sm" />

                <span className="h-3 w-3 rounded-full bg-yellow-400 shadow-sm" />

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}