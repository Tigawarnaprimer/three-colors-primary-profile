
"use client";

import { useMemo, useState } from "react";

type Variant = {
  id: number;
  produk_id: number;
  kode: string;
  warna: string;
  warna_hex: string | null;
  gambar_url: string | null;
  status: "Aktif" | "Nonaktif";
  best_seller: boolean;
  urutan_best_seller: number | null;
};

type VariantSearchProps = {
  variants: Variant[];
};

type SellerFilter = "all" | "best" | "nonBest";

export default function VariantSearch({
  variants,
}: VariantSearchProps) {
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [sellerFilter, setSellerFilter] =
    useState<SellerFilter>("all");
  const [selectedColor, setSelectedColor] = useState("");

  const colorOptions = useMemo(
    () =>
      Array.from(
        new Set(
          variants
            .map((variant) => variant.warna.trim())
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b, "id")),
    [variants]
  );

  const filteredVariants = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return variants.filter((variant) => {
      const matchesSearch =
        !keyword ||
        `${variant.kode} ${variant.warna}`
          .toLowerCase()
          .includes(keyword);

      const matchesSeller =
        sellerFilter === "all" ||
        (sellerFilter === "best" && variant.best_seller) ||
        (sellerFilter === "nonBest" && !variant.best_seller);

      const matchesColor =
        !selectedColor || variant.warna === selectedColor;

      return matchesSearch && matchesSeller && matchesColor;
    });
  }, [variants, search, sellerFilter, selectedColor]);

  const activeFilterCount =
    (sellerFilter !== "all" ? 1 : 0) +
    (selectedColor ? 1 : 0);

  const resetFilters = () => {
    setSearch("");
    setSellerFilter("all");
    setSelectedColor("");
  };

  if (variants.length === 0) return null;

  return (
    <section className="mt-16 md:mt-20" id="varian-produk">
      {/* JUDUL */}
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
          Pilihan Varian
        </p>

        <h2 className="mt-3 text-3xl font-bold text-blue-950 md:text-4xl">
          Varian Produk
        </h2>

        <p className="mt-4 max-w-2xl leading-7 text-gray-600">
          Temukan varian produk berdasarkan kode, warna, atau kategori
          Best Seller.
        </p>
      </div>

      {/* PENCARIAN DAN FILTER */}
      <div className="relative mb-6">
        <div className="flex items-center gap-3">
          <div className="relative min-w-0 flex-1">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>

            <input
              id="variant-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari kode atau warna..."
              className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-12 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFilter((current) => !current)}
            aria-expanded={showFilter}
            aria-controls="variant-filter-panel"
            className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border px-3 sm:px-4 py-3.5 text-sm font-semibold transition ${
              showFilter || activeFilterCount > 0
                ? "border-blue-950 bg-blue-950 text-white"
                : "border-gray-300 bg-white text-gray-700 hover:border-blue-700 hover:text-blue-900"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M4 7h16M7 12h10m-7 5h4" />
              <circle cx="8" cy="7" r="1.5" fill="currentColor" />
              <circle cx="15" cy="12" r="1.5" fill="currentColor" />
              <circle cx="12" cy="17" r="1.5" fill="currentColor" />
            </svg>

            <span>Filter</span>

            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-yellow-400 px-1 text-xs font-bold text-blue-950">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* PANEL FILTER */}
        {showFilter && (
          <>
            <button
              type="button"
              aria-label="Tutup panel filter"
              onClick={() => setShowFilter(false)}
              className="fixed inset-0 z-20 cursor-default"
            />

            <div
              id="variant-filter-panel"
              className="absolute right-0 top-full z-30 mt-3 w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-5 shadow-xl"
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-base font-bold text-blue-950">
                  Filter Varian
                </h3>

                <button
                  type="button"
                  onClick={() => setShowFilter(false)}
                  aria-label="Tutup filter"
                  className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path d="m6 6 12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>

              {/* FILTER BEST SELLER */}
              <div className="mb-5">
                <label
                  htmlFor="seller-filter"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Kategori
                </label>

                <select
                  id="seller-filter"
                  value={sellerFilter}
                  onChange={(event) =>
                    setSellerFilter(event.target.value as SellerFilter)
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="all">Semua varian</option>
                  <option value="best">Best Seller</option>
                  <option value="nonBest">Non Best Seller</option>
                </select>
              </div>

              {/* FILTER WARNA */}
              <div className="mb-6">
                <label
                  htmlFor="color-filter"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Warna
                </label>

                <select
                  id="color-filter"
                  value={selectedColor}
                  onChange={(event) => setSelectedColor(event.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">Semua warna</option>

                  {colorOptions.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Reset
                </button>

                <button
                  type="button"
                  onClick={() => setShowFilter(false)}
                  className="flex-1 rounded-xl bg-blue-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  Selesai
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* JUMLAH HASIL */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500" aria-live="polite">
          Menampilkan{" "}
          <span className="font-semibold text-gray-800">
            {filteredVariants.length}
          </span>{" "}
          dari {variants.length} varian
        </p>

        {(search || activeFilterCount > 0) && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-sm font-semibold text-blue-800 transition hover:text-blue-600"
          >
            Hapus semua filter
          </button>
        )}
      </div>

      {/* HASIL VARIAN */}
      {filteredVariants.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filteredVariants.map((variant) => (
            <article
              key={variant.id}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_6px_20px_rgba(15,23,42,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-[0_12px_28px_rgba(15,23,42,0.12)]"
            >
              {/* GAMBAR VARIAN */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                {variant.gambar_url ? (
                  <img
                    src={variant.gambar_url}
                    alt={`${variant.kode} - ${variant.warna}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center"
                    style={{
                      backgroundColor: variant.warna_hex || "#f3f4f6",
                    }}
                  >
                    <span className="px-4 text-center text-sm font-semibold text-gray-700">
                      {variant.warna || "Varian"}
                    </span>
                  </div>
                )}

                {variant.best_seller && (
                  <div className="absolute left-4 top-4">
                    <span className="inline-flex rounded-full bg-yellow-400 px-3 py-1.5 text-xs font-bold text-blue-950 shadow-sm">
                      Best Seller
                    </span>
                  </div>
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
              </div>

              {/* INFORMASI VARIAN */}
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-700">
                  {variant.kode}
                </p>

                <h3 className="mt-2 line-clamp-2 text-lg font-bold text-blue-950">
                  {variant.warna}
                </h3>

                {variant.warna_hex && (
                  <div className="mt-4 flex items-center gap-3">
                    <span
                      className="h-6 w-6 shrink-0 rounded-full border border-gray-200 shadow-inner"
                      style={{
                        backgroundColor: variant.warna_hex,
                      }}
                    />

                    <span className="text-xs uppercase text-gray-500">
                      {variant.warna_hex}
                    </span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-6 w-6 text-gray-500"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>
          </div>

          <h3 className="mt-4 text-base font-semibold text-gray-800">
            Varian tidak ditemukan
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Coba ubah kata kunci atau kriteria filter Anda.
          </p>

          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 rounded-lg bg-blue-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Tampilkan semua varian
          </button>
        </div>
      )}
    </section>
  );
}
