"use client";

import { FormEvent, useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { supabase } from "@/lib/supabase";

type JobStatus = "Aktif" | "Nonaktif";

type Job = {
  id: number;
  posisi: string;
  tipe: string;
  lokasi: string;
  deskripsi: string;
  whatsapp: string;
  status: JobStatus;
  dibuat_pada: string;
  diperbarui_pada: string;
};

const emptyForm = {
  posisi: "",
  tipe: "Full Time",
  lokasi: "Tangerang",
  deskripsi: "",
  whatsapp: "+62 851-3603-5632",
  status: "Aktif" as JobStatus,
};

export default function AdminKarirPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function loadJobs() {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("karir")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Gagal mengambil data karir:", error);
      setErrorMessage("Gagal mengambil data lowongan.");
      setJobs([]);
    } else {
      setJobs((data ?? []) as Job[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadJobs();
  }, []);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
    setErrorMessage("");
  }

  function startEdit(job: Job) {
    setEditingId(job.id);

    setForm({
      posisi: job.posisi,
      tipe: job.tipe,
      lokasi: job.lokasi,
      deskripsi: job.deskripsi,
      whatsapp: job.whatsapp,
      status: job.status,
    });

    setMessage("");
    setErrorMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.posisi.trim() || !form.deskripsi.trim()) {
      setErrorMessage("Posisi dan deskripsi wajib diisi.");
      return;
    }

    setSaving(true);
    setMessage("");
    setErrorMessage("");

    if (editingId) {
      const { error } = await supabase
        .from("karir")
        .update({
          posisi: form.posisi.trim(),
          tipe: form.tipe.trim(),
          lokasi: form.lokasi.trim(),
          deskripsi: form.deskripsi.trim(),
          whatsapp: form.whatsapp.trim(),
          status: form.status,
          diperbarui_pada: new Date().toISOString(),
        })
        .eq("id", editingId);

      if (error) {
        console.error("Gagal mengubah data karir:", error);
        setErrorMessage("Gagal mengubah data lowongan.");
      } else {
        setMessage("Data lowongan berhasil diperbarui.");
        resetForm();
        await loadJobs();
      }
    } else {
      const { error } = await supabase.from("karir").insert({
        posisi: form.posisi.trim(),
        tipe: form.tipe.trim(),
        lokasi: form.lokasi.trim(),
        deskripsi: form.deskripsi.trim(),
        whatsapp: form.whatsapp.trim(),
        status: form.status,
      });

      if (error) {
        console.error("Gagal menambahkan data karir:", error);
        setErrorMessage("Gagal menambahkan data lowongan.");
      } else {
        setMessage("Data lowongan berhasil ditambahkan.");
        resetForm();
        await loadJobs();
      }
    }

    setSaving(false);
  }

  async function deleteJob(id: number) {
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus lowongan ini?"
    );

    if (!confirmed) return;

    setMessage("");
    setErrorMessage("");

    const { error } = await supabase
      .from("karir")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Gagal menghapus data karir:", error);
      setErrorMessage("Gagal menghapus data lowongan.");
      return;
    }

    setMessage("Data lowongan berhasil dihapus.");
    await loadJobs();
  }

  async function toggleStatus(job: Job) {
    const newStatus: JobStatus =
      job.status === "Aktif" ? "Nonaktif" : "Aktif";

    setMessage("");
    setErrorMessage("");

    const { error } = await supabase
      .from("karir")
      .update({
        status: newStatus,
        diperbarui_pada: new Date().toISOString(),
      })
      .eq("id", job.id);

    if (error) {
      console.error("Gagal mengubah status:", error);
      setErrorMessage("Gagal mengubah status lowongan.");
      return;
    }

    setMessage(
      `Status "${job.posisi}" berhasil diubah menjadi ${newStatus}.`
    );

    await loadJobs();
  }

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(
    (job) => job.status === "Aktif"
  ).length;
  const inactiveJobs = jobs.filter(
    (job) => job.status === "Nonaktif"
  ).length;

  function getWhatsappUrl(number: string) {
    const cleanNumber = number.replace(/\D/g, "");
    return `https://wa.me/${cleanNumber}`;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="px-5 py-7 md:px-8 lg:px-10">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div>
              <p className="text-sm font-semibold tracking-[0.16em] uppercase text-blue-700">
                Manajemen Konten
              </p>

              <h1 className="mt-2 text-3xl md:text-4xl font-bold text-blue-950">
                Karir
              </h1>

              <p className="mt-3 max-w-2xl text-sm md:text-base text-gray-600 leading-7">
                Kelola informasi lowongan pekerjaan yang ditampilkan
                pada halaman karir website.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="w-3 h-3 rounded-full bg-blue-700" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
            </div>
          </div>

          {/* MESSAGE */}
          {message && (
            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
              {message}
            </div>
          )}

          {errorMessage && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
              {errorMessage}
            </div>
          )}

          {/* SUMMARY */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Total Lowongan
                  </p>

                  <p className="mt-2 text-3xl font-bold text-blue-950">
                    {totalJobs}
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="3" y="7" width="18" height="13" rx="2" />
                    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <path d="M3 12h18" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Lowongan Aktif
                  </p>

                  <p className="mt-2 text-3xl font-bold text-green-600">
                    {activeJobs}
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Nonaktif
                  </p>

                  <p className="mt-2 text-3xl font-bold text-red-500">
                    {inactiveJobs}
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                </div>
              </div>
            </div>
          </div>

          {/* FORM */}
          <section className="mt-8 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-blue-950">
                  {editingId
                    ? "Edit Lowongan"
                    : "Tambah Lowongan"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Isi informasi lowongan yang akan ditampilkan.
                </p>
              </div>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-sm font-semibold text-gray-500 hover:text-blue-700 transition"
                >
                  Batal Edit
                </button>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* POSISI */}
                <div>
                  <label className="block text-sm font-semibold text-blue-950 mb-2">
                    Posisi
                  </label>

                  <input
                    type="text"
                    name="posisi"
                    value={form.posisi}
                    onChange={handleChange}
                    placeholder="Contoh: Sales"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>

                {/* TIPE */}
                <div>
                  <label className="block text-sm font-semibold text-blue-950 mb-2">
                    Tipe Pekerjaan
                  </label>

                  <select
                    name="tipe"
                    value={form.tipe}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white"
                  >
                    <option value="Full Time">
                      Full Time
                    </option>
                    <option value="Part Time">
                      Part Time
                    </option>
                    <option value="Internship">
                      Internship
                    </option>
                    <option value="Contract">
                      Contract
                    </option>
                  </select>
                </div>

                {/* LOKASI */}
                <div>
                  <label className="block text-sm font-semibold text-blue-950 mb-2">
                    Lokasi
                  </label>

                  <input
                    type="text"
                    name="lokasi"
                    value={form.lokasi}
                    onChange={handleChange}
                    placeholder="Contoh: Tangerang"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>

                {/* WHATSAPP */}
                <div>
                  <label className="block text-sm font-semibold text-blue-950 mb-2">
                    WhatsApp
                  </label>

                  <input
                    type="text"
                    name="whatsapp"
                    value={form.whatsapp}
                    onChange={handleChange}
                    placeholder="+62 851-3603-5632"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>

                {/* STATUS */}
                <div>
                  <label className="block text-sm font-semibold text-blue-950 mb-2">
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">
                      Nonaktif
                    </option>
                  </select>
                </div>

                {/* DESKRIPSI */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-blue-950 mb-2">
                    Deskripsi
                  </label>

                  <textarea
                    name="deskripsi"
                    value={form.deskripsi}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tuliskan deskripsi pekerjaan..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 text-white px-6 py-3 text-sm font-bold transition"
                >
                  {saving
                    ? "Menyimpan..."
                    : editingId
                    ? "Simpan Perubahan"
                    : "Tambah Lowongan"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 text-sm font-semibold transition"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* DATA LOWONGAN */}
          <section className="mt-8 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-blue-950">
                Daftar Lowongan
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Data diambil langsung dari Supabase.
              </p>
            </div>

            {loading ? (
              <div className="py-16 text-center">
                <div className="w-9 h-9 border-2 border-blue-200 border-t-blue-700 rounded-full animate-spin mx-auto" />

                <p className="mt-4 text-sm font-semibold text-gray-500">
                  Memuat data lowongan...
                </p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="py-16 text-center px-6">
                <p className="text-sm font-semibold text-gray-500">
                  Belum ada data lowongan.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {jobs.map((job, index) => (
                  <div
                    key={job.id}
                    className="p-6 hover:bg-gray-50/70 transition"
                  >
                    <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
                      <div className="flex gap-4">
                        <div className="hidden sm:flex shrink-0 w-11 h-11 rounded-xl bg-blue-50 items-center justify-center text-sm font-bold text-blue-700">
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-bold text-blue-950">
                              {job.posisi}
                            </h3>

                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                job.status === "Aktif"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-red-50 text-red-600"
                              }`}
                            >
                              {job.status}
                            </span>
                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                            <span>{job.tipe}</span>

                            <span className="text-gray-300">
                              |
                            </span>

                            <span>{job.lokasi}</span>
                          </div>

                          <p className="mt-4 max-w-2xl text-sm text-gray-600 leading-6">
                            {job.deskripsi}
                          </p>

                          <a
                            href={getWhatsappUrl(
                              job.whatsapp
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-green-600 hover:text-green-700 transition"
                          >
                            WhatsApp
                            <span>→</span>
                          </a>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex flex-wrap items-center gap-2 xl:shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleStatus(job)}
                          className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                            job.status === "Aktif"
                              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              : "bg-green-50 text-green-700 hover:bg-green-100"
                          }`}
                        >
                          {job.status === "Aktif"
                            ? "Nonaktifkan"
                            : "Aktifkan"}
                        </button>

                        <button
                          type="button"
                          onClick={() => startEdit(job)}
                          className="px-4 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteJob(job.id)}
                          className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* PREVIEW */}
          <section className="mt-8">
            <div className="mb-4">
              <p className="text-sm font-semibold tracking-[0.16em] uppercase text-blue-700">
                Preview
              </p>

              <h2 className="mt-2 text-2xl font-bold text-blue-950">
                Tampilan Lowongan Aktif
              </h2>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
              {activeJobs === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-gray-500">
                    Tidak ada lowongan aktif.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {jobs
                    .filter((job) => job.status === "Aktif")
                    .map((job) => (
                      <div
                        key={job.id}
                        className="border border-gray-200 rounded-xl p-5 hover:border-blue-200 hover:shadow-sm transition"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                              {job.tipe}
                            </p>

                            <h3 className="mt-2 text-xl font-bold text-blue-950">
                              {job.posisi}
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                              {job.lokasi}
                            </p>
                          </div>

                          <span className="w-3 h-3 rounded-full bg-green-500 shrink-0 mt-1" />
                        </div>

                        <p className="mt-4 text-sm text-gray-600 leading-6">
                          {job.deskripsi}
                        </p>

                        <a
                          href={getWhatsappUrl(job.whatsapp)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-5 inline-flex items-center justify-center w-full rounded-lg bg-blue-700 hover:bg-blue-800 text-white py-2.5 text-sm font-bold transition"
                        >
                          Kirim CV melalui WhatsApp
                        </a>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </section>

          {/* ACCENT */}
          <div className="mt-10 h-1.5 rounded-full overflow-hidden flex">
            <div className="w-1/3 bg-red-500" />
            <div className="w-1/3 bg-blue-700" />
            <div className="w-1/3 bg-yellow-400" />
          </div>
        </div>
      </main>
    </div>
  );
}