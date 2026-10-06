"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { supabase } from "@/lib/supabase";

type TentangKamiData = {
  id: number;
  profil_judul: string;
  profil_deskripsi_1: string;
  profil_deskripsi_2: string;
  focus_judul: string;
  focus_deskripsi: string;
  focus_quality_judul: string;
  focus_quality_deskripsi: string;
  focus_solution_judul: string;
  focus_solution_deskripsi: string;
  video_url: string | null;
  updated_at?: string | null;
};

export default function AdminTentangKami() {
  const [dataId, setDataId] = useState<number | null>(null);

  const [profilJudul, setProfilJudul] = useState("");
  const [profilDeskripsi1, setProfilDeskripsi1] = useState("");
  const [profilDeskripsi2, setProfilDeskripsi2] = useState("");

  const [focusJudul, setFocusJudul] = useState("");
  const [focusDeskripsi, setFocusDeskripsi] = useState("");

  const [qualityJudul, setQualityJudul] = useState("");
  const [qualityDeskripsi, setQualityDeskripsi] = useState("");

  const [solutionJudul, setSolutionJudul] = useState("");
  const [solutionDeskripsi, setSolutionDeskripsi] = useState("");

  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState("");

  useEffect(() => {
    fetchTentangKami();
  }, []);

  async function fetchTentangKami() {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("tentang_kami")
      .select(
        `
        id,
        profil_judul,
        profil_deskripsi_1,
        profil_deskripsi_2,
        focus_judul,
        focus_deskripsi,
        focus_quality_judul,
        focus_quality_deskripsi,
        focus_solution_judul,
        focus_solution_deskripsi,
        video_url,
        updated_at
        `
      )
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Gagal mengambil data tentang kami:", error);

      setErrorMessage(
        `Data Tentang Kami gagal dimuat: ${error.message}`
      );

      setLoading(false);
      return;
    }

    if (!data) {
      setErrorMessage(
        "Data Tentang Kami belum tersedia di database."
      );

      setLoading(false);
      return;
    }

    const tentangKami = data as TentangKamiData;

    setDataId(tentangKami.id);

    setProfilJudul(tentangKami.profil_judul);
    setProfilDeskripsi1(tentangKami.profil_deskripsi_1);
    setProfilDeskripsi2(tentangKami.profil_deskripsi_2);

    setFocusJudul(tentangKami.focus_judul);
    setFocusDeskripsi(tentangKami.focus_deskripsi);

    setQualityJudul(tentangKami.focus_quality_judul);
    setQualityDeskripsi(tentangKami.focus_quality_deskripsi);

    setSolutionJudul(tentangKami.focus_solution_judul);
    setSolutionDeskripsi(tentangKami.focus_solution_deskripsi);

    setVideoUrl(tentangKami.video_url || "");
    setVideoPreview(tentangKami.video_url || "");

    setLoading(false);
  }

  function handleVideoChange(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.includes("video/mp4")) {
      setErrorMessage(
        "Format video harus MP4."
      );

      e.target.value = "";
      return;
    }

    const maxSize = 100 * 1024 * 1024;

    if (file.size > maxSize) {
      setErrorMessage(
        "Ukuran video maksimal 100 MB."
      );

      e.target.value = "";
      return;
    }

    setErrorMessage("");
    setVideoFile(file);

    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);
  }

  async function uploadVideo() {
    if (!videoFile) {
      return videoUrl;
    }

    setUploadProgress("Mengupload video...");

    const fileExtension = "mp4";

    const fileName = `video-profil-${Date.now()}.${fileExtension}`;

    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from("tentang-kami")
      .upload(filePath, videoFile, {
        cacheControl: "3600",
        upsert: false,
        contentType: "video/mp4",
      });

    if (uploadError) {
      console.error(
        "Gagal upload video:",
        uploadError
      );

      throw new Error(
        `Gagal upload video: ${uploadError.message}`
      );
    }

    const {
      data: publicUrlData,
    } = supabase.storage
      .from("tentang-kami")
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      throw new Error(
        "URL video tidak berhasil dibuat."
      );
    }

    setUploadProgress("Video berhasil diupload.");

    return publicUrlData.publicUrl;
  }

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!dataId) {
      setErrorMessage(
        "ID data Tentang Kami tidak ditemukan."
      );
      return;
    }

    setSaving(true);
    setSaved(false);
    setErrorMessage("");
    setUploadProgress("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error(
          "Gagal mendapatkan user:",
          userError
        );

        setErrorMessage(
          `Gagal memeriksa sesi login: ${userError.message}`
        );

        return;
      }

      if (!user) {
        setErrorMessage(
          "Sesi login admin tidak ditemukan. Silakan login kembali."
        );

        return;
      }

      let finalVideoUrl = videoUrl;

      if (videoFile) {
        finalVideoUrl = await uploadVideo();
      }

      const updatePayload = {
        profil_judul: profilJudul.trim(),
        profil_deskripsi_1: profilDeskripsi1.trim(),
        profil_deskripsi_2: profilDeskripsi2.trim(),

        focus_judul: focusJudul.trim(),
        focus_deskripsi: focusDeskripsi.trim(),

        focus_quality_judul: qualityJudul.trim(),
        focus_quality_deskripsi:
          qualityDeskripsi.trim(),

        focus_solution_judul:
          solutionJudul.trim(),
        focus_solution_deskripsi:
          solutionDeskripsi.trim(),

        video_url: finalVideoUrl || null,

        updated_at: new Date().toISOString(),
      };

      const {
        data,
        error,
      } = await supabase
        .from("tentang_kami")
        .update(updatePayload)
        .eq("id", dataId)
        .select()
        .single();

      if (error) {
        console.error(
          "Gagal menyimpan Tentang Kami:",
          error
        );

        setErrorMessage(
          `Gagal menyimpan data: ${error.message}`
        );

        return;
      }

      if (!data) {
        setErrorMessage(
          "Data Tentang Kami tidak berhasil diperbarui."
        );

        return;
      }

      const updatedData =
        data as TentangKamiData;

      setDataId(updatedData.id);

      setProfilJudul(
        updatedData.profil_judul
      );

      setProfilDeskripsi1(
        updatedData.profil_deskripsi_1
      );

      setProfilDeskripsi2(
        updatedData.profil_deskripsi_2
      );

      setFocusJudul(
        updatedData.focus_judul
      );

      setFocusDeskripsi(
        updatedData.focus_deskripsi
      );

      setQualityJudul(
        updatedData.focus_quality_judul
      );

      setQualityDeskripsi(
        updatedData.focus_quality_deskripsi
      );

      setSolutionJudul(
        updatedData.focus_solution_judul
      );

      setSolutionDeskripsi(
        updatedData.focus_solution_deskripsi
      );

      setVideoUrl(
        updatedData.video_url || ""
      );

      setVideoPreview(
        updatedData.video_url || ""
      );

      setVideoFile(null);
      setUploadProgress("");

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (error) {
      console.error(
        "ERROR TIDAK TERDUGA:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menyimpan data."
      );
    } finally {
      setSaving(false);
    }
  }

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
                Kelola Tentang Kami
              </h1>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <section className="px-6 lg:px-8 py-8 max-w-6xl">

          {/* INTRO */}
          <div className="mb-7">
            <p className="text-xs font-bold tracking-[0.18em] text-blue-700 uppercase">
              Konten Website
            </p>

            <h2 className="mt-2 text-2xl md:text-3xl font-bold text-blue-950">
              Tentang Kami
            </h2>

            <p className="mt-2 text-sm text-gray-500 max-w-2xl">
              Kelola informasi profil perusahaan,
              fokus perusahaan, dan video profil
              yang ditampilkan pada halaman Tentang
              Kami.
            </p>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
              <p className="text-sm font-medium text-blue-700">
                Memuat data Tentang Kami...
              </p>
            </div>
          )}

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
                  Data Tentang Kami berhasil
                  diperbarui.
                </p>
              </div>
            </div>
          )}

          {/* ERROR */}
          {errorMessage && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <div className="w-7 h-7 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                !
              </div>

              <div>
                <p className="text-sm font-semibold text-red-800">
                  Terjadi kesalahan
                </p>

                <p className="text-xs text-red-700 mt-0.5">
                  {errorMessage}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* PROFIL PERUSAHAAN */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

              <div className="px-6 md:px-8 py-5 border-b border-gray-200">
                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        d="M4 21V4h16v17"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <path
                        d="M8 8h2M14 8h2M8 12h2M14 12h2M8 16h2M14 16h2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <div>
                    <h3 className="font-bold text-blue-950">
                      Profil Perusahaan
                    </h3>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Informasi utama mengenai perusahaan.
                    </p>
                  </div>

                </div>
              </div>

              <div className="p-6 md:p-8">

                {/* JUDUL */}
                <div>
                  <label
                    htmlFor="profilJudul"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Judul Profil
                  </label>

                  <input
                    id="profilJudul"
                    type="text"
                    value={profilJudul}
                    onChange={(e) =>
                      setProfilJudul(e.target.value)
                    }
                    placeholder="Solusi warna untuk kebutuhan industri tekstil"
                    disabled={loading || saving}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* DESKRIPSI 1 */}
                <div className="mt-6">
                  <label
                    htmlFor="profilDeskripsi1"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Deskripsi Profil 1
                  </label>

                  <textarea
                    id="profilDeskripsi1"
                    value={profilDeskripsi1}
                    onChange={(e) =>
                      setProfilDeskripsi1(
                        e.target.value
                      )
                    }
                    rows={5}
                    placeholder="Masukkan deskripsi perusahaan..."
                    disabled={loading || saving}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* DESKRIPSI 2 */}
                <div className="mt-6">
                  <label
                    htmlFor="profilDeskripsi2"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Deskripsi Profil 2
                  </label>

                  <textarea
                    id="profilDeskripsi2"
                    value={profilDeskripsi2}
                    onChange={(e) =>
                      setProfilDeskripsi2(
                        e.target.value
                      )
                    }
                    rows={5}
                    placeholder="Masukkan deskripsi lanjutan perusahaan..."
                    disabled={loading || saving}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

              </div>
            </div>

            {/* OUR FOCUS */}
            <div className="mt-6 bg-white border border-gray-200 rounded-2xl overflow-hidden">

              <div className="px-6 md:px-8 py-5 border-b border-gray-200">
                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="8"
                      />

                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                      />
                    </svg>
                  </div>

                  <div>
                    <h3 className="font-bold text-blue-950">
                      Our Focus
                    </h3>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Kelola fokus dan nilai utama perusahaan.
                    </p>
                  </div>

                </div>
              </div>

              <div className="p-6 md:p-8">

                {/* FOCUS JUDUL */}
                <div>
                  <label
                    htmlFor="focusJudul"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Judul Our Focus
                  </label>

                  <input
                    id="focusJudul"
                    type="text"
                    value={focusJudul}
                    onChange={(e) =>
                      setFocusJudul(e.target.value)
                    }
                    placeholder="Textile Dye & Chemical Specialist"
                    disabled={loading || saving}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* FOCUS DESKRIPSI */}
                <div className="mt-6">
                  <label
                    htmlFor="focusDeskripsi"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Deskripsi Our Focus
                  </label>

                  <textarea
                    id="focusDeskripsi"
                    value={focusDeskripsi}
                    onChange={(e) =>
                      setFocusDeskripsi(
                        e.target.value
                      )
                    }
                    rows={4}
                    placeholder="Deskripsi fokus perusahaan..."
                    disabled={loading || saving}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* QUALITY & SOLUTION */}
                <div className="grid md:grid-cols-2 gap-6 mt-6">

                  {/* QUALITY */}
                  <div className="border border-gray-200 rounded-xl p-5">

                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                        <span className="font-bold">
                          Q
                        </span>
                      </div>

                      <h4 className="font-bold text-blue-950">
                        Quality
                      </h4>
                    </div>

                    <label
                      htmlFor="qualityJudul"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Judul
                    </label>

                    <input
                      id="qualityJudul"
                      type="text"
                      value={qualityJudul}
                      onChange={(e) =>
                        setQualityJudul(
                          e.target.value
                        )
                      }
                      placeholder="Quality"
                      disabled={loading || saving}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />

                    <label
                      htmlFor="qualityDeskripsi"
                      className="block text-sm font-semibold text-gray-700 mt-5 mb-2"
                    >
                      Deskripsi
                    </label>

                    <textarea
                      id="qualityDeskripsi"
                      value={qualityDeskripsi}
                      onChange={(e) =>
                        setQualityDeskripsi(
                          e.target.value
                        )
                      }
                      rows={3}
                      placeholder="Fokus pada kualitas produk"
                      disabled={loading || saving}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />

                  </div>

                  {/* SOLUTION */}
                  <div className="border border-gray-200 rounded-xl p-5">

                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-8 h-8 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center">
                        <span className="font-bold">
                          S
                        </span>
                      </div>

                      <h4 className="font-bold text-blue-950">
                        Solution
                      </h4>
                    </div>

                    <label
                      htmlFor="solutionJudul"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Judul
                    </label>

                    <input
                      id="solutionJudul"
                      type="text"
                      value={solutionJudul}
                      onChange={(e) =>
                        setSolutionJudul(
                          e.target.value
                        )
                      }
                      placeholder="Solution"
                      disabled={loading || saving}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />

                    <label
                      htmlFor="solutionDeskripsi"
                      className="block text-sm font-semibold text-gray-700 mt-5 mb-2"
                    >
                      Deskripsi
                    </label>

                    <textarea
                      id="solutionDeskripsi"
                      value={solutionDeskripsi}
                      onChange={(e) =>
                        setSolutionDeskripsi(
                          e.target.value
                        )
                      }
                      rows={3}
                      placeholder="Solusi sesuai kebutuhan"
                      disabled={loading || saving}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />

                  </div>

                </div>

              </div>
            </div>

            {/* VIDEO PROFIL */}
            <div className="mt-6 bg-white border border-gray-200 rounded-2xl overflow-hidden">

              <div className="px-6 md:px-8 py-5 border-b border-gray-200">
                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="2"
                      />

                      <path
                        d="m10 9 5 3-5 3V9Z"
                        fill="currentColor"
                        stroke="none"
                      />
                    </svg>
                  </div>

                  <div>
                    <h3 className="font-bold text-blue-950">
                      Video Profil Perusahaan
                    </h3>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Upload video profil yang ditampilkan pada halaman Tentang Kami.
                    </p>
                  </div>

                </div>
              </div>

              <div className="p-6 md:p-8">

                {/* FILE INPUT */}
                <div>
                  <label
                    htmlFor="videoFile"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Pilih Video Baru
                  </label>

                  <input
                    id="videoFile"
                    type="file"
                    accept="video/mp4"
                    onChange={handleVideoChange}
                    disabled={loading || saving}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-sm outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Format MP4. Ukuran maksimal 100 MB.
                  </p>
                </div>

                {/* SELECTED FILE */}
                {videoFile && (
                  <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                    <p className="text-sm font-semibold text-blue-800">
                      Video baru dipilih
                    </p>

                    <p className="text-xs text-blue-700 mt-1">
                      {videoFile.name}
                    </p>
                  </div>
                )}

                {/* VIDEO PREVIEW */}
                {videoPreview && (
                  <div className="mt-6">
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      Preview Video
                    </p>

                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-black">
                      <video
                        key={videoPreview}
                        src={videoPreview}
                        controls
                        className="w-full max-h-[480px] object-contain"
                      />
                    </div>
                  </div>
                )}

                {/* UPLOAD STATUS */}
                {uploadProgress && (
                  <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                    <p className="text-sm font-medium text-blue-700">
                      {uploadProgress}
                    </p>
                  </div>
                )}

              </div>
            </div>

            {/* SAVE */}
            <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div>
                <p className="text-sm font-semibold text-blue-950">
                  Simpan perubahan
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Pastikan seluruh informasi Tentang Kami sudah sesuai sebelum menyimpan.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || saving}
                className="inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg text-sm font-semibold transition"
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

          {/* PREVIEW */}
          <div className="mt-10">

            <div className="mb-4">
              <p className="text-xs font-bold tracking-[0.18em] text-blue-700 uppercase">
                Preview
              </p>

              <h3 className="mt-1 text-xl font-bold text-blue-950">
                Preview Konten Tentang Kami
              </h3>
            </div>

            <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white">

              {/* PROFILE */}
              <div className="p-6 md:p-8 border-b border-gray-200">

                <p className="text-xs font-bold tracking-[0.18em] text-blue-700 uppercase">
                  Profil Perusahaan
                </p>

                <h3 className="mt-3 text-2xl font-bold text-blue-950">
                  {profilJudul}
                </h3>

                <p className="mt-5 text-sm leading-7 text-gray-600">
                  {profilDeskripsi1}
                </p>

                <p className="mt-4 text-sm leading-7 text-gray-600">
                  {profilDeskripsi2}
                </p>

              </div>

              {/* FOCUS */}
              <div className="p-6 md:p-8 bg-gray-50">

                <p className="text-xs font-bold tracking-[0.18em] text-blue-700 uppercase">
                  Our Focus
                </p>

                <h3 className="mt-3 text-2xl md:text-3xl font-bold text-blue-950">
                  {focusJudul}
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-600 max-w-2xl">
                  {focusDeskripsi}
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mt-6">

                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <p className="text-sm font-bold text-blue-950">
                      {qualityJudul}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      {qualityDeskripsi}
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <p className="text-sm font-bold text-blue-950">
                      {solutionJudul}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      {solutionDeskripsi}
                    </p>
                  </div>

                </div>

              </div>

              {/* VIDEO */}
              {videoPreview && (
                <div className="p-6 md:p-8">

                  <p className="text-xs font-bold tracking-[0.18em] text-blue-700 uppercase">
                    Video Profil
                  </p>

                  <div className="mt-4 overflow-hidden rounded-xl bg-black">
                    <video
                      key={videoPreview}
                      src={videoPreview}
                      controls
                      className="w-full max-h-[500px] object-contain"
                    />
                  </div>

                </div>
              )}

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