"use client";

import { FormEvent, useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { supabase } from "@/lib/supabase";

type Status = "Aktif" | "Nonaktif";

type Keunggulan = {
  id: number;
  judul: string;
  deskripsi: string;
  status: Status;
  dibuat_pada: string;
  diperbarui_pada: string;
};

const emptyForm = {
  judul: "",
  deskripsi: "",
  status: "Aktif" as Status,
};

export default function AdminKeunggulanPage() {
  const [data, setData] = useState<Keunggulan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function loadData() {
    setLoading(true);
    setErrorMessage("");

    const { data: keunggulan, error } = await supabase
      .from("keunggulan")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      setErrorMessage(error.message);
      setData([]);
    } else {
      setData((keunggulan ?? []) as Keunggulan[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  function showSuccess(text: string) {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  }

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setErrorMessage("");
    setShowForm(true);
  }

  function openEditForm(item: Keunggulan) {
    setEditingId(item.id);

    setForm({
      judul: item.judul,
      deskripsi: item.deskripsi,
      status: item.status,
    });

    setErrorMessage("");
    setShowForm(true);
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.judul.trim() || !form.deskripsi.trim()) {
      setErrorMessage("Judul dan deskripsi wajib diisi.");
      return;
    }

    setSaving(true);
    setErrorMessage("");

    if (editingId !== null) {
      const { error } = await supabase
        .from("keunggulan")
        .update({
          judul: form.judul.trim(),
          deskripsi: form.deskripsi.trim(),
          status: form.status,
          diperbarui_pada: new Date().toISOString(),
        })
        .eq("id", editingId);

      if (error) {
        setErrorMessage(error.message);
      } else {
        showSuccess("Keunggulan berhasil diperbarui.");
        closeForm();
        await loadData();
      }
    } else {
      const { error } = await supabase
        .from("keunggulan")
        .insert({
          judul: form.judul.trim(),
          deskripsi: form.deskripsi.trim(),
          status: form.status,
        });

      if (error) {
        setErrorMessage(error.message);
      } else {
        showSuccess("Keunggulan berhasil ditambahkan.");
        closeForm();
        await loadData();
      }
    }

    setSaving(false);
  }

  async function handleDelete(id: number) {
    const item = data.find((item) => item.id === id);

    if (!item) return;

    const confirmed = window.confirm(
      `Hapus keunggulan "${item.judul}"?`
    );

    if (!confirmed) return;

    setErrorMessage("");

    const { error } = await supabase
      .from("keunggulan")
      .delete()
      .eq("id", id);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    showSuccess("Keunggulan berhasil dihapus.");
    await loadData();
  }

  async function toggleStatus(item: Keunggulan) {
    const newStatus: Status =
      item.status === "Aktif" ? "Nonaktif" : "Aktif";

    setErrorMessage("");

    const { error } = await supabase
      .from("keunggulan")
      .update({
        status: newStatus,
        diperbarui_pada: new Date().toISOString(),
      })
      .eq("id", item.id);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    showSuccess(
      `${item.judul} sekarang ${newStatus.toLowerCase()}.`
    );

    await loadData();
  }

  const total = data.length;
  const aktif = data.filter((item) => item.status === "Aktif").length;
  const nonaktif = data.filter(
    (item) => item.status === "Nonaktif"
  ).length;

  const previewData = data.filter(
    (item) => item.status === "Aktif"
  );

  return (
    <>
      <AdminSidebar />

      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen bg-gray-50">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* HEADER */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                  Konten Website
                </p>

                <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-blue-950">
                  Keunggulan
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  Kelola keunggulan perusahaan yang ditampilkan pada
                  website.
                </p>
              </div>

              <button
                type="button"
                onClick={openAddForm}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M12 5v14M5 12h14"
                    strokeLinecap="round"
                  />
                </svg>
                Tambah Keunggulan
              </button>
            </div>

            {/* MESSAGE */}
            {message && (
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
                  <svg
                    className="h-4 w-4 text-green-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="m5 12 4 4L19 6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <p className="text-sm font-semibold text-green-700">
                  {message}
                </p>
              </div>
            )}

            {errorMessage && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-semibold text-red-700">
                  {errorMessage}
                </p>
              </div>
            )}

            {/* SUMMARY */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <SummaryCard
                label="Total Keunggulan"
                value={total}
                icon="total"
              />

              <SummaryCard
                label="Aktif"
                value={aktif}
                icon="active"
              />

              <SummaryCard
                label="Nonaktif"
                value={nonaktif}
                icon="inactive"
              />
            </div>

            {/* DATA */}
            <section className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex flex-col gap-2 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <h2 className="text-lg font-bold text-blue-950">
                    Daftar Keunggulan
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Data yang tersimpan di Supabase.
                  </p>
                </div>

                <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  {total} Data
                </span>
              </div>

              {loading ? (
                <div className="flex min-h-[250px] items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-blue-200 border-t-blue-700" />

                    <p className="mt-4 text-sm font-semibold text-blue-950">
                      Memuat data...
                    </p>
                  </div>
                </div>
              ) : data.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                    <svg
                      className="h-6 w-6 text-gray-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <h3 className="mt-4 font-bold text-blue-950">
                    Belum ada data
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Tambahkan keunggulan pertama.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {data.map((item, index) => (
                    <div
                      key={item.id}
                      className="p-5 sm:p-6"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex min-w-0 gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-700">
                            {String(index + 1).padStart(2, "0")}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-bold text-blue-950">
                                {item.judul}
                              </h3>

                              <span
                                className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                  item.status === "Aktif"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>

                            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
                              {item.deskripsi}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
                          <button
                            type="button"
                            onClick={() => toggleStatus(item)}
                            className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${
                              item.status === "Aktif"
                                ? "border-gray-200 text-gray-600 hover:bg-gray-50"
                                : "border-green-200 text-green-700 hover:bg-green-50"
                            }`}
                          >
                            {item.status === "Aktif"
                              ? "Nonaktifkan"
                              : "Aktifkan"}
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditForm(item)}
                            className="rounded-lg border border-blue-100 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-50"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
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
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                  Preview Website
                </p>

                <h2 className="mt-2 text-xl font-bold text-blue-950">
                  Tampilan Keunggulan
                </h2>
              </div>

              <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
                <div className="bg-gray-50 px-5 py-10 sm:px-8 lg:px-10">
                  <div className="mx-auto max-w-6xl">
                    <div className="max-w-2xl">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                        Keunggulan
                      </p>

                      <h3 className="mt-3 text-2xl font-bold text-blue-950 sm:text-3xl">
                        Mengapa Memilih Kami?
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        Keunggulan yang menjadi bagian dari komitmen
                        PT Tiga Warna Primer dalam mendukung kebutuhan
                        industri tekstil.
                      </p>
                    </div>

                    {previewData.length === 0 ? (
                      <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
                        <p className="text-sm text-gray-500">
                          Belum ada keunggulan aktif untuk ditampilkan.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {previewData.map((item, index) => (
                          <div
                            key={item.id}
                            className="rounded-xl border border-gray-200 bg-white p-5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-blue-700">
                                {String(index + 1).padStart(2, "0")}
                              </span>

                              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                            </div>

                            <h4 className="mt-7 font-bold text-blue-950">
                              {item.judul}
                            </h4>

                            <p className="mt-3 text-sm leading-6 text-gray-500">
                              {item.deskripsi}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex h-1.5">
                  <div className="w-1/3 bg-red-500" />
                  <div className="w-1/3 bg-blue-700" />
                  <div className="w-1/3 bg-yellow-400" />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                  {editingId !== null ? "Edit Data" : "Data Baru"}
                </p>

                <h2 className="mt-1 text-xl font-bold text-blue-950">
                  {editingId !== null
                    ? "Edit Keunggulan"
                    : "Tambah Keunggulan"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                aria-label="Tutup"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-5 px-5 py-6 sm:px-6">
                {errorMessage && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm font-semibold text-red-700">
                      {errorMessage}
                    </p>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-bold text-blue-950">
                    Judul Keunggulan
                  </label>

                  <input
                    type="text"
                    value={form.judul}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        judul: event.target.value,
                      })
                    }
                    placeholder="Contoh: Kualitas Konsisten"
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-blue-950">
                    Deskripsi
                  </label>

                  <textarea
                    value={form.deskripsi}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        deskripsi: event.target.value,
                      })
                    }
                    rows={5}
                    placeholder="Masukkan deskripsi keunggulan..."
                    className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-blue-950">
                    Status
                  </label>

                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        status: event.target.value as Status,
                      })
                    }
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Menyimpan..."
                    : editingId !== null
                      ? "Simpan Perubahan"
                      : "Tambah Keunggulan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: "total" | "active" | "inactive";
}) {
  const iconClass =
    icon === "active"
      ? "bg-green-50 text-green-600"
      : icon === "inactive"
        ? "bg-red-50 text-red-500"
        : "bg-blue-50 text-blue-700";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-950">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon === "total" && (
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                d="m4 7 8-4 8 4-8 4-8-4Z"
                strokeLinejoin="round"
              />
              <path
                d="m4 12 8 4 8-4M4 17l8 4 8-4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          {icon === "active" && (
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                d="m5 12 4 4L19 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          {icon === "inactive" && (
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                d="M6 6l12 12M18 6 6 18"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}