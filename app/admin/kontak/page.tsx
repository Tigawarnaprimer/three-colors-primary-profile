"use client";

import { FormEvent, useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { supabase } from "@/lib/supabase";

type ContactData = {
  id: number;
  whatsapp: string;
  email: string;
  alamat: string;
  jam_weekday: string;
  jam_saturday: string;
  google_maps_url: string;
  google_maps_embed: string;
  updated_at: string | null;
};

export default function AdminKontak() {
  const [contactId, setContactId] = useState<number | null>(null);

  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [alamat, setAlamat] = useState("");
  const [jamWeekday, setJamWeekday] = useState("");
  const [jamSaturday, setJamSaturday] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [googleMapsEmbed, setGoogleMapsEmbed] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadContact() {
      setLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("kontak")
        .select(
          "id, whatsapp, email, alamat, jam_weekday, jam_saturday, google_maps_url, google_maps_embed, updated_at"
        )
        .limit(1)
        .single();

      if (error) {
        console.error("Gagal mengambil data kontak:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });

        setErrorMessage(
          `Data kontak gagal dimuat: ${error.message}`
        );

        setLoading(false);
        return;
      }

      const contact = data as ContactData;

      setContactId(contact.id);
      setWhatsapp(contact.whatsapp ?? "");
      setEmail(contact.email ?? "");
      setAlamat(contact.alamat ?? "");
      setJamWeekday(contact.jam_weekday ?? "");
      setJamSaturday(contact.jam_saturday ?? "");
      setGoogleMapsUrl(contact.google_maps_url ?? "");
      setGoogleMapsEmbed(contact.google_maps_embed ?? "");

      setLoading(false);
    }

    loadContact();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

    if (contactId === null) {
      setErrorMessage("ID data kontak tidak ditemukan.");
      return;
    }

    setSaving(true);

    const updateData = {
      whatsapp: whatsapp.trim(),
      email: email.trim(),
      alamat: alamat.trim(),
      jam_weekday: jamWeekday.trim(),
      jam_saturday: jamSaturday.trim(),
      google_maps_url: googleMapsUrl.trim(),
      google_maps_embed: googleMapsEmbed.trim(),
      updated_at: new Date().toISOString(),
    };

    console.log("Mencoba update kontak:", {
      contactId,
      updateData,
    });

    const { data, error } = await supabase
      .from("kontak")
      .update(updateData)
      .eq("id", contactId)
      .select(
        "id, whatsapp, email, alamat, jam_weekday, jam_saturday, google_maps_url, google_maps_embed, updated_at"
      )
      .single();

    if (error) {
      console.error("Gagal menyimpan data kontak:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });

      setErrorMessage(
        `Gagal menyimpan perubahan: ${error.message}`
      );

      setSaving(false);
      return;
    }

    if (!data) {
      console.error("Update tidak mengembalikan data.");

      setErrorMessage(
        "Data tidak berubah. Periksa policy UPDATE pada tabel kontak."
      );

      setSaving(false);
      return;
    }

    console.log("Data kontak berhasil diupdate:", data);

    // Sinkronkan kembali state dengan data dari database
    const updatedContact = data as ContactData;

    setContactId(updatedContact.id);
    setWhatsapp(updatedContact.whatsapp ?? "");
    setEmail(updatedContact.email ?? "");
    setAlamat(updatedContact.alamat ?? "");
    setJamWeekday(updatedContact.jam_weekday ?? "");
    setJamSaturday(updatedContact.jam_saturday ?? "");
    setGoogleMapsUrl(updatedContact.google_maps_url ?? "");
    setGoogleMapsEmbed(updatedContact.google_maps_embed ?? "");

    setMessage("Perubahan kontak berhasil disimpan ke database.");
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />

        <main className="ml-64 min-h-screen p-8">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <p className="text-sm text-gray-500">
                Memuat data kontak...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="ml-64 min-h-screen p-8">
        <div className="mx-auto max-w-6xl">

          {/* Header */}
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
              Pengaturan Kontak
            </p>

            <h1 className="mt-2 text-3xl font-bold text-blue-950">
              Kontak
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Kelola informasi kontak yang ditampilkan pada halaman kontak
              website PT Tiga Warna Primer.
            </p>
          </div>

          {/* Error */}
          {errorMessage && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          {/* Success */}
          {message && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Informasi Kontak */}
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-7 py-6">
                <div className="mb-3 h-1 w-10 rounded-full bg-yellow-400" />

                <h2 className="text-xl font-bold text-blue-950">
                  Informasi Kontak
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Informasi yang digunakan pengunjung untuk menghubungi
                  perusahaan.
                </p>
              </div>

              <div className="grid gap-6 px-7 py-7 md:grid-cols-2">

                {/* WhatsApp */}
                <div>
                  <label
                    htmlFor="whatsapp"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    WhatsApp Konsultasi
                  </label>

                  <input
                    id="whatsapp"
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="6285136035632"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    required
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Gunakan format internasional tanpa tanda +.
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@perusahaan.com"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                {/* Alamat */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="alamat"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Alamat Kantor
                  </label>

                  <textarea
                    id="alamat"
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    placeholder="Masukkan alamat kantor"
                    rows={4}
                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm leading-6 text-gray-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Jam Operasional */}
            <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-7 py-6">
                <div className="mb-3 h-1 w-10 rounded-full bg-yellow-400" />

                <h2 className="text-xl font-bold text-blue-950">
                  Jam Operasional
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Atur informasi jam operasional perusahaan.
                </p>
              </div>

              <div className="grid gap-6 px-7 py-7 md:grid-cols-2">

                {/* Weekday */}
                <div>
                  <label
                    htmlFor="weekday"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Senin – Jumat
                  </label>

                  <input
                    id="weekday"
                    type="text"
                    value={jamWeekday}
                    onChange={(e) => setJamWeekday(e.target.value)}
                    placeholder="Senin – Jumat: 08.30 – 16.30"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                {/* Saturday */}
                <div>
                  <label
                    htmlFor="saturday"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Sabtu
                  </label>

                  <input
                    id="saturday"
                    type="text"
                    value={jamSaturday}
                    onChange={(e) => setJamSaturday(e.target.value)}
                    placeholder="Sabtu: 08.30 – 16.00"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Google Maps */}
            <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-7 py-6">
                <div className="mb-3 h-1 w-10 rounded-full bg-yellow-400" />

                <h2 className="text-xl font-bold text-blue-950">
                  Lokasi Google Maps
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Kelola link Google Maps dan URL embed yang digunakan pada
                  halaman kontak.
                </p>
              </div>

              <div className="space-y-6 px-7 py-7">

                {/* Google Maps URL */}
                <div>
                  <label
                    htmlFor="googleMapsUrl"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Link Google Maps
                  </label>

                  <input
                    id="googleMapsUrl"
                    type="url"
                    value={googleMapsUrl}
                    onChange={(e) => setGoogleMapsUrl(e.target.value)}
                    placeholder="https://maps.app.goo.gl/..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                {/* Google Maps Embed */}
                <div>
                  <label
                    htmlFor="googleMapsEmbed"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Google Maps Embed
                  </label>

                  <textarea
                    id="googleMapsEmbed"
                    value={googleMapsEmbed}
                    onChange={(e) => setGoogleMapsEmbed(e.target.value)}
                    placeholder="https://www.google.com/maps?q=...&output=embed"
                    rows={4}
                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm leading-6 text-gray-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    required
                  />

                  <p className="mt-2 text-xs leading-5 text-gray-400">
                    Gunakan URL embed Google Maps, bukan kode iframe lengkap.
                  </p>
                </div>
              </div>
            </section>

            {/* Save */}
            <div className="mt-6 flex items-center justify-end">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>

          {/* Bottom Accent */}
          <div className="mt-8 h-1 w-full rounded-full bg-gradient-to-r from-blue-700 via-blue-500 to-yellow-400" />
        </div>
      </main>
    </div>
  );
}