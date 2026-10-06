import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <p className="text-sm font-semibold tracking-[0.2em] uppercase text-blue-700">
          Halaman Tidak Ditemukan
        </p>

        <h1 className="mt-4 text-6xl md:text-7xl font-bold text-blue-950">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-bold text-blue-950">
          Halaman yang Anda cari tidak tersedia
        </h2>

        <p className="mt-3 text-gray-600 leading-7">
          Halaman mungkin telah dipindahkan atau alamat yang Anda masukkan
          tidak sesuai.
        </p>

        <Link
          href="/"
          className="inline-flex mt-7 items-center justify-center rounded-lg bg-blue-700 hover:bg-blue-800 px-6 py-3 text-sm font-semibold text-white transition"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}