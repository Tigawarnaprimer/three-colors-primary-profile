
"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { supabase } from "@/lib/supabase";

type VisiMisi = {
  id: number;
  visi: string | null;
  visi_deskripsi: string | null;
  misi: string | null;
  misi_deskripsi: string | null;
};

type NilaiPerusahaan = {
  id: number;
  nomor: string;
  judul: string;
  deskripsi: string;
  isNew?: boolean;
};

const inputClass =
  "w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100";

export default function AdminVisiMisi() {
  const [visiId, setVisiId] = useState<number | null>(null);
  const [visi, setVisi] = useState("");
  const [visiDeskripsi, setVisiDeskripsi] = useState("");
  const [misi, setMisi] = useState("");
  const [misiDeskripsi, setMisiDeskripsi] = useState("");

  const [nilaiPerusahaan, setNilaiPerusahaan] = useState<
    NilaiPerusahaan[]
  >([]);

  // ID yang ada di database ketika data pertama kali dimuat.
  // Digunakan untuk menentukan data yang dihapus oleh admin.
  const [initialNilaiIds, setInitialNilaiIds] = useState<number[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const {
        data: visiData,
        error: visiError,
      } = await supabase
        .from("visi_misi")
        .select("id, visi, visi_deskripsi, misi, misi_deskripsi")
        .order("id", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (visiError) throw visiError;

      if (visiData) {
        setVisiId(visiData.id);
        setVisi(visiData.visi ?? "");
        setVisiDeskripsi(visiData.visi_deskripsi ?? "");
        setMisi(visiData.misi ?? "");
        setMisiDeskripsi(visiData.misi_deskripsi ?? "");
      } else {
        // Data belum ada: formulir tetap bisa digunakan untuk membuatnya.
        setVisiId(null);
        setVisi("");
        setVisiDeskripsi("");
        setMisi("");
        setMisiDeskripsi("");
      }

      const {
        data: nilaiData,
        error: nilaiError,
      } = await supabase
        .from("nilai_perusahaan")
        .select("id, nomor, judul, deskripsi")
        .order("id", { ascending: true });

      if (nilaiError) throw nilaiError;

      const formattedNilai: NilaiPerusahaan[] = (nilaiData ?? []).map(
        (item) => ({
          id: item.id,
          nomor: item.nomor ?? "",
          judul: item.judul ?? "",
          deskripsi: item.deskripsi ?? "",
          isNew: false,
        })
      );

      setNilaiPerusahaan(formattedNilai);
      setInitialNilaiIds(formattedNilai.map((item) => item.id));
    } catch (error) {
      console.error("Gagal mengambil data visi misi:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Data gagal dimuat. Periksa koneksi dan izin akses Supabase."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const updateNilai = (
    index: number,
    field: "nomor" | "judul" | "deskripsi",
    value: string
  ) => {
    setNilaiPerusahaan((current) =>
      current.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
    setSaved(false);
  };

  const tambahNilai = () => {
    setNilaiPerusahaan((current) => {
      const nomorBerikutnya = String(current.length + 1).padStart(2, "0");

      return [
        ...current,
        {
          id: -Date.now(),
          nomor: nomorBerikutnya,
          judul: "",
          deskripsi: "",
          isNew: true,
        },
      ];
    });

    setSaved(false);
  };

  const hapusNilai = (index: number) => {
    setNilaiPerusahaan((current) =>
      current.filter((_, i) => i !== index)
    );
    setSaved(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (saving) return;

    setSaving(true);
    setSaved(false);
    setErrorMessage("");

    try {
      /*
       * 1. SIMPAN VISI & MISI
       *
       * Jika record ada, update berdasarkan ID.
       * Jika tidak ada, insert record baru.
       */
      const visiPayload = {
        visi: visi.trim(),
        visi_deskripsi: visiDeskripsi.trim(),
        misi: misi.trim(),
        misi_deskripsi: misiDeskripsi.trim(),
        updated_at: new Date().toISOString(),
      };

      if (visiId !== null) {
        const { data: updatedVisi, error: updateVisiError } =
          await supabase
            .from("visi_misi")
            .update(visiPayload)
            .eq("id", visiId)
            .select("id")
            .maybeSingle();

        if (updateVisiError) throw updateVisiError;

        // Jika record sudah dihapus di tempat lain, buat ulang.
        if (!updatedVisi) {
          const { data: insertedVisi, error: insertVisiError } =
            await supabase
              .from("visi_misi")
              .insert(visiPayload)
              .select("id")
              .single();

          if (insertVisiError) throw insertVisiError;

          setVisiId(insertedVisi.id);
        }
      } else {
        const { data: insertedVisi, error: insertVisiError } =
          await supabase
            .from("visi_misi")
            .insert(visiPayload)
            .select("id")
            .single();

        if (insertVisiError) throw insertVisiError;

        setVisiId(insertedVisi.id);
      }

      /*
       * 2. VALIDASI NILAI PERUSAHAAN
       *
       * Baris kosong tidak dikirim ke database.
       * Judul dan deskripsi wajib diisi agar tidak menyimpan
       * data nilai perusahaan yang tidak lengkap.
       */
      const nilaiValid = nilaiPerusahaan.filter(
        (item) =>
          item.nomor.trim() ||
          item.judul.trim() ||
          item.deskripsi.trim()
      );

      const barisTidakLengkap = nilaiValid.some(
        (item) =>
          !item.nomor.trim() ||
          !item.judul.trim() ||
          !item.deskripsi.trim()
      );

      if (barisTidakLengkap) {
        throw new Error(
          "Lengkapi nomor, judul, dan deskripsi setiap nilai perusahaan, atau hapus baris yang tidak digunakan."
        );
      }

      /*
       * 3. INSERT ATAU UPDATE NILAI PERUSAHAAN
       */
      for (const item of nilaiValid) {
        const payload = {
          nomor: item.nomor.trim(),
          judul: item.judul.trim(),
          deskripsi: item.deskripsi.trim(),
          updated_at: new Date().toISOString(),
        };

        if (item.isNew || item.id < 0) {
          const { error: insertError } = await supabase
            .from("nilai_perusahaan")
            .insert({
              nomor: payload.nomor,
              judul: payload.judul,
              deskripsi: payload.deskripsi,
              updated_at: payload.updated_at,
            });

          if (insertError) throw insertError;
        } else {
          const { data: updatedNilai, error: updateError } =
            await supabase
              .from("nilai_perusahaan")
              .update(payload)
              .eq("id", item.id)
              .select("id")
              .maybeSingle();

          if (updateError) throw updateError;

          if (!updatedNilai) {
            throw new Error(
              `Nilai perusahaan nomor ${item.nomor} tidak ditemukan atau tidak memiliki izin untuk diperbarui.`
            );
          }
        }
      }

      /*
       * 4. HAPUS DATA YANG DIHAPUS ADMIN
       *
       * Hanya ID dari data awal yang tidak lagi ada pada formulir
       * yang akan dihapus. Data baru tidak ikut terhapus.
       */
      const currentExistingIds = new Set(
        nilaiValid
          .filter((item) => !item.isNew && item.id > 0)
          .map((item) => item.id)
      );

      const idsToDelete = initialNilaiIds.filter(
        (id) => !currentExistingIds.has(id)
      );

      if (idsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from("nilai_perusahaan")
          .delete()
          .in("id", idsToDelete);

        if (deleteError) throw deleteError;
      }

      /*
       * 5. MUAT ULANG DATA DARI DATABASE
       */
      await loadData();
      setSaved(true);
    } catch (error) {
      console.error("Gagal menyimpan perubahan:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan perubahan. Silakan coba lagi."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="lg:ml-64">
          <header className="flex h-20 items-center border-b border-gray-200 bg-white px-6 lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                Admin Panel
              </p>
              <h1 className="mt-1 text-lg font-bold text-blue-950">
                Kelola Visi & Misi
              </h1>
            </div>
          </header>
          <div className="px-6 py-12 lg:px-8">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
              <p className="text-sm text-gray-500">
                Memuat data visi, misi, dan nilai perusahaan...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="lg:ml-64">
        <header className="flex h-20 items-center border-b border-gray-200 bg-white px-6 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
              Admin Panel
            </p>
            <h1 className="mt-1 text-lg font-bold text-blue-950">
              Kelola Visi & Misi
            </h1>
          </div>
        </header>

        <section className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
          <div className="mb-7">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
              Informasi Website
            </p>
            <h2 className="mt-2 text-2xl font-bold text-blue-950 md:text-3xl">
              Visi, Misi & Nilai Perusahaan
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-gray-500">
              Kelola visi, misi, dan nilai perusahaan PT Tiga Warna
              Primer yang ditampilkan pada website.
            </p>
          </div>

          {saved && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
              <p className="text-sm font-semibold text-green-800">
                Perubahan berhasil disimpan
              </p>
              <p className="mt-1 text-xs text-green-700">
                Data telah diperbarui pada database.
              </p>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-semibold text-red-800">
                Gagal memproses data
              </p>
              <p className="mt-1 whitespace-pre-wrap text-xs text-red-700">
                {errorMessage}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* VISI */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="border-b border-gray-200 px-6 py-5 md:px-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 font-bold text-blue-700">
                    V
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-950">Visi</h3>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Pernyataan visi perusahaan
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-6 md:p-8">
                <div>
                  <label
                    htmlFor="visi"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Isi Visi
                  </label>
                  <textarea
                    id="visi"
                    value={visi}
                    onChange={(e) => {
                      setVisi(e.target.value);
                      setSaved(false);
                    }}
                    rows={4}
                    placeholder="Masukkan visi perusahaan..."
                    className={`${inputClass} resize-none`}
                  />
                  <p className="mt-2 text-xs text-gray-400">
                    Gunakan kalimat yang singkat, jelas, dan
                    menggambarkan arah perusahaan.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="visi_deskripsi"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Deskripsi Visi
                  </label>
                  <textarea
                    id="visi_deskripsi"
                    value={visiDeskripsi}
                    onChange={(e) => {
                      setVisiDeskripsi(e.target.value);
                      setSaved(false);
                    }}
                    rows={4}
                    placeholder="Masukkan deskripsi visi perusahaan..."
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>
            </div>

            {/* MISI */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="border-b border-gray-200 px-6 py-5 md:px-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50 font-bold text-yellow-600">
                    M
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-950">Misi</h3>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Pernyataan misi perusahaan
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-6 md:p-8">
                <div>
                  <label
                    htmlFor="misi"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Isi Misi
                  </label>
                  <textarea
                    id="misi"
                    value={misi}
                    onChange={(e) => {
                      setMisi(e.target.value);
                      setSaved(false);
                    }}
                    rows={4}
                    placeholder="Masukkan misi perusahaan..."
                    className={`${inputClass} resize-none`}
                  />
                  <p className="mt-2 text-xs text-gray-400">
                    Masukkan pernyataan utama misi perusahaan.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="misi_deskripsi"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Deskripsi Misi
                  </label>
                  <textarea
                    id="misi_deskripsi"
                    value={misiDeskripsi}
                    onChange={(e) => {
                      setMisiDeskripsi(e.target.value);
                      setSaved(false);
                    }}
                    rows={5}
                    placeholder="Masukkan deskripsi misi perusahaan..."
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>
            </div>

            {/* NILAI PERUSAHAAN */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="border-b border-gray-200 px-6 py-5 md:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50 font-bold text-yellow-600">
                      N
                    </div>
                    <div>
                      <h3 className="font-bold text-blue-950">
                        Nilai Perusahaan
                      </h3>
                      <p className="mt-0.5 text-xs text-gray-500">
                        Prinsip yang menjadi dasar perusahaan
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={tambahNilai}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                  >
                    <span className="text-base leading-none">+</span>
                    Tambah Nilai
                  </button>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="space-y-5">
                  {nilaiPerusahaan.map((item, index) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-gray-200 p-5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                        <div className="shrink-0">
                          <label className="mb-2 block text-xs font-semibold text-gray-500">
                            Nomor
                          </label>
                          <input
                            type="text"
                            value={item.nomor}
                            onChange={(e) =>
                              updateNilai(index, "nomor", e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-center font-semibold text-blue-950 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 sm:w-20"
                          />
                        </div>

                        <div className="flex-1 space-y-4">
                          <div>
                            <label className="mb-2 block text-xs font-semibold text-gray-500">
                              Judul
                            </label>
                            <input
                              type="text"
                              value={item.judul}
                              onChange={(e) =>
                                updateNilai(index, "judul", e.target.value)
                              }
                              placeholder="Contoh: Inovasi"
                              className={inputClass}
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-xs font-semibold text-gray-500">
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
                              className={`${inputClass} resize-none`}
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => hapusNilai(index)}
                          className="self-start rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 hover:text-red-700"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}

                  {nilaiPerusahaan.length === 0 && (
                    <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
                      <p className="text-sm text-gray-500">
                        Belum ada nilai perusahaan. Klik Tambah Nilai
                        untuk menambahkan data.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-5 border-t border-gray-100 pt-5">
                  <p className="text-xs text-gray-400">
                    Total {nilaiPerusahaan.length} nilai perusahaan.
                    Penghapusan permanen dilakukan setelah perubahan
                    disimpan.
                  </p>
                </div>
              </div>
            </div>

            {/* TOMBOL SIMPAN */}
            <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
              <div>
                <p className="text-sm font-semibold text-blue-950">
                  Simpan perubahan
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Perubahan visi, misi, dan nilai perusahaan akan
                  disimpan ke database.
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
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
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>

          {/* PREVIEW */}
          <div className="mt-10">
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                Preview
              </p>
              <h3 className="mt-1 text-xl font-bold text-blue-950">
                Tampilan Visi, Misi & Nilai Perusahaan
              </h3>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="grid lg:grid-cols-2">
                <div className="relative overflow-hidden bg-blue-950 p-7 md:p-9">
                  <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-blue-900/60" />
                  <div className="relative">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400">
                      Visi
                    </p>
                    <h4 className="mt-3 text-2xl font-bold text-white md:text-3xl">
                      {visi || "Visi Kami"}
                    </h4>
                    <div className="mt-5 flex items-center gap-1">
                      <span className="h-1 w-8 rounded-full bg-red-500" />
                      <span className="h-1 w-8 rounded-full bg-yellow-400" />
                      <span className="h-1 w-8 rounded-full bg-blue-400" />
                    </div>
                    <p className="mt-6 whitespace-pre-line text-sm leading-7 text-blue-100 md:text-base">
                      {visiDeskripsi || "Deskripsi visi belum diisi."}
                    </p>
                  </div>
                </div>

                <div className="p-7 md:p-9">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
                    Misi
                  </p>
                  <h4 className="mt-3 text-2xl font-bold text-blue-950 md:text-3xl">
                    {misi || "Misi Kami"}
                  </h4>
                  <div className="mt-5 flex items-center gap-1">
                    <span className="h-1 w-8 rounded-full bg-red-500" />
                    <span className="h-1 w-8 rounded-full bg-yellow-400" />
                    <span className="h-1 w-8 rounded-full bg-blue-700" />
                  </div>
                  <p className="mt-6 whitespace-pre-line text-sm leading-7 text-gray-600">
                    {misiDeskripsi || "Deskripsi misi belum diisi."}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 p-7 md:p-9">
                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
                    Nilai Perusahaan
                  </p>
                  <h4 className="mt-2 text-2xl font-bold text-blue-950 md:text-3xl">
                    Prinsip yang menjadi dasar kami
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {nilaiPerusahaan.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-gray-200 p-5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-950">
                          <span className="text-sm font-bold text-yellow-400">
                            {item.nomor || "00"}
                          </span>
                        </div>
                        <span className="h-[2px] w-8 bg-yellow-400" />
                      </div>
                      <h5 className="mt-5 text-lg font-bold text-blue-950">
                        {item.judul || "Judul belum diisi"}
                      </h5>
                      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600">
                        {item.deskripsi || "Deskripsi belum diisi."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex h-1">
                <span className="flex-1 bg-red-500" />
                <span className="flex-1 bg-yellow-400" />
                <span className="flex-1 bg-blue-700" />
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-1">
            <span className="h-1 w-12 rounded-full bg-red-500" />
            <span className="h-1 w-12 rounded-full bg-yellow-400" />
            <span className="h-1 w-12 rounded-full bg-blue-700" />
          </div>
        </section>
      </div>
    </main>
  );
}
