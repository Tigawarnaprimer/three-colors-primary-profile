"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { supabase } from "@/lib/supabase";

const GALLERY_BUCKET = "galeri";

type GalleryStatus = "Aktif" | "Nonaktif";

type GalleryItem = {
  id: number;
  judul: string;
  deskripsi: string;
  gambar_url: string;
  status: GalleryStatus;
  dibuat_pada: string;
  diperbarui_pada: string;
};

const emptyForm = {
  judul: "",
  deskripsi: "",
  status: "Aktif" as GalleryStatus,
};

export default function AdminGaleriPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [form, setForm] = useState(emptyForm);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageName, setImageName] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadGallery();
  }, []);

  async function loadGallery() {
    setLoading(true);

    const { data, error } = await supabase
      .from("galeri")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Gagal mengambil data galeri:", error);
      showMessage("Gagal mengambil data galeri.", "error");
      setGallery([]);
    } else {
      setGallery((data ?? []) as GalleryItem[]);
    }

    setLoading(false);
  }

  function showMessage(
    text: string,
    type: "success" | "error" = "success"
  ) {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 4000);
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      showMessage(
        "Format gambar harus JPG, JPEG, PNG, atau WEBP.",
        "error"
      );

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showMessage("Ukuran gambar maksimal 5 MB.", "error");

      event.target.value = "";
      return;
    }

    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setImageName(file.name);
    setImagePreview(URL.createObjectURL(file));
  }

  function resetForm() {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setForm(emptyForm);
    setEditingId(null);
    setImageFile(null);
    setImagePreview("");
    setImageName("");

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }

  function handleEdit(item: GalleryItem) {
    setEditingId(item.id);

    setForm({
      judul: item.judul,
      deskripsi: item.deskripsi,
      status: item.status,
    });

    setImageFile(null);
    setImageName("");
    setImagePreview(item.gambar_url);

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function uploadImage(file: File) {
    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const safeName = file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const filePath = `galeri/${Date.now()}-${safeName}.${extension}`;

    const { error } = await supabase.storage
      .from(GALLERY_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      throw new Error(
        `Gagal upload gambar: ${error.message}`
      );
    }

    const { data } = supabase.storage
      .from(GALLERY_BUCKET)
      .getPublicUrl(filePath);

    return {
      url: data.publicUrl,
      path: filePath,
    };
  }

  function getStoragePath(imageUrl: string) {
    const marker =
      `/storage/v1/object/public/${GALLERY_BUCKET}/`;

    const index = imageUrl.indexOf(marker);

    if (index === -1) {
      return null;
    }

    return decodeURIComponent(
      imageUrl.substring(index + marker.length)
    );
  }

  async function deleteStorageImage(imageUrl: string) {
    const path = getStoragePath(imageUrl);

    if (!path) return;

    const { error } = await supabase.storage
      .from(GALLERY_BUCKET)
      .remove([path]);

    if (error) {
      console.error(
        "Gagal menghapus gambar dari Storage:",
        error
      );
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!form.judul.trim()) {
      showMessage("Judul galeri wajib diisi.", "error");
      return;
    }

    if (!form.deskripsi.trim()) {
      showMessage("Deskripsi galeri wajib diisi.", "error");
      return;
    }

    if (!editingId && !imageFile) {
      showMessage("Silakan pilih gambar terlebih dahulu.", "error");
      return;
    }

    setSaving(true);

    try {
      let imageUrl = "";

      const currentItem = editingId
        ? gallery.find((item) => item.id === editingId)
        : null;

      /*
       * Jika ada gambar baru, upload ke Supabase Storage.
       * Jika sedang edit dan tidak memilih gambar baru,
       * gunakan gambar lama.
       */
      if (imageFile) {
        const uploaded = await uploadImage(imageFile);
        imageUrl = uploaded.url;
      } else if (currentItem) {
        imageUrl = currentItem.gambar_url;
      }

      /*
       * EDIT DATA
       */
      if (editingId) {
        const { error } = await supabase
          .from("galeri")
          .update({
            judul: form.judul.trim(),
            deskripsi: form.deskripsi.trim(),
            gambar_url: imageUrl,
            status: form.status,
            diperbarui_pada: new Date().toISOString(),
          })
          .eq("id", editingId);

        if (error) {
          throw new Error(
            `Gagal memperbarui data: ${error.message}`
          );
        }

        /*
         * Jika gambar diganti, hapus gambar lama
         * dari Supabase Storage.
         */
        if (
          imageFile &&
          currentItem &&
          currentItem.gambar_url !== imageUrl
        ) {
          await deleteStorageImage(currentItem.gambar_url);
        }

        showMessage("Data galeri berhasil diperbarui.");
      }

      /*
       * TAMBAH DATA
       */
      else {
        const { error } = await supabase
          .from("galeri")
          .insert({
            judul: form.judul.trim(),
            deskripsi: form.deskripsi.trim(),
            gambar_url: imageUrl,
            status: form.status,
          });

        if (error) {
          /*
           * Jika database gagal menyimpan,
           * gambar yang sudah ter-upload dihapus
           * agar tidak menjadi file yatim di Storage.
           */
          if (imageUrl) {
            await deleteStorageImage(imageUrl);
          }

          throw new Error(
            `Gagal menambahkan data: ${error.message}`
          );
        }

        showMessage("Data galeri berhasil ditambahkan.");
      }

      resetForm();
      await loadGallery();
    } catch (error) {
      console.error(error);

      showMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: GalleryItem) {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus "${item.judul}"?`
    );

    if (!confirmed) return;

    setDeletingId(item.id);

    try {
      const { error } = await supabase
        .from("galeri")
        .delete()
        .eq("id", item.id);

      if (error) {
        throw new Error(
          `Gagal menghapus data: ${error.message}`
        );
      }

      /*
       * Hapus gambar dari Supabase Storage.
       */
      await deleteStorageImage(item.gambar_url);

      if (editingId === item.id) {
        resetForm();
      }

      showMessage("Data galeri berhasil dihapus.");

      await loadGallery();
    } catch (error) {
      console.error(error);

      showMessage(
        error instanceof Error
          ? error.message
          : "Gagal menghapus data.",
        "error"
      );
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggleStatus(item: GalleryItem) {
    const newStatus: GalleryStatus =
      item.status === "Aktif" ? "Nonaktif" : "Aktif";

    const { error } = await supabase
      .from("galeri")
      .update({
        status: newStatus,
        diperbarui_pada: new Date().toISOString(),
      })
      .eq("id", item.id);

    if (error) {
      console.error(error);
      showMessage(
        "Gagal mengubah status galeri.",
        "error"
      );
      return;
    }

    showMessage(
      `Status "${item.judul}" menjadi ${newStatus}.`
    );

    await loadGallery();
  }

  const totalGallery = gallery.length;

  const activeGallery = gallery.filter(
    (item) => item.status === "Aktif"
  ).length;

  const inactiveGallery = gallery.filter(
    (item) => item.status === "Nonaktif"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="lg:ml-64">
        <div className="p-6 lg:p-8">

          {/* HEADER */}
          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-1">
              Admin Panel / Kelola Galeri
            </p>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-blue-950">
                  Kelola Galeri
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Kelola dokumentasi galeri perusahaan.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  resetForm();

                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
                className="inline-flex items-center justify-center bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-lg text-sm font-semibold transition"
              >
                + Tambah Galeri
              </button>
            </div>
          </div>

          {/* MESSAGE */}
          {message && (
            <div
              className={`mb-6 px-4 py-3 rounded-lg text-sm border ${
                messageType === "success"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {message}
            </div>
          )}

          {/* SUMMARY */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-sm text-gray-500">
                Total Galeri
              </p>

              <p className="mt-2 text-2xl font-bold text-blue-950">
                {totalGallery}
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-sm text-gray-500">
                Galeri Aktif
              </p>

              <p className="mt-2 text-2xl font-bold text-green-600">
                {activeGallery}
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-sm text-gray-500">
                Galeri Nonaktif
              </p>

              <p className="mt-2 text-2xl font-bold text-red-500">
                {inactiveGallery}
              </p>
            </div>
          </div>

          {/* FORM */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-blue-950">
                  {editingId
                    ? "Edit Galeri"
                    : "Tambah Galeri"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Gambar disimpan di Supabase Storage dan data
                  disimpan di database.
                </p>
              </div>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-sm font-semibold text-gray-500 hover:text-gray-700"
                >
                  Batal Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* GAMBAR */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gambar
                  </label>

                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-64 object-cover rounded-lg"
                        />

                        <button
                          type="button"
                          onClick={() => {
                            if (
                              imagePreview.startsWith("blob:")
                            ) {
                              URL.revokeObjectURL(
                                imagePreview
                              );
                            }

                            setImageFile(null);
                            setImageName("");

                            if (editingId) {
                              const currentItem =
                                gallery.find(
                                  (item) =>
                                    item.id === editingId
                                );

                              setImagePreview(
                                currentItem?.gambar_url || ""
                              );
                            } else {
                              setImagePreview("");
                            }

                            if (imageInputRef.current) {
                              imageInputRef.current.value = "";
                            }
                          }}
                          className="absolute top-3 right-3 bg-white/95 text-red-600 px-3 py-1.5 rounded-lg text-xs font-semibold shadow"
                        >
                          Hapus Pilihan
                        </button>
                      </div>
                    ) : (
                      <label className="h-64 flex flex-col items-center justify-center cursor-pointer rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
                          +
                        </div>

                        <p className="text-sm font-semibold text-gray-700">
                          Pilih gambar
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          JPG, PNG, WEBP maksimal 5 MB
                        </p>

                        <input
                          ref={imageInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}

                    {imageName && (
                      <p className="mt-3 text-xs text-gray-500 truncate">
                        File: {imageName}
                      </p>
                    )}
                  </div>
                </div>

                {/* FORM DATA */}
                <div className="space-y-5">

                  {/* JUDUL */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Judul
                    </label>

                    <input
                      type="text"
                      value={form.judul}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          judul: e.target.value,
                        })
                      }
                      placeholder="Masukkan judul galeri"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm"
                    />
                  </div>

                  {/* DESKRIPSI */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Deskripsi
                    </label>

                    <textarea
                      value={form.deskripsi}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          deskripsi: e.target.value,
                        })
                      }
                      placeholder="Masukkan deskripsi galeri"
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm resize-none"
                    />
                  </div>

                  {/* STATUS */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status
                    </label>

                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          status:
                            e.target.value as GalleryStatus,
                        })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm bg-white"
                    >
                      <option value="Aktif">
                        Aktif
                      </option>

                      <option value="Nonaktif">
                        Nonaktif
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* BUTTON */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-3 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                >
                  Reset
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-lg bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 text-white text-sm font-semibold transition"
                >
                  {saving
                    ? "Menyimpan..."
                    : editingId
                    ? "Simpan Perubahan"
                    : "Tambah Galeri"}
                </button>
              </div>
            </form>
          </div>

          {/* DATA GALERI */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-blue-950">
                Data Galeri
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Data diambil langsung dari Supabase.
              </p>
            </div>

            {loading ? (
              <div className="p-10 text-center text-sm text-gray-500">
                Memuat data galeri...
              </div>
            ) : gallery.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-sm font-semibold text-gray-600">
                  Belum ada data galeri.
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  Tambahkan galeri melalui form di atas.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {gallery.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 flex flex-col xl:flex-row gap-5"
                  >
                    <img
                      src={item.gambar_url}
                      alt={item.judul}
                      className="w-full xl:w-48 h-40 object-cover rounded-xl shrink-0 bg-gray-100"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-bold text-blue-950">
                            {item.judul}
                          </h3>

                          <p className="text-sm text-gray-500 mt-2 leading-6">
                            {item.deskripsi}
                          </p>
                        </div>

                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            item.status === "Aktif"
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-5">
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleStatus(item)
                          }
                          className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
                        >
                          {item.status === "Aktif"
                            ? "Nonaktifkan"
                            : "Aktifkan"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(item)
                          }
                          className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(item)
                          }
                          disabled={
                            deletingId === item.id
                          }
                          className="px-3 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 disabled:opacity-50 transition"
                        >
                          {deletingId === item.id
                            ? "Menghapus..."
                            : "Hapus"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PREVIEW */}
          {gallery.some(
            (item) => item.status === "Aktif"
          ) && (
            <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-blue-950">
                  Preview Galeri Aktif
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Hanya galeri dengan status Aktif yang
                  ditampilkan.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {gallery
                  .filter(
                    (item) => item.status === "Aktif"
                  )
                  .map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-100 rounded-xl overflow-hidden"
                    >
                      <img
                        src={item.gambar_url}
                        alt={item.judul}
                        className="w-full h-48 object-cover"
                      />

                      <div className="p-4">
                        <h3 className="font-bold text-blue-950">
                          {item.judul}
                        </h3>

                        <p className="text-sm text-gray-500 mt-2 leading-6">
                          {item.deskripsi}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ACCENT */}
          <div className="flex justify-center gap-2 mt-10 pb-4">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-blue-700" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
          </div>
        </div>
      </main>
    </div>
  );
}