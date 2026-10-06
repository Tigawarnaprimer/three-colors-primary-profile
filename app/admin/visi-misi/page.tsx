"use client";

import { FormEvent, useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { supabase } from "@/lib/supabase";

type NilaiPerusahaan = {
  id: number;
  nomor: string;
  judul: string;
  deskripsi: string;
};

export default function AdminVisiMisi() {
  const [visiId, setVisiId] = useState<number | null>(null);

  const [visi, setVisi] = useState("");
  const [visiDeskripsi, setVisiDeskripsi] = useState("");

  const [misi, setMisi] = useState("");
  const [misiDeskripsi, setMisiDeskripsi] = useState("");

  const [nilaiPerusahaan, setNilaiPerusahaan] = useState<
    NilaiPerusahaan[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  /*
   * =========================================================
   * LOAD DATA
   * =========================================================
   */

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      /*
       * =========================
       * LOAD VISI & MISI
       * =========================
       */

      const {
        data: visiMisiData,
        error: visiMisiError,
      } = await supabase
        .from("visi_misi")
        .select(
          "id, visi, visi_deskripsi, misi, misi_deskripsi, updated_at"
        )
        .limit(1)
        .maybeSingle();

      if (visiMisiError) {
        throw visiMisiError;
      }

      if (visiMisiData) {
        setVisiId(visiMisiData.id);

        setVisi(visiMisiData.visi || "");
        setVisiDeskripsi(visiMisiData.visi_deskripsi || "");

        setMisi(visiMisiData.misi || "");
        setMisiDeskripsi(visiMisiData.misi_deskripsi || "");
      }

      /*
       * =========================
       * LOAD NILAI PERUSAHAAN
       * =========================
       */

      const {
        data: nilaiData,
        error: nilaiError,
      } = await supabase
        .from("nilai_perusahaan")
        .select("id, nomor, judul, deskripsi")
        .order("id", { ascending: true });

      if (nilaiError) {
        throw nilaiError;
      }

      setNilaiPerusahaan(nilaiData || []);
    } catch (error) {
      console.error("Gagal mengambil data:", error);

      setErrorMessage(
        "Data gagal dimuat. Periksa koneksi database dan struktur tabel Supabase."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * =========================================================
   * NILAI PERUSAHAAN
   * =========================================================
   */

  const updateNilai = (
    index: number,
    field: keyof NilaiPerusahaan,
    value: string
  ) => {
    const newNilai = [...nilaiPerusahaan];

    newNilai[index] = {
      ...newNilai[index],
      [field]: value,
    };

    setNilaiPerusahaan(newNilai);
  };

  const tambahNilai = () => {
    const nextNumber = String(nilaiPerusahaan.length + 1).padStart(
      2,
      "0"
    );

    setNilaiPerusahaan([
      ...nilaiPerusahaan,
      {
        id: Date.now(),
        nomor: nextNumber,
        judul: "",
        deskripsi: "",
      },
    ]);
  };

  const hapusNilai = (index: number) => {
    if (nilaiPerusahaan.length === 1) return;

    setNilaiPerusahaan(
      nilaiPerusahaan.filter((_, i) => i !== index)
    );
  };

  /*
   * =========================================================
   * SAVE
   * =========================================================
   */

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setSaving(true);
    setSaved(false);
    setErrorMessage("");

    try {
      /*
       * =========================
       * VALIDASI
       * =========================
       */

      if (!visiId) {
        throw new Error(
          "Data visi & misi belum ditemukan."
        );
      }

      /*
       * =========================
       * SIMPAN VISI & MISI
       * =========================
       */

      const { error: visiError } = await supabase
        .from("visi_misi")
        .update({
          visi: visi.trim(),
          visi_deskripsi: visiDeskripsi.trim(),
          misi: misi.trim(),
          misi_deskripsi: misiDeskripsi.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", visiId);

      if (visiError) {
        throw visiError;
      }

      /*
       * =========================
       * SIMPAN NILAI PERUSAHAAN
       * =========================
       */

      for (const item of nilaiPerusahaan) {
        /*
         * Data baru dari tombol
         * "Tambah Nilai"
         */
        if (item.id > 1000000000000) {
          const { data: insertedData, error: insertError } =
            await supabase
              .from("nilai_perusahaan")
              .insert({
                nomor: item.nomor.trim(),
                judul: item.judul.trim(),
                deskripsi: item.deskripsi.trim(),
              })
              .select("id, nomor, judul, deskripsi")
              .single();

          if (insertError) {
            throw insertError;
          }

          /*
           * Ganti ID sementara dengan ID
           * dari database.
           */
          if (insertedData) {
            setNilaiPerusahaan((current) =>
              current.map((nilai) =>
                nilai.id === item.id
                  ? insertedData
                  : nilai
              )
            );
          }
        } else {
          const { error: updateError } = await supabase
            .from("nilai_perusahaan")
            .update({
              nomor: item.nomor.trim(),
              judul: item.judul.trim(),
              deskripsi: item.deskripsi.trim(),
            })
            .eq("id", item.id);

          if (updateError) {
            throw updateError;
          }
        }
      }

      /*
       * =========================
       * RELOAD DATA
       * =========================
       */

      await loadData();

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (error) {
      console.error("Gagal menyimpan:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan perubahan."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <AdminSidebar />

        <div className="lg:ml-64">
          <header className="h-20 bg-white border-b border-gray-200">
            <div className="h-full px-6 lg:px-8 flex items-center">
              <div>
                <p className="text-xs font-bold tracking-[0.18em] text-blue-700 uppercase">
                  Admin Panel
                </p>

                <h1 className="mt-1 text-lg font-bold text-blue-950">
                  Kelola Visi & Misi
                </h1>
              </div>
            </div>
          </header>

          <div className="px-6 lg:px-8 py-12">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
              <p className="text-sm text-gray-500">
                Memuat data visi, misi, dan nilai perusahaan...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
   * =========================================================
   * PAGE
   * =========================================================
   */

  return (
    <main className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="lg:ml-64">
        {/* HEADER */}
        <header className="h-20 bg-white border-b border-gray-200">
          <div className="h-full px-6 lg:px-8 flex items-center">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-blue-700 uppercase">
                Admin Panel
              </p>

              <h1 className="mt-1 text-lg font-bold text-blue-950">
                Kelola Visi & Misi
              </h1>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <section className="px-6 lg:px-8 py-8 max-w-6xl">
          {/* PAGE TITLE */}
          <div className="mb-7">
            <p className="text-xs font-bold tracking-[0.18em] text-blue-700 uppercase">
              Informasi Website
            </p>

            <h2 className="mt-2 text-2xl md:text-3xl font-bold text-blue-950">
              Visi, Misi & Nilai Perusahaan
            </h2>

            <p className="mt-2 text-sm text-gray-500 max-w-2xl">
              Kelola visi, misi, dan nilai perusahaan PT Tiga
              Warna Primer yang ditampilkan pada website.
            </p>
          </div>

          {/* SUCCESS */}
          {saved && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
              <div className="w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                ✓
              </div>

              <div>
                <p className="text-sm font-semibold text-green-800">
                  Perubahan berhasil disimpan
                </p>

                <p className="text-xs text-green-700 mt-0.5">
                  Data telah diperbarui pada database.
                </p>
              </div>
            </div>
          )}

          {/* ERROR */}
          {errorMessage && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-semibold text-red-800">
                Gagal memproses data
              </p>

              <p className="text-xs text-red-700 mt-1">
                {errorMessage}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* ================================================= */}
            {/* VISI */}
            {/* ================================================= */}

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="px-6 md:px-8 py-5 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                    V
                  </div>

                  <div>
                    <h3 className="font-bold text-blue-950">
                      Visi
                    </h3>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Pernyataan visi perusahaan
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                {/* ISI VISI */}
                <div>
                  <label
                    htmlFor="visi"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Isi Visi
                  </label>

                  <textarea
                    id="visi"
                    value={visi}
                    onChange={(e) =>
                      setVisi(e.target.value)
                    }
                    rows={4}
                    placeholder="Masukkan visi perusahaan..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 transition"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Gunakan kalimat yang singkat, jelas, dan
                    menggambarkan arah perusahaan.
                  </p>
                </div>

                {/* DESKRIPSI VISI */}
                <div>
                  <label
                    htmlFor="visi_deskripsi"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Deskripsi Visi
                  </label>

                  <textarea
                    id="visi_deskripsi"
                    value={visiDeskripsi}
                    onChange={(e) =>
                      setVisiDeskripsi(e.target.value)
                    }
                    rows={4}
                    placeholder="Masukkan deskripsi visi perusahaan..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
              </div>
            </div>

            {/* ================================================= */}
            {/* MISI */}
            {/* ================================================= */}

            <div className="mt-6 bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="px-6 md:px-8 py-5 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center font-bold">
                    M
                  </div>

                  <div>
                    <h3 className="font-bold text-blue-950">
                      Misi
                    </h3>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Pernyataan misi perusahaan
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                {/* ISI MISI */}
                <div>
                  <label
                    htmlFor="misi"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Isi Misi
                  </label>

                  <textarea
                    id="misi"
                    value={misi}
                    onChange={(e) =>
                      setMisi(e.target.value)
                    }
                    rows={4}
                    placeholder="Masukkan misi perusahaan..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 transition"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Masukkan pernyataan utama misi perusahaan.
                  </p>
                </div>

                {/* DESKRIPSI MISI */}
                <div>
                  <label
                    htmlFor="misi_deskripsi"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Deskripsi Misi
                  </label>

                  <textarea
                    id="misi_deskripsi"
                    value={misiDeskripsi}
                    onChange={(e) =>
                      setMisiDeskripsi(e.target.value)
                    }
                    rows={5}
                    placeholder="Masukkan deskripsi misi perusahaan..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
              </div>
            </div>

            {/* ================================================= */}
            {/* NILAI PERUSAHAAN */}
            {/* ================================================= */}

            <div className="mt-6 bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="px-6 md:px-8 py-5 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center font-bold">
                      N
                    </div>

                    <div>
                      <h3 className="font-bold text-blue-950">
                        Nilai Perusahaan
                      </h3>

                      <p className="text-xs text-gray-500 mt-0.5">
                        Prinsip yang menjadi dasar perusahaan
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={tambahNilai}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-semibold transition"
                  >
                    <span className="text-base leading-none">
                      +
                    </span>

                    Tambah Nilai
                  </button>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="space-y-5">
                  {nilaiPerusahaan.map((item, index) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-xl p-5"
                    >
                      <div className="flex items-start gap-4">
                        {/* NOMOR */}
                        <div className="shrink-0">
                          <label className="block text-xs font-semibold text-gray-500 mb-2">
                            Nomor
                          </label>

                          <input
                            type="text"
                            value={item.nomor}
                            onChange={(e) =>
                              updateNilai(
                                index,
                                "nomor",
                                e.target.value
                              )
                            }
                            className="w-16 px-3 py-2.5 border border-gray-300 rounded-lg outline-none text-center font-semibold text-blue-950 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>

                        {/* JUDUL + DESKRIPSI */}
                        <div className="flex-1 space-y-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-2">
                              Judul
                            </label>

                            <input
                              type="text"
                              value={item.judul}
                              onChange={(e) =>
                                updateNilai(
                                  index,
                                  "judul",
                                  e.target.value
                                )
                              }
                              placeholder="Contoh: Inovasi"
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-2">
                              Deskripsi
                            </label>

                            <textarea
                              value={item.deskripsi}
                              onChange={(e) =>
                                updateNilai(
                                  index,
                                  "deskripsi",
                                  e.target.value
                                )
                              }
                              rows={3}
                              placeholder="Masukkan deskripsi nilai perusahaan..."
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                            />
                          </div>
                        </div>

                        {/* HAPUS */}
                        <button
                          type="button"
                          onClick={() => hapusNilai(index)}
                          disabled={nilaiPerusahaan.length === 1}
                          className="mt-7 px-2 text-sm font-medium text-red-500 hover:text-red-700 disabled:text-gray-300 disabled:cursor-not-allowed transition"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-5 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    Total {nilaiPerusahaan.length} nilai
                    perusahaan.
                  </p>
                </div>
              </div>
            </div>

            {/* ================================================= */}
            {/* SAVE */}
            {/* ================================================= */}

            <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-blue-950">
                  Simpan perubahan
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Perubahan visi, misi, dan nilai perusahaan
                  akan disimpan ke database.
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg text-sm font-semibold transition"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    d="M5 4h12l2 2v14H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M8 4v5h8V4M8 20v-6h8v6"
                    strokeLinejoin="round"
                  />
                </svg>

                {saving
                  ? "Menyimpan..."
                  : "Simpan Perubahan"}
              </button>
            </div>
          </form>

          {/* ================================================= */}
          {/* PREVIEW */}
          {/* ================================================= */}

          <div className="mt-10">
            <div className="mb-4">
              <p className="text-xs font-bold tracking-[0.18em] text-blue-700 uppercase">
                Preview
              </p>

              <h3 className="mt-1 text-xl font-bold text-blue-950">
                Tampilan Visi, Misi & Nilai Perusahaan
              </h3>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              {/* VISI + MISI */}
              <div className="grid lg:grid-cols-2">
                {/* VISI */}
                <div className="relative overflow-hidden bg-blue-950 p-7 md:p-9">
                  <div className="absolute -right-20 -top-20 w-52 h-52 rounded-full bg-blue-900/60" />

                  <div className="relative">
                    <p className="text-xs font-bold tracking-[0.2em] text-yellow-400 uppercase">
                      Visi
                    </p>

                    <h4 className="mt-3 text-2xl md:text-3xl font-bold text-white">
                      {visi || "Visi Kami"}
                    </h4>

                    <div className="flex items-center gap-1 mt-5">
                      <span className="w-8 h-1 rounded-full bg-red-500" />
                      <span className="w-8 h-1 rounded-full bg-yellow-400" />
                      <span className="w-8 h-1 rounded-full bg-blue-400" />
                    </div>

                    <p className="mt-6 text-blue-100 leading-7 text-sm md:text-base">
                      {visiDeskripsi ||
                        "Deskripsi visi belum diisi."}
                    </p>
                  </div>
                </div>

                {/* MISI */}
                <div className="p-7 md:p-9">
                  <p className="text-xs font-bold tracking-[0.2em] text-blue-700 uppercase">
                    Misi
                  </p>

                  <h4 className="mt-3 text-2xl md:text-3xl font-bold text-blue-950">
                    {misi || "Misi Kami"}
                  </h4>

                  <div className="flex items-center gap-1 mt-5">
                    <span className="w-8 h-1 rounded-full bg-red-500" />
                    <span className="w-8 h-1 rounded-full bg-yellow-400" />
                    <span className="w-8 h-1 rounded-full bg-blue-700" />
                  </div>

                  <p className="mt-6 text-sm text-gray-600 leading-7">
                    {misiDeskripsi ||
                      "Deskripsi misi belum diisi."}
                  </p>
                </div>
              </div>

              {/* NILAI PERUSAHAAN */}
              <div className="border-t border-gray-200 p-7 md:p-9">
                <div className="mb-6">
                  <p className="text-xs font-bold tracking-[0.2em] text-blue-700 uppercase">
                    Nilai Perusahaan
                  </p>

                  <h4 className="mt-2 text-2xl md:text-3xl font-bold text-blue-950">
                    Prinsip yang menjadi dasar kami
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {nilaiPerusahaan.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-xl p-5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-blue-950 flex items-center justify-center">
                          <span className="text-sm font-bold text-yellow-400">
                            {item.nomor}
                          </span>
                        </div>

                        <span className="w-8 h-[2px] bg-yellow-400" />
                      </div>

                      <h5 className="mt-5 text-lg font-bold text-blue-950">
                        {item.judul ||
                          "Judul belum diisi"}
                      </h5>

                      <p className="mt-3 text-sm text-gray-600 leading-6">
                        {item.deskripsi ||
                          "Deskripsi belum diisi."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACCENT */}
              <div className="flex h-1">
                <span className="flex-1 bg-red-500" />
                <span className="flex-1 bg-yellow-400" />
                <span className="flex-1 bg-blue-700" />
              </div>
            </div>
          </div>

          {/* BOTTOM ACCENT */}
          <div className="mt-8 flex items-center justify-center gap-1">
            <span className="w-12 h-1 rounded-full bg-red-500" />
            <span className="w-12 h-1 rounded-full bg-yellow-400" />
            <span className="w-12 h-1 rounded-full bg-blue-700" />
          </div>
        </section>
      </div>
    </main>
  );
}