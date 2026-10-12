
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type PdfViewerProps = {
  url: string;
  title?: string;
};

type PdfPage = {
  getViewport: (options: { scale: number }) => {
    width: number;
    height: number;
  };
  render: (options: {
    canvasContext: CanvasRenderingContext2D;
    viewport: {
      width: number;
      height: number;
    };
    transform?: number[];
  }) => {
    promise: Promise<void>;
    cancel: () => void;
  };
};

type PdfDocument = {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PdfPage>;
};

export default function PdfViewer({
  url,
  title = "Katalog Produk",
}: PdfViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfRef = useRef<PdfDocument | null>(null);
  const renderTaskRef = useRef<{ cancel: () => void } | null>(null);

  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Memuat dokumen PDF
  useEffect(() => {
    let cancelled = false;
    let loadingTask: { destroy?: () => Promise<void> } | null = null;

    async function loadPdf() {
      setLoading(true);
      setError("");
      setNumPages(0);
      setPageNumber(1);
      pdfRef.current = null;

      try {
        const pdfjs = await import("pdfjs-dist");

        if (cancelled) return;

        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url
        ).toString();

        const task = pdfjs.getDocument({
          url,
          withCredentials: false,
        });

        loadingTask = task;

        const pdf = (await task.promise) as unknown as PdfDocument;

        if (cancelled) {
          // Batalkan melalui loading task, bukan objek dokumen.
          await task.destroy();
          return;
        }

        pdfRef.current = pdf;
        setNumPages(pdf.numPages);
        setPageNumber(1);
        setLoading(false);
      } catch (err) {
        if (cancelled) return;

        console.error("Gagal memuat PDF:", err);

        setError(
          "Katalog belum dapat ditampilkan. Periksa URL PDF, akses Supabase, atau koneksi internet."
        );
        setLoading(false);
      }
    }

    void loadPdf();

    return () => {
      cancelled = true;

      renderTaskRef.current?.cancel();
      renderTaskRef.current = null;
      pdfRef.current = null;

      // Tidak memanggil destroy() pada objek dokumen.
      // Hanya batalkan loading task jika dokumen masih dimuat.
      if (loadingTask) {
        void loadingTask.destroy?.().catch(() => {});
      }
    };
  }, [url]);

  // Merender halaman PDF ke canvas
  const renderPage = useCallback(async () => {
    const pdf = pdfRef.current;
    const canvas = canvasRef.current;

    if (
      !pdf ||
      !canvas ||
      pageNumber < 1 ||
      pageNumber > pdf.numPages
    ) {
      return;
    }

    renderTaskRef.current?.cancel();
    renderTaskRef.current = null;

    try {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale });
      const context = canvas.getContext("2d");

      if (!context) {
        setError("Browser tidak dapat menampilkan halaman PDF.");
        return;
      }

      const outputScale = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      canvas.width = Math.floor(viewport.width * outputScale);
canvas.height = Math.floor(viewport.height * outputScale);

// Pertahankan proporsi asli halaman PDF.
// Lebar dapat mengecil mengikuti layar HP.
canvas.style.width = `${viewport.width}px`;
canvas.style.height = "auto";
canvas.style.maxWidth = "100%";
canvas.style.display = "block";

      const renderTask = page.render({
        canvasContext: context,
        viewport,
        transform:
          outputScale !== 1
            ? [outputScale, 0, 0, outputScale, 0, 0]
            : undefined,
      });

      renderTaskRef.current = renderTask;

      await renderTask.promise;

      if (renderTaskRef.current === renderTask) {
        renderTaskRef.current = null;
      }
    } catch (err) {
      if (
        err instanceof Error &&
        err.name === "RenderingCancelledException"
      ) {
        return;
      }

      console.error("Gagal merender halaman PDF:", err);
    }
  }, [pageNumber, scale]);

  useEffect(() => {
    if (!loading && !error) {
      void renderPage();
    }

    return () => {
      renderTaskRef.current?.cancel();
      renderTaskRef.current = null;
    };
  }, [loading, error, renderPage]);

  return (
    <section
      className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm"
      onContextMenu={(event) => event.preventDefault()}
      aria-label={title}
    >
      {/* Header dan kontrol zoom */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {title}
          </p>

          <p className="text-xs text-gray-500">
            {numPages > 0
              ? `Halaman ${pageNumber} dari ${numPages}`
              : "Penampil katalog"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setScale((value) =>
                Math.max(0.5, Math.round((value - 0.1) * 10) / 10)
              )
            }
            disabled={loading || !!error || scale <= 0.5}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Perkecil tampilan"
          >
            −
          </button>

          <span className="min-w-14 text-center text-sm text-gray-600">
            {Math.round(scale * 100)}%
          </span>

          <button
            type="button"
            onClick={() =>
              setScale((value) =>
                Math.min(2, Math.round((value + 0.1) * 10) / 10)
              )
            }
            disabled={loading || !!error || scale >= 2}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Perbesar tampilan"
          >
            +
          </button>
        </div>
      </div>

      {/* Area dokumen */}
      <div className="flex min-h-[300px] w-full items-start justify-center overflow-auto p-2 sm:min-h-[400px] sm:p-6">
        {loading && (
          <div className="py-12 text-center text-sm text-gray-500">
            Memuat katalog produk...
          </div>
        )}

        {!loading && error && (
          <div className="max-w-md py-12 text-center">
            <p className="font-medium text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <canvas
  ref={canvasRef}
  className="block h-auto max-w-full bg-white shadow-md"
  aria-label={`Halaman ${pageNumber} katalog`}
/>
        )}
      </div>

      {/* Navigasi halaman */}
      {!loading && !error && numPages > 0 && (
        <div className="flex items-center justify-center gap-4 border-t border-gray-200 bg-white px-4 py-3">
          <button
            type="button"
            onClick={() =>
              setPageNumber((page) => Math.max(1, page - 1))
            }
            disabled={pageNumber <= 1}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Sebelumnya
          </button>

          <span className="text-sm text-gray-600">
            {pageNumber} / {numPages}
          </span>

          <button
            type="button"
            onClick={() =>
              setPageNumber((page) => Math.min(numPages, page + 1))
            }
            disabled={pageNumber >= numPages}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Berikutnya
          </button>
        </div>
      )}
    </section>
  );
}
