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
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

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

type GalleryPhoto = {
  id: number;
  galeri_id: number;
  gambar_url: string;
  urutan: number;
  created_at?: string;
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

  // Foto sampul kegiatan
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageName, setImageName] = useState("");
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  // Foto tambahan setiap kegiatan
  const [selectedGallery, setSelectedGallery] = useState<GalleryItem | null>(null);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [deletingPhotoId, setDeletingPhotoId] = useState<number | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    void loadGallery();
    return () => {
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
    // loadGallery hanya dipanggil saat komponen pertama kali dimuat.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function showMessage(text: string, type: "success" | "error" = "success") {
    setMessage(text);
    setMessageType(type);
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    messageTimerRef.current = setTimeout(() => setMessage(""), 5000);
  }

  async function loadGallery() {
    setLoading(true);
    const { data, error } = await supabase
      .from("galeri")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Gagal mengambil data galeri:", error);
      showMessage(`Gagal mengambil data galeri: ${error.message}`, "error");
      setGallery([]);
    } else {
      setGallery((data ?? []) as GalleryItem[]);
    }
    setLoading(false);
  }

  function validateImage(file: File): string | null {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return "Format gambar harus JPG, JPEG, PNG, atau WEBP.";
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return "Ukuran setiap gambar maksimal 5 MB.";
    }
    return null;
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateImage(file);
    if (validationError) {
      showMessage(validationError, "error");
      event.target.value = "";
      return;
    }

    if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImageName(file.name);
    setImagePreview(URL.createObjectURL(file));
  }

  function resetForm() {
    if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setForm(emptyForm);
    setEditingId(null);
    setImageFile(null);
    setImagePreview("");
    setImageName("");
    if (imageInputRef.current) imageInputRef.current.value = "";
  }

  function handleEdit(item: GalleryItem) {
    if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setEditingId(item.id);
    setForm({ judul: item.judul, deskripsi: item.deskripsi, status: item.status });
    setImageFile(null);
    setImageName("");
    setImagePreview(item.gambar_url);
    if (imageInputRef.current) imageInputRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadImage(file: File, folder = "galeri") {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeName = file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "gambar";
    const filePath = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}.${extension}`;

    const { error } = await supabase.storage.from(GALLERY_BUCKET).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });
    if (error) throw new Error(`Gagal upload gambar: ${error.message}`);

    const { data } = supabase.storage.from(GALLERY_BUCKET).getPublicUrl(filePath);
    return { url: data.publicUrl, path: filePath };
  }

  function getStoragePath(imageUrl: string): string | null {
    const marker = `/storage/v1/object/public/${GALLERY_BUCKET}/`;
    const index = imageUrl.indexOf(marker);
    if (index === -1) return null;
    try {
      return decodeURIComponent(imageUrl.substring(index + marker.length));
    } catch {
      return imageUrl.substring(index + marker.length);
    }
  }

  async function deleteStorageImage(imageUrl: string) {
    const path = getStoragePath(imageUrl);
    if (!path) return;
    const { error } = await supabase.storage.from(GALLERY_BUCKET).remove([path]);
    if (error) {
      console.error("Gagal menghapus gambar dari Storage:", error);
      throw new Error(`Data terhapus, tetapi file Storage gagal dihapus: ${error.message}`);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.judul.trim()) return showMessage("Judul galeri wajib diisi.", "error");
    if (!form.deskripsi.trim()) return showMessage("Deskripsi galeri wajib diisi.", "error");
    if (!editingId && !imageFile) return showMessage("Silakan pilih gambar sampul terlebih dahulu.", "error");

    setSaving(true);
    let uploadedCoverUrl = "";
    try {
      const currentItem = editingId ? gallery.find((item) => item.id === editingId) : null;
      let imageUrl = currentItem?.gambar_url ?? "";

      if (imageFile) {
        const uploaded = await uploadImage(imageFile, "galeri");
        imageUrl = uploaded.url;
        uploadedCoverUrl = uploaded.url;
      }

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

        if (error) throw new Error(`Gagal memperbarui data: ${error.message}`);
        if (imageFile && currentItem?.gambar_url && currentItem.gambar_url !== imageUrl) {
          try {
            await deleteStorageImage(currentItem.gambar_url);
          } catch (cleanupError) {
            console.error(cleanupError);
            showMessage("Data berhasil diperbarui, tetapi gambar lama gagal dihapus dari Storage.", "error");
          }
        }
        showMessage("Data galeri berhasil diperbarui.");
      } else {
        const { error } = await supabase.from("galeri").insert({
          judul: form.judul.trim(),
          deskripsi: form.deskripsi.trim(),
          gambar_url: imageUrl,
          status: form.status,
        });
        if (error) throw new Error(`Gagal menambahkan data: ${error.message}`);
        showMessage("Data galeri berhasil ditambahkan.");
      }

      resetForm();
      await loadGallery();
    } catch (error) {
      console.error(error);
      if (uploadedCoverUrl) {
        try { await deleteStorageImage(uploadedCoverUrl); } catch (cleanupError) { console.error(cleanupError); }
      }
      showMessage(error instanceof Error ? error.message : "Terjadi kesalahan.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: GalleryItem) {
    const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus "${item.judul}" beserta seluruh foto tambahannya?`);
    if (!confirmed) return;
    setDeletingId(item.id);

    try {
      // Ambil URL foto tambahan terlebih dahulu agar file Storage dapat ikut dibersihkan.
      const { data: photos, error: photosError } = await supabase
        .from("galeri_foto")
        .select("gambar_url")
        .eq("galeri_id", item.id);
      if (photosError) throw new Error(`Gagal mengambil foto terkait: ${photosError.message}`);

      const { error } = await supabase.from("galeri").delete().eq("id", item.id);
      if (error) throw new Error(`Gagal menghapus data: ${error.message}`);

      const imageUrls = [item.gambar_url, ...(photos ?? []).map((photo) => photo.gambar_url)];
      const paths = imageUrls.map((url) => getStoragePath(url)).filter((path): path is string => Boolean(path));
      if (paths.length > 0) {
        const { error: storageError } = await supabase.storage.from(GALLERY_BUCKET).remove(paths);
        if (storageError) {
          console.error("Gagal membersihkan file Storage:", storageError);
          showMessage("Data galeri terhapus, tetapi sebagian file Storage gagal dibersihkan.", "error");
        } else {
          showMessage("Data galeri dan foto tambahannya berhasil dihapus.");
        }
      } else {
        showMessage("Data galeri berhasil dihapus.");
      }

      if (editingId === item.id) resetForm();
      if (selectedGallery?.id === item.id) closeManagePhotos();
      await loadGallery();
    } catch (error) {
      console.error(error);
      showMessage(error instanceof Error ? error.message : "Gagal menghapus data.", "error");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggleStatus(item: GalleryItem) {
    const newStatus: GalleryStatus = item.status === "Aktif" ? "Nonaktif" : "Aktif";
    const { error } = await supabase
      .from("galeri")
      .update({ status: newStatus, diperbarui_pada: new Date().toISOString() })
      .eq("id", item.id);

    if (error) {
      console.error(error);
      showMessage(`Gagal mengubah status galeri: ${error.message}`, "error");
      return;
    }
    showMessage(`Status "${item.judul}" menjadi ${newStatus}.`);
    await loadGallery();
  }

  // ================= FOTO TAMBAHAN =================

  async function loadGalleryPhotos(galleryId: number) {
    setLoadingPhotos(true);
    const { data, error } = await supabase
      .from("galeri_foto")
      .select("id, galeri_id, gambar_url, urutan, created_at")
      .eq("galeri_id", galleryId)
      .order("urutan", { ascending: true });

    if (error) {
      console.error("Gagal mengambil foto dokumentasi:", error);
      showMessage(`Gagal mengambil foto: ${error.message}`, "error");
      setGalleryPhotos([]);
    } else {
      setGalleryPhotos((data ?? []) as GalleryPhoto[]);
    }
    setLoadingPhotos(false);
  }

  async function handleManagePhotos(item: GalleryItem) {
    clearPhotoSelection();
    setSelectedGallery(item);
    await loadGalleryPhotos(item.id);
  }

  function clearPhotoSelection() {
    photoPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    setPhotoFiles([]);
    setPhotoPreviews([]);
    if (photoInputRef.current) photoInputRef.current.value = "";
  }

  function closeManagePhotos() {
    clearPhotoSelection();
    setSelectedGallery(null);
    setGalleryPhotos([]);
  }

  function handleMultiplePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const invalidFile = files.find((file) => !ALLOWED_IMAGE_TYPES.includes(file.type) || file.size > MAX_IMAGE_SIZE);
    if (invalidFile) {
      showMessage(`${invalidFile.name}: format tidak sesuai atau ukuran melebihi 5 MB.`, "error");
      event.target.value = "";
      return;
    }

    clearPhotoSelection();
    setPhotoFiles(files);
    setPhotoPreviews(files.map((file) => URL.createObjectURL(file)));
  }

  async function handleUploadPhotos() {
    if (!selectedGallery) return showMessage("Pilih kegiatan terlebih dahulu.", "error");
    if (photoFiles.length === 0) return showMessage("Silakan pilih foto terlebih dahulu.", "error");

    setUploadingPhotos(true);
    const uploaded: { url: string; path: string; urutan: number }[] = [];
    try {
      for (let index = 0; index < photoFiles.length; index++) {
        const file = photoFiles[index];
        const uploadedFile = await uploadImage(file, `galeri-foto/${selectedGallery.id}`);
        uploaded.push({
          ...uploadedFile,
          urutan: galleryPhotos.length + index + 1,
        });
      }

      const { error } = await supabase.from("galeri_foto").insert(
        uploaded.map((photo) => ({
          galeri_id: selectedGallery.id,
          gambar_url: photo.url,
          urutan: photo.urutan,
        }))
      );
      if (error) throw new Error(`Gagal menyimpan data foto: ${error.message}`);

      clearPhotoSelection();
      showMessage(`${uploaded.length} foto berhasil ditambahkan.`);
      await loadGalleryPhotos(selectedGallery.id);
    } catch (error) {
      console.error(error);
      // Bersihkan file yang sempat terunggah jika penyimpanan database gagal.
      if (uploaded.length > 0) {
        const paths = uploaded.map((photo) => photo.path);
        const { error: cleanupError } = await supabase.storage.from(GALLERY_BUCKET).remove(paths);
        if (cleanupError) console.error("Gagal membersihkan upload yang tidak tersimpan:", cleanupError);
      }
      showMessage(error instanceof Error ? error.message : "Gagal mengunggah foto.", "error");
    } finally {
      setUploadingPhotos(false);
    }
  }

  async function handleDeletePhoto(photo: GalleryPhoto) {
    const confirmed = window.confirm("Apakah kamu yakin ingin menghapus foto ini?");
    if (!confirmed) return;
    setDeletingPhotoId(photo.id);
    try {
      const { error } = await supabase.from("galeri_foto").delete().eq("id", photo.id);
      if (error) throw new Error(`Gagal menghapus data foto: ${error.message}`);

      try {
        await deleteStorageImage(photo.gambar_url);
      } catch (storageError) {
        console.error(storageError);
        showMessage("Data foto terhapus, tetapi file di Storage gagal dihapus.", "error");
        await loadGalleryPhotos(photo.galeri_id);
        return;
      }

      showMessage("Foto dokumentasi berhasil dihapus.");
      await loadGalleryPhotos(photo.galeri_id);
    } catch (error) {
      console.error(error);
      showMessage(error instanceof Error ? error.message : "Gagal menghapus foto.", "error");
    } finally {
      setDeletingPhotoId(null);
    }
  }

  const totalGallery = gallery.length;
  const activeGallery = gallery.filter((item) => item.status === "Aktif").length;
  const inactiveGallery = gallery.filter((item) => item.status === "Nonaktif").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="lg:ml-64">
        <div className="p-6 lg:p-8">
          {/* HEADER */}
          <div className="mb-8">
            <p className="mb-1 text-sm text-gray-500">Admin Panel / Kelola Galeri</p>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-blue-950">Kelola Galeri</h1>
                <p className="mt-1 text-sm text-gray-500">Kelola dokumentasi galeri perusahaan.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                + Tambah Galeri
              </button>
            </div>
          </div>

          {/* MESSAGE */}
          {message && (
            <div className={`mb-6 rounded-lg border px-4 py-3 text-sm ${messageType === "success" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>
              {message}
            </div>
          )}

          {/* SUMMARY */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <p className="text-sm text-gray-500">Total Galeri</p>
              <p className="mt-2 text-2xl font-bold text-blue-950">{totalGallery}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <p className="text-sm text-gray-500">Galeri Aktif</p>
              <p className="mt-2 text-2xl font-bold text-green-600">{activeGallery}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <p className="text-sm text-gray-500">Galeri Nonaktif</p>
              <p className="mt-2 text-2xl font-bold text-red-500">{inactiveGallery}</p>
            </div>
          </div>

          {/* FORM TAMBAH / EDIT */}
          <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-blue-950">{editingId ? "Edit Galeri" : "Tambah Galeri"}</h2>
                <p className="mt-1 text-sm text-gray-500">Gambar sampul disimpan di Supabase Storage dan data disimpan di database.</p>
              </div>
              {editingId && (
                <button type="button" onClick={resetForm} className="text-sm font-semibold text-gray-500 hover:text-gray-700">
                  Batal Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* GAMBAR SAMPUL */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Gambar Sampul</label>
                  <div className="rounded-xl border-2 border-dashed border-gray-200 p-4">
                    {imagePreview ? (
                      <div className="relative">
                        <img src={imagePreview} alt="Preview sampul galeri" className="h-64 w-full rounded-lg object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
                            setImageFile(null);
                            setImageName("");
                            const currentItem = editingId ? gallery.find((item) => item.id === editingId) : null;
                            setImagePreview(currentItem?.gambar_url || "");
                            if (imageInputRef.current) imageInputRef.current.value = "";
                          }}
                          className="absolute right-3 top-3 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-red-600 shadow"
                        >
                          Hapus Pilihan
                        </button>
                      </div>
                    ) : (
                      <label className="flex h-64 cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-50 transition hover:bg-gray-100">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-2xl text-blue-700">+</div>
                        <p className="text-sm font-semibold text-gray-700">Pilih gambar sampul</p>
                        <p className="mt-1 text-xs text-gray-400">JPG, PNG, WEBP maksimal 5 MB</p>
                        <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="hidden" />
                      </label>
                    )}
                    {imageName && <p className="mt-3 truncate text-xs text-gray-500">File: {imageName}</p>}
                  </div>
                </div>

                {/* FORM DATA */}
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">Judul</label>
                    <input
                      type="text"
                      value={form.judul}
                      onChange={(event) => setForm({ ...form, judul: event.target.value })}
                      placeholder="Masukkan judul galeri"
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">Deskripsi</label>
                    <textarea
                      value={form.deskripsi}
                      onChange={(event) => setForm({ ...form, deskripsi: event.target.value })}
                      placeholder="Masukkan deskripsi galeri"
                      rows={6}
                      className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">Status</label>
                    <select
                      value={form.status}
                      onChange={(event) => setForm({ ...form, status: event.target.value as GalleryStatus })}
                      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Nonaktif">Nonaktif</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-6">
                <button type="button" onClick={resetForm} className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50">
                  Reset
                </button>
                <button type="submit" disabled={saving} className="rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300">
                  {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Galeri"}
                </button>
              </div>
            </form>
          </div>

          {/* DATA GALERI */}
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
            <div className="border-b border-gray-100 p-6">
              <h2 className="text-lg font-bold text-blue-950">Data Galeri</h2>
              <p className="mt-1 text-sm text-gray-500">Kelola kegiatan dan foto dokumentasi tambahan.</p>
            </div>

            {loading ? (
              <div className="p-10 text-center text-sm text-gray-500">Memuat data galeri...</div>
            ) : gallery.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-sm font-semibold text-gray-600">Belum ada data galeri.</p>
                <p className="mt-1 text-sm text-gray-400">Tambahkan galeri melalui form di atas.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {gallery.map((item) => (
                  <div key={item.id} className="flex flex-col gap-5 p-6 xl:flex-row">
                    <img src={item.gambar_url} alt={item.judul} className="h-40 w-full shrink-0 rounded-xl bg-gray-100 object-cover xl:w-48" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-bold text-blue-950">{item.judul}</h3>
                          <p className="mt-2 text-sm leading-6 text-gray-500">{item.deskripsi}</p>
                        </div>
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.status === "Aktif" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="mt-5 flex flex-wrap items-center gap-2">
                        <button type="button" onClick={() => void handleManagePhotos(item)} className="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-100">
                          Kelola Foto
                        </button>
                        <button type="button" onClick={() => void handleToggleStatus(item)} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50">
                          {item.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
                        </button>
                        <button type="button" onClick={() => handleEdit(item)} className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100">
                          Edit
                        </button>
                        <button type="button" onClick={() => void handleDelete(item)} disabled={deletingId === item.id} className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50">
                          {deletingId === item.id ? "Menghapus..." : "Hapus"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PREVIEW GALERI AKTIF */}
          {gallery.some((item) => item.status === "Aktif") && (
            <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-blue-950">Preview Galeri Aktif</h2>
                <p className="mt-1 text-sm text-gray-500">Hanya galeri dengan status Aktif yang ditampilkan.</p>
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {gallery.filter((item) => item.status === "Aktif").map((item) => (
                  <div key={item.id} className="overflow-hidden rounded-xl border border-gray-100">
                    <img src={item.gambar_url} alt={item.judul} className="h-48 w-full object-cover" />
                    <div className="p-4">
                      <h3 className="font-bold text-blue-950">{item.judul}</h3>
                      <p className="mt-2 text-sm leading-6 text-gray-500">{item.deskripsi}</p>
                      <button type="button" onClick={() => void handleManagePhotos(item)} className="mt-4 text-sm font-semibold text-blue-700 hover:text-blue-900">
                        Kelola foto kegiatan →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AKSEN */}
          <div className="mt-10 flex justify-center gap-2 pb-4">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            <span className="h-3 w-3 rounded-full bg-blue-700" />
            <span className="h-3 w-3 rounded-full bg-yellow-400" />
          </div>
        </div>
      </main>

      {/* MODAL KELOLA FOTO */}
      {selectedGallery && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" onMouseDown={(event) => {
          if (event.target === event.currentTarget && !uploadingPhotos) closeManagePhotos();
        }}>
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white p-5 md:p-6">
              <div>
                <h2 className="text-lg font-bold text-blue-950">Kelola Foto Kegiatan</h2>
                <p className="mt-1 text-sm text-gray-500">{selectedGallery.judul}</p>
              </div>
              <button type="button" onClick={closeManagePhotos} disabled={uploadingPhotos} aria-label="Tutup" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50">
                ✕
              </button>
            </div>

            <div className="space-y-7 p-5 md:p-6">
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-sm font-semibold text-blue-900">Informasi</p>
                <p className="mt-1 text-sm leading-6 text-blue-700">Foto yang diunggah akan ditampilkan pada halaman detail kegiatan di website publik. Foto sampul utama tetap dikelola melalui form Galeri.</p>
              </div>

              {/* UPLOAD FOTO */}
              <section>
                <div className="mb-3">
                  <h3 className="font-bold text-blue-950">Tambahkan Foto Dokumentasi</h3>
                  <p className="mt-1 text-xs text-gray-500">Pilih beberapa foto sekaligus. Format JPG, PNG, WEBP, maksimal 5 MB per foto.</p>
                </div>
                <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 text-center transition hover:border-blue-400 hover:bg-blue-50">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-2xl text-blue-700">+</div>
                  <p className="text-sm font-semibold text-gray-700">Klik untuk memilih foto</p>
                  <p className="mt-1 text-xs text-gray-400">Bisa memilih lebih dari satu gambar</p>
                  <input ref={photoInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleMultiplePhotoChange} className="hidden" />
                </label>

                {photoPreviews.length > 0 && (
                  <div className="mt-5">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-700">Foto yang akan diunggah</p>
                      <span className="text-xs font-semibold text-blue-700">{photoPreviews.length} foto</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                      {photoPreviews.map((preview, index) => (
                        <div key={preview} className="overflow-hidden rounded-xl border border-gray-100">
                          <img src={preview} alt={`Preview foto ${index + 1}`} className="h-28 w-full object-cover" />
                          <div className="bg-gray-50 px-2 py-2"><p className="truncate text-xs text-gray-500">{photoFiles[index]?.name}</p></div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button type="button" onClick={clearPhotoSelection} disabled={uploadingPhotos} className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50">Batal Pilih</button>
                      <button type="button" onClick={() => void handleUploadPhotos()} disabled={uploadingPhotos} className="flex-1 rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300">
                        {uploadingPhotos ? "Mengunggah Foto..." : `Upload ${photoFiles.length} Foto`}
                      </button>
                    </div>
                  </div>
                )}
              </section>

              {/* FOTO TERSIMPAN */}
              <section className="border-t border-gray-100 pt-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-blue-950">Foto Dokumentasi</h3>
                    <p className="mt-1 text-xs text-gray-500">Foto tambahan yang sudah tersimpan.</p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{galleryPhotos.length} Foto</span>
                </div>

                {loadingPhotos ? (
                  <div className="py-12 text-center text-sm text-gray-500">Memuat foto dokumentasi...</div>
                ) : galleryPhotos.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-5 py-12 text-center">
                    <p className="font-semibold text-gray-600">Belum ada foto tambahan.</p>
                    <p className="mt-2 text-sm text-gray-400">Silakan unggah foto dokumentasi kegiatan.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {galleryPhotos.map((photo) => (
                      <div key={photo.id} className="group overflow-hidden rounded-xl border border-gray-100 bg-white">
                        <div className="relative">
                          <img src={photo.gambar_url} alt={selectedGallery.judul} className="h-32 w-full object-cover" />
                          <button type="button" onClick={() => void handleDeletePhoto(photo)} disabled={deletingPhotoId === photo.id || uploadingPhotos} className="absolute right-2 top-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white opacity-100 shadow transition hover:bg-red-700 disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100">
                            {deletingPhotoId === photo.id ? "Menghapus..." : "Hapus"}
                          </button>
                        </div>
                        <div className="p-3"><p className="text-xs font-medium text-gray-500">Foto Dokumentasi</p></div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <div className="flex justify-end border-t border-gray-100 bg-gray-50 p-5">
              <button type="button" onClick={closeManagePhotos} disabled={uploadingPhotos} className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 disabled:opacity-50">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
