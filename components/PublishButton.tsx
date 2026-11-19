"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

type RunState = "idle" | "running" | "success" | "failed";

type Status = {
  state: RunState;
  id: number | null;
  finishedAt: string | null;
};

const POLL_MS = 10000;
const WAIT_NEW_RUN_MS = 90000;

async function invokePublish<T>(action: "status" | "publish"): Promise<T> {
  const { data, error } = await supabase.functions.invoke("publish-site", {
    body: { action },
  });

  if (error) {
    let message = "Tidak bisa menghubungi server publikasi.";

    try {
      const body = await (error as unknown as { context?: Response }).context?.json();
      if (body?.error) message = body.error;
    } catch {
      // pakai pesan bawaan
    }

    throw new Error(message);
  }

  return data as T;
}

function formatTime(iso: string | null) {
  if (!iso) return "";

  return new Date(iso).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  });
}

export default function PublishButton() {
  const pathname = usePathname() ?? "";

  const [signedIn, setSignedIn] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);
  const [waiting, setWaiting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previousRunId = useRef<number | null>(null);
  const waitingSince = useRef<number | null>(null);

  const hidden = pathname.startsWith("/admin/login");
  const running = waiting || status?.state === "running";

  // Tampilkan tombol hanya untuk yang sudah login
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSignedIn(Boolean(data.session));
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session));
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const refresh = useCallback(async () => {
    try {
      const next = await invokePublish<Status>("status");
      setStatus(next);
      setError(null);

      if (waitingSince.current !== null) {
        if (next.id !== previousRunId.current) {
          // Proses baru sudah terbaca di GitHub
          waitingSince.current = null;
          setWaiting(false);
        } else if (Date.now() - waitingSince.current > WAIT_NEW_RUN_MS) {
          waitingSince.current = null;
          setWaiting(false);
          setError(
            "Permintaan terkirim, tetapi prosesnya belum terbaca. Cek tab Actions di GitHub.",
          );
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat status.");
    }
  }, []);

  // Muat status terakhir saat halaman dibuka
  useEffect(() => {
    if (!signedIn || hidden) return;
    refresh();
  }, [signedIn, hidden, refresh]);

  // Selama proses berjalan, periksa berkala
  useEffect(() => {
    if (!signedIn || hidden || !running) return;

    const timer = setInterval(refresh, POLL_MS);
    return () => clearInterval(timer);
  }, [signedIn, hidden, running, refresh]);

  async function handlePublish() {
    if (running || busy) return;

    const ok = window.confirm(
      "Publikasikan semua perubahan ke website? Prosesnya sekitar 2-5 menit.",
    );
    if (!ok) return;

    setBusy(true);
    setError(null);

    try {
      previousRunId.current = status?.id ?? null;
      await invokePublish<{ ok: boolean }>("publish");

      waitingSince.current = Date.now();
      setWaiting(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memulai publikasi.");
    } finally {
      setBusy(false);
    }
  }

  if (hidden || !signedIn) return null;

  let info = "Belum ada publikasi.";
  if (running) {
    info = "Sedang memublikasikan, biasanya 2-5 menit. Halaman ini boleh ditutup.";
  } else if (status?.state === "success") {
    info = `Terakhir berhasil: ${formatTime(status.finishedAt)} WIB`;
  } else if (status?.state === "failed") {
    info = "Publikasi terakhir gagal. Coba lagi, atau hubungi pengelola website.";
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 w-72 max-w-[calc(100vw-2.5rem)]">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-950">
          Publikasi Website
        </p>

        <p className="mt-1 text-xs leading-5 text-gray-600">{info}</p>

        {error && (
          <p className="mt-2 text-xs font-medium leading-5 text-red-600">{error}</p>
        )}

        <button
          type="button"
          onClick={handlePublish}
          disabled={running || busy}
          className="mt-3 w-full rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {running ? "Sedang diproses..." : busy ? "Mengirim..." : "Publikasikan Perubahan"}
        </button>
      </div>
    </div>
  );
}
