"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Job = {
  id: number;
  posisi: string;
  tipe: string;
  lokasi: string;
  deskripsi: string;
  whatsapp: string;
  status: "Aktif" | "Nonaktif";
};

const benefits = [
  {
    number: "01",
    title: "Lingkungan Profesional",
    description:
      "Bekerja dalam lingkungan yang mendukung kolaborasi, komunikasi, dan perkembangan profesional.",
  },
  {
    number: "02",
    title: "Kesempatan Berkembang",
    description:
      "Kesempatan untuk meningkatkan kemampuan dan berkembang bersama perusahaan.",
  },
  {
    number: "03",
    title: "Tim yang Solid",
    description:
      "Menjadi bagian dari tim yang saling mendukung untuk mencapai tujuan bersama.",
  },
];

function getWhatsappUrl(number: string) {
  const cleanNumber = number.replace(/\D/g, "");
  return `https://wa.me/${cleanNumber}`;
}

export default function Karir() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      setLoading(true);

      const { data, error } = await supabase
        .from("karir")
        .select(
          "id, posisi, tipe, lokasi, deskripsi, whatsapp, status"
        )
        .eq("status", "Aktif")
        .order("id", { ascending: true });

      if (error) {
        console.error("Gagal mengambil data karir:", error);
        setJobs([]);
      } else {
        setJobs((data ?? []) as Job[]);
      }

      setLoading(false);
    }

    loadJobs();
  }, []);

  return (
    <main className="bg-white">
      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative h-[400px] overflow-hidden md:h-[480px]">
        <Image
          src="/images/career-hero.jpg"
          alt="Karir PT Tiga Warna Primer"
          fill
          priority
          className="object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/55 to-black/80" />

        {/* Hero Content */}
        <div className="relative z-10 flex h-full items-center justify-center px-6">
          <div className="text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-yellow-400">
              PT Tiga Warna Primer
            </p>

            <h1 className="text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
              Karir
            </h1>

            <div className="mx-auto mt-5 h-1 w-12 rounded-full bg-yellow-400" />
          </div>
        </div>
      </section>

      {/* =====================================================
          JOB SECTION
      ====================================================== */}
      <section className="px-6 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          {/* Heading */}
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
              Vacancy / Career
            </span>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-blue-950 md:text-4xl lg:text-5xl">
              <span className="text-yellow-500">
                Bergabung
              </span>{" "}
              Bersama Kami
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-500 md:text-base">
              Temukan kesempatan untuk berkembang bersama PT Tiga Warna
              Primer dan menjadi bagian dari tim profesional kami.
            </p>
          </div>

          {/* =================================================
              JOB + CARA MENDAFTAR
          ================================================== */}
          <div className="mt-14 grid gap-8 lg:grid-cols-[1.45fr_0.9fr]">
            {/* =================================================
                JOB LIST
            ================================================== */}
            <div className="grid gap-5 sm:grid-cols-2">
              {loading ? (
                <div className="sm:col-span-2 flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
                  <div className="text-center">
                    <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-blue-200 border-t-blue-700" />

                    <p className="mt-4 text-sm font-semibold text-slate-500">
                      Memuat lowongan...
                    </p>
                  </div>
                </div>
              ) : jobs.length === 0 ? (
                <div className="sm:col-span-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue-700 shadow-sm">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <rect
                        x="3"
                        y="7"
                        width="18"
                        height="13"
                        rx="2"
                      />
                      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-blue-950">
                    Belum ada lowongan tersedia
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Saat ini belum terdapat posisi yang sedang dibuka.
                    Silakan kembali lagi untuk melihat kesempatan
                    karier terbaru.
                  </p>
                </div>
              ) : (
                jobs.map((job, index) => (
                  <div
                    key={job.id}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_15px_40px_rgba(15,23,42,0.10)]"
                  >
                    {/* Number */}
                    <span className="absolute right-6 top-4 text-5xl font-bold tracking-tight text-slate-100 transition-colors duration-300 group-hover:text-blue-50">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="relative">
                      {/* Job Type */}
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-700">
                        {job.tipe}
                      </p>

                      {/* Job Title */}
                      <h3 className="mt-4 text-xl font-bold tracking-tight text-blue-950 md:text-2xl">
                        {job.posisi}
                      </h3>

                      {/* Location */}
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                        <svg
                          className="h-4 w-4 shrink-0 text-yellow-500"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 21s7-6.1 7-12a7 7 0 10-14 0c0 5.9 7 12 7 12z"
                          />

                          <circle
                            cx="12"
                            cy="9"
                            r="2.5"
                          />
                        </svg>

                        <span>{job.lokasi}</span>
                      </div>

                      {/* Description */}
                      <p className="mt-5 text-sm leading-6 text-slate-500">
                        {job.deskripsi}
                      </p>

                      {/* Apply */}
                      <a
                        href={getWhatsappUrl(job.whatsapp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-950 px-5 py-2.5 text-xs font-bold text-white transition-all duration-300 hover:bg-blue-800"
                      >
                        Lamar Sekarang

                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* =================================================
                CARA MENDAFTAR
            ================================================== */}
            <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_35px_rgba(15,23,42,0.08)] md:p-7">
              {/* Header */}
              <div>
                <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
                  Cara Mendaftar
                </span>

                <h3 className="mt-5 text-2xl font-bold leading-tight text-blue-950">
                  Mulai Langkah Karier Anda
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Tertarik untuk menjadi bagian dari PT Tiga Warna Primer?
                  Ikuti langkah sederhana berikut untuk mengirimkan lamaran
                  Anda.
                </p>
              </div>

              {/* Steps */}
              <div className="mt-7 space-y-6">
                {/* Step 01 */}
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-950 text-xs font-bold text-white">
                    01
                  </div>

                  <div className="pt-0.5">
                    <h4 className="text-sm font-bold text-blue-950">
                      Pilih Posisi
                    </h4>

                    <p className="mt-1.5 text-xs leading-5 text-slate-500">
                      Pilih posisi pekerjaan yang sesuai dengan kemampuan,
                      pengalaman, dan minat Anda.
                    </p>
                  </div>
                </div>

                {/* Step 02 */}
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-950 text-xs font-bold text-white">
                    02
                  </div>

                  <div className="pt-0.5">
                    <h4 className="text-sm font-bold text-blue-950">
                      Siapkan CV
                    </h4>

                    <p className="mt-1.5 text-xs leading-5 text-slate-500">
                      Pastikan CV Anda berisi informasi diri, pengalaman,
                      pendidikan, dan kemampuan yang relevan.
                    </p>
                  </div>
                </div>

                {/* Step 03 */}
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-blue-950">
                    03
                  </div>

                  <div className="pt-0.5">
                    <h4 className="text-sm font-bold text-blue-950">
                      Kirim Lamaran
                    </h4>

                    <p className="mt-1.5 text-xs leading-5 text-slate-500">
                      Kirim CV Anda melalui WhatsApp dan tuliskan posisi yang
                      ingin Anda lamar.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-7 border-t border-slate-100 pt-6">
                <a
                  href={getWhatsappUrl(
                    jobs[0]?.whatsapp || "+62 851-3603-5632"
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3.5 text-sm font-bold text-blue-950 transition-all duration-300 hover:bg-yellow-300"
                >
                  Kirim CV Sekarang
                  <span>→</span>
                </a>

                <p className="mt-3 text-center text-[11px] text-slate-400">
                  Lamaran dikirim langsung melalui WhatsApp
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          BENEFITS
      ====================================================== */}
      <section className="bg-slate-50 px-6 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          {/* Heading */}
          <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
            <div>
              <span className="inline-flex rounded-full bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700 shadow-sm">
                Our Benefits
              </span>

              <h2 className="mt-5 max-w-xl text-3xl font-bold leading-tight tracking-tight text-blue-950 md:text-4xl">
                Tumbuh bersama{" "}
                <span className="text-yellow-500">
                  perusahaan yang terus berkembang.
                </span>
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-7 text-slate-500 lg:justify-self-end">
              Kami membangun lingkungan kerja yang mendorong kolaborasi,
              profesionalisme, dan kesempatan bagi setiap individu untuk
              berkembang serta memberikan kontribusi terbaik.
            </p>
          </div>

          {/* Benefit Cards */}
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {benefits.map((benefit) => (
              <div
                key={benefit.number}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-950 text-xs font-bold text-white transition-colors duration-300 group-hover:bg-yellow-400 group-hover:text-blue-950">
                    {benefit.number}
                  </div>

                  <h3 className="text-base font-bold text-blue-950">
                    {benefit.title}
                  </h3>
                </div>

                <p className="mt-5 text-sm leading-6 text-slate-500">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ====================================================== */}
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-2xl bg-blue-950 px-7 py-10 md:px-10 md:py-12">
            {/* Decorative */}
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-blue-800/30 blur-3xl" />

            <div className="relative flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400">
                  Career Opportunity
                </p>

                <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">
                  Siap menjadi bagian dari tim kami?
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
                  Kirimkan CV Anda dan mulai langkah baru bersama
                  PT Tiga Warna Primer.
                </p>
              </div>

              <a
                href={getWhatsappUrl(
                  jobs[0]?.whatsapp || "+62 851-3603-5632"
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-3.5 text-sm font-bold text-blue-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-yellow-300"
              >
                Kirim CV Sekarang
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}