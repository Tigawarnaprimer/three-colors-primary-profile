"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import AdminSidebar from "@/components/AdminSidebar";
import { supabase } from "@/lib/supabase";

type Article = {
  id: number;
  judul: string;
  slug: string;
  kategori: string;
  tanggal: string;
  ringkasan: string;
  isi: string;
  gambar_url: string | null;
  status: "Aktif" | "Nonaktif";
  dibuat_pada?: string;
  diperbarui_pada?: string;
};

const categories = [
  "Perusahaan",
  "Berita Perusahaan",
  "Kegiatan Perusahaan",
  "Produk",
  "Pewarna Tekstil",
  "Bahan Kimia Tekstil",
  "Industri Tekstil",
  "Teknologi Tekstil",
  "Edukasi",
  "Tips & Panduan",
  "Informasi Industri",
  "Inovasi",
  "Tren Industri",
  "Kualitas & Standar",
  "Keberlanjutan",
  "Karier",
  "Pengumuman",
  "Artikel Umum",
];

const ARTICLE_BUCKET = "artikel";

export default function AdminArtikel() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [ringkasan, setRingkasan] = useState("");
  const [isi, setIsi] = useState("");

  const [gambarUrl, setGambarUrl] = useState("");
  const [gambarPreview, setGambarPreview] = useState("");
  const [gambarFile, setGambarFile] = useState<File | null>(null);

  const [status, setStatus] =
    useState<"Aktif" | "Nonaktif">("Aktif");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error"
  >("success");

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    setLoading(true);

    const { data, error } = await supabase
      .from("artikel")
      .select(
        "id, judul, slug, kategori, tanggal, ringkasan, isi, gambar_url, status, dibuat_pada, diperbarui_pada"
      )
      .order("id", { ascending: false });

    if (error) {
      console.error("Gagal mengambil data artikel:", error);

      showMessage(
        "Gagal mengambil data artikel dari database.",
        "error"
      );

      setArticles([]);
    } else {
      setArticles((data ?? []) as Article[]);
    }

    setLoading(false);
  }

  // =========================
  // MESSAGE
  // =========================
  const showMessage = (
    text: string,
    type: "success" | "error" = "success"
  ) => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 3500);
  };

  // =========================
  // SLUG
  // =========================
  const createSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // =========================
  // RESET FORM
  // =========================
  const resetForm = () => {
    setEditingId(null);

    setJudul("");
    setKategori("");
    setTanggal("");
    setRingkasan("");
    setIsi("");

    setGambarUrl("");
    setGambarPreview("");
    setGambarFile(null);

    setStatus("Aktif");

    setShowForm(false);
  };

  // =========================
  // IMAGE
  // =========================
  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showMessage(
        "File yang dipilih harus berupa gambar.",
        "error"
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showMessage(
        "Ukuran gambar maksimal 5 MB.",
        "error"
      );
      return;
    }

    setGambarFile(file);

    const previewUrl = URL.createObjectURL(file);
    setGambarPreview(previewUrl);
  };

  // =========================
  // UPLOAD IMAGE
  // =========================
  async function uploadImage(file: File) {
    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const safeName = file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const filePath = `artikel/${Date.now()}-${safeName}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(ARTICLE_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from(ARTICLE_BUCKET)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  // =========================
  // DELETE STORAGE FILE
  // =========================
  async function deleteStorageImage(imageUrl: string | null) {
    if (!imageUrl) return;

    try {
      const marker = `/storage/v1/object/public/${ARTICLE_BUCKET}/`;

      if (!imageUrl.includes(marker)) return;

      const filePath = imageUrl.split(marker)[1];

      if (!filePath) return;

      await supabase.storage
        .from(ARTICLE_BUCKET)
        .remove([filePath]);
    } catch (error) {
      console.error(
        "Gagal menghapus gambar dari Storage:",
        error
      );
    }
  }

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!judul.trim()) {
      showMessage("Judul artikel wajib diisi.", "error");
      return;
    }

    if (!kategori) {
      showMessage(
        "Kategori artikel wajib dipilih.",
        "error"
      );
      return;
    }

    if (!tanggal) {
      showMessage(
        "Tanggal artikel wajib diisi.",
        "error"
      );
      return;
    }

    if (!ringkasan.trim()) {
      showMessage(
        "Ringkasan artikel wajib diisi.",
        "error"
      );
      return;
    }

    if (!isi.trim()) {
      showMessage(
        "Isi artikel wajib diisi.",
        "error"
      );
      return;
    }

    setSaving(true);

    try {
      let finalImageUrl = gambarUrl;

      // Upload gambar baru jika ada
      if (gambarFile) {
        finalImageUrl = await uploadImage(gambarFile);
      }

      const slug = createSlug(judul);

      if (editingId !== null) {
        const currentArticle = articles.find(
          (article) => article.id === editingId
        );

        const { error } = await supabase
          .from("artikel")
          .update({
            judul: judul.trim(),
            slug,
            kategori,
            tanggal,
            ringkasan: ringkasan.trim(),
            isi: isi.trim(),
            gambar_url: finalImageUrl || null,
            status,
            diperbarui_pada: new Date().toISOString(),
          })
          .eq("id", editingId);

        if (error) {
          throw error;
        }

        // Hapus gambar lama jika diganti
        if (
          gambarFile &&
          currentArticle?.gambar_url &&
          currentArticle.gambar_url !== finalImageUrl
        ) {
          await deleteStorageImage(
            currentArticle.gambar_url
          );
        }

        showMessage(
          "Artikel berhasil diperbarui.",
          "success"
        );
      } else {
        const { error } = await supabase
          .from("artikel")
          .insert({
            judul: judul.trim(),
            slug,
            kategori,
            tanggal,
            ringkasan: ringkasan.trim(),
            isi: isi.trim(),
            gambar_url: finalImageUrl || null,
            status,
          });

        if (error) {
          throw error;
        }

        showMessage(
          "Artikel berhasil ditambahkan.",
          "success"
        );
      }

      resetForm();

      await loadArticles();
    } catch (error) {
      console.error("Gagal menyimpan artikel:", error);

      showMessage(
        "Gagal menyimpan artikel. Periksa koneksi Supabase.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = (article: Article) => {
    setEditingId(article.id);

    setJudul(article.judul);
    setKategori(article.kategori);
    setTanggal(article.tanggal);
    setRingkasan(article.ringkasan);
    setIsi(article.isi);

    setGambarUrl(article.gambar_url || "");
    setGambarPreview(article.gambar_url || "");
    setGambarFile(null);

    setStatus(article.status);

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (article: Article) => {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus artikel "${article.judul}"?`
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from("artikel")
        .delete()
        .eq("id", article.id);

      if (error) {
        throw error;
      }

      if (article.gambar_url) {
        await deleteStorageImage(article.gambar_url);
      }

      setArticles((prev) =>
        prev.filter((item) => item.id !== article.id)
      );

      showMessage(
        "Artikel berhasil dihapus.",
        "success"
      );
    } catch (error) {
      console.error("Gagal menghapus artikel:", error);

      showMessage(
        "Gagal menghapus artikel.",
        "error"
      );
    }
  };

  // =========================
  // TOGGLE STATUS
  // =========================
  const handleToggleStatus = async (
    article: Article
  ) => {
    const newStatus =
      article.status === "Aktif"
        ? "Nonaktif"
        : "Aktif";

    try {
      const { error } = await supabase
        .from("artikel")
        .update({
          status: newStatus,
          diperbarui_pada: new Date().toISOString(),
        })
        .eq("id", article.id);

      if (error) {
        throw error;
      }

      setArticles((prev) =>
        prev.map((item) =>
          item.id === article.id
            ? {
                ...item,
                status: newStatus,
              }
            : item
        )
      );

      showMessage(
        `Artikel berhasil ${
          newStatus === "Aktif"
            ? "diaktifkan"
            : "dinonaktifkan"
        }.`,
        "success"
      );
    } catch (error) {
      console.error(
        "Gagal mengubah status artikel:",
        error
      );

      showMessage(
        "Gagal mengubah status artikel.",
        "error"
      );
    }
  };

  // =========================
  // SUMMARY
  // =========================
  const totalArticles = articles.length;

  const activeArticles = articles.filter(
    (article) => article.status === "Aktif"
  ).length;

  const inactiveArticles = articles.filter(
    (article) => article.status === "Nonaktif"
  ).length;

  return (
    <main className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="lg:ml-64">
        {/* HEADER */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Admin Panel
            </p>

            <h1 className="text-lg font-bold text-blue-950">
              Kelola Artikel
            </h1>
          </div>
        </header>

        <section className="px-6 lg:px-8 py-8 max-w-6xl mx-auto space-y-7">
          {/* TITLE */}
          <div className="relative overflow-hidden bg-white border border-gray-200 rounded-2xl p-6 md:p-7 shadow-sm">
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-blue-50" />

            <div className="absolute -bottom-10 right-24 w-20 h-20 rounded-full bg-yellow-50" />

            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-700" />

            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-[2px] bg-yellow-400" />

                  <p className="text-xs font-bold tracking-[0.18em] text-blue-700 uppercase">
                    Konten Website
                  </p>
                </div>

                <h2 className="mt-3 text-2xl md:text-3xl font-bold text-blue-950">
                  Artikel
                </h2>

                <p className="mt-2 text-sm text-gray-500 leading-6">
                  Kelola artikel, berita, dan informasi terbaru
                  yang ditampilkan pada website PT Tiga Warna
                  Primer.
                </p>

                <div className="flex items-center gap-1.5 mt-5">
                  <span className="w-8 h-1 rounded-full bg-red-500" />
                  <span className="w-8 h-1 rounded-full bg-yellow-400" />
                  <span className="w-8 h-1 rounded-full bg-blue-700" />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="relative shrink-0 inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-lg text-sm font-semibold transition shadow-sm"
              >
                <span className="text-lg leading-none">
                  +
                </span>
                Tambah Artikel
              </button>
            </div>
          </div>

          {/* MESSAGE */}
          {message && (
            <div
              className={`px-5 py-3 rounded-xl text-sm font-medium border ${
                messageType === "success"
                  ? "bg-green-50 border-green-100 text-green-700"
                  : "bg-red-50 border-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* SUMMARY */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Total Artikel
                  </p>

                  <p className="mt-2 text-2xl font-bold text-blue-950">
                    {totalArticles}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 5.5A2.5 2.5 0 016.5 3H20v17H6.5A2.5 2.5 0 014 17.5v-12z"
                    />

                    <path
                      strokeLinecap="round"
                      d="M4 17.5A2.5 2.5 0 016.5 15H20"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Aktif
                  </p>

                  <p className="mt-2 text-2xl font-bold text-green-600">
                    {activeArticles}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Nonaktif
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-500">
                    {inactiveArticles}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* FORM */}
          {showForm && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold tracking-wider text-blue-700 uppercase">
                    {editingId !== null
                      ? "Edit Artikel"
                      : "Tambah Artikel"}
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-blue-950">
                    {editingId !== null
                      ? "Perbarui Informasi Artikel"
                      : "Artikel Baru"}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={resetForm}
                  className="w-9 h-9 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition flex items-center justify-center"
                  aria-label="Tutup form"
                >
                  ×
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-6"
              >
                {/* IMAGE */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gambar Artikel
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5">
                    <div className="w-full h-40 rounded-xl border border-dashed border-gray-300 bg-gray-50 overflow-hidden flex items-center justify-center">
                      {gambarPreview ? (
                        <img
                          src={gambarPreview}
                          alt="Preview artikel"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center px-4">
                          <svg
                            className="w-8 h-8 mx-auto text-gray-300"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <rect
                              x="3"
                              y="3"
                              width="18"
                              height="18"
                              rx="2"
                            />

                            <circle
                              cx="8.5"
                              cy="8.5"
                              r="1.5"
                            />

                            <path d="M21 15l-5-5L5 21" />
                          </svg>

                          <p className="mt-2 text-xs text-gray-400">
                            Belum ada gambar
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col justify-center">
                      <input
                        id="article-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />

                      <label
                        htmlFor="article-image"
                        className="inline-flex w-fit items-center justify-center bg-blue-700 hover:bg-blue-800 text-white px-4 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition"
                      >
                        Pilih Gambar
                      </label>

                      {gambarFile && (
                        <p className="mt-3 text-xs text-gray-500 break-all">
                          {gambarFile.name}
                        </p>
                      )}

                      <p className="mt-2 text-xs text-gray-400">
                        Format JPG, PNG, atau WEBP. Maksimal
                        5 MB.
                      </p>
                    </div>
                  </div>
                </div>

                {/* TITLE */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Judul Artikel
                  </label>

                  <input
                    type="text"
                    value={judul}
                    onChange={(e) =>
                      setJudul(e.target.value)
                    }
                    placeholder="Masukkan judul artikel"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>

                {/* CATEGORY + DATE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Kategori
                    </label>

                    <select
                      value={kategori}
                      onChange={(e) =>
                        setKategori(e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    >
                      <option value="">
                        Pilih kategori
                      </option>

                      {categories.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tanggal Publikasi
                    </label>

                    <input
                      type="date"
                      value={tanggal}
                      onChange={(e) =>
                        setTanggal(e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    />
                  </div>
                </div>

                {/* EXCERPT */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ringkasan
                  </label>

                  <textarea
                    value={ringkasan}
                    onChange={(e) =>
                      setRingkasan(e.target.value)
                    }
                    placeholder="Masukkan ringkasan singkat artikel"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>

                {/* CONTENT */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Isi Artikel
                  </label>

                  <textarea
                    value={isi}
                    onChange={(e) =>
                      setIsi(e.target.value)
                    }
                    placeholder="Masukkan isi artikel"
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none resize-y focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>

                {/* STATUS */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setStatus("Aktif")
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                        status === "Aktif"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-white text-gray-500 border-gray-200"
                      }`}
                    >
                      Aktif
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setStatus("Nonaktif")
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                        status === "Nonaktif"
                          ? "bg-gray-100 text-gray-700 border-gray-300"
                          : "bg-white text-gray-500 border-gray-200"
                      }`}
                    >
                      Nonaktif
                    </button>
                  </div>
                </div>

                {/* ACTION */}
                <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={saving}
                    className="px-5 py-3 rounded-lg border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saving
                      ? "Menyimpan..."
                      : editingId !== null
                      ? "Simpan Perubahan"
                      : "Simpan Artikel"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ARTICLE LIST */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <p className="text-xs font-bold tracking-wider text-blue-700 uppercase">
                Data Artikel
              </p>

              <h3 className="mt-1 text-lg font-bold text-blue-950">
                Daftar Artikel
              </h3>
            </div>

            {loading ? (
              <div className="px-6 py-16 text-center">
                <p className="text-sm text-gray-400">
                  Memuat data artikel...
                </p>
              </div>
            ) : articles.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 5.5A2.5 2.5 0 016.5 3H20v17H6.5A2.5 2.5 0 014 17.5v-12z"
                    />

                    <path
                      strokeLinecap="round"
                      d="M4 17.5A2.5 2.5 0 016.5 15H20"
                    />
                  </svg>
                </div>

                <h4 className="mt-4 text-base font-bold text-gray-700">
                  Belum ada artikel
                </h4>

                <p className="mt-1 text-sm text-gray-400">
                  Artikel yang ditambahkan akan tampil di
                  sini.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {articles.map((article) => (
                  <div
                    key={article.id}
                    className="p-6 flex flex-col lg:flex-row gap-5"
                  >
                    {/* IMAGE */}
                    <div className="w-full lg:w-52 h-36 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                      {article.gambar_url ? (
                        <img
                          src={article.gambar_url}
                          alt={article.judul}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-xs text-gray-400">
                            Tidak ada gambar
                          </span>
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                          {article.kategori}
                        </span>

                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            article.status === "Aktif"
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {article.status}
                        </span>
                      </div>

                      <h4 className="mt-3 text-lg font-bold text-blue-950 leading-snug">
                        {article.judul}
                      </h4>

                      <p className="mt-2 text-xs text-gray-400">
                        {article.tanggal}
                      </p>

                      <p className="mt-3 text-sm text-gray-500 leading-6 line-clamp-2">
                        {article.ringkasan}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(article)
                          }
                          className="px-3.5 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleToggleStatus(article)
                          }
                          className="px-3.5 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-xs font-semibold transition"
                        >
                          {article.status === "Aktif"
                            ? "Nonaktifkan"
                            : "Aktifkan"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(article)
                          }
                          className="px-3.5 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold transition"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PREVIEW */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <p className="text-xs font-bold tracking-wider text-blue-700 uppercase">
                Preview Website
              </p>

              <h3 className="mt-1 text-lg font-bold text-blue-950">
                Artikel Aktif
              </h3>

              <p className="mt-1 text-sm text-gray-400">
                Tampilan artikel yang akan ditampilkan kepada
                pengunjung.
              </p>
            </div>

            <div className="p-6">
              {activeArticles === 0 ? (
                <div className="py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-sm text-gray-400">
                    Belum ada artikel aktif untuk
                    ditampilkan.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {articles
                    .filter(
                      (article) =>
                        article.status === "Aktif"
                    )
                    .map((article) => (
                      <div
                        key={article.id}
                        className="rounded-xl border border-gray-200 overflow-hidden bg-white hover:shadow-md transition"
                      >
                        <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                          {article.gambar_url ? (
                            <img
                              src={article.gambar_url}
                              alt={article.judul}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-xs text-gray-400">
                                Tidak ada gambar
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="p-5">
                          <span className="text-xs font-semibold text-blue-700">
                            {article.kategori}
                          </span>

                          <h4 className="mt-2 text-base font-bold text-blue-950 leading-snug line-clamp-2">
                            {article.judul}
                          </h4>

                          <p className="mt-2 text-xs text-gray-400">
                            {article.tanggal}
                          </p>

                          <p className="mt-3 text-sm text-gray-500 leading-6 line-clamp-3">
                            {article.ringkasan}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM ACCENT */}
          <div className="flex items-center justify-center gap-1.5 pt-1 pb-3">
            <span className="w-10 h-1 rounded-full bg-red-500" />
            <span className="w-10 h-1 rounded-full bg-yellow-400" />
            <span className="w-10 h-1 rounded-full bg-blue-700" />
          </div>
        </section>
      </div>
    </main>
  );
}