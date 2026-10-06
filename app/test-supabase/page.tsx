import { supabase } from "@/lib/supabase";

export default async function TestSupabasePage() {
  const { data, error } = await supabase
    .from("keunggulan")
    .select("*")
    .order("id", { ascending: true });

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-950">
          Tes Koneksi Supabase
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Mengambil data dari tabel keunggulan.
        </p>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="font-bold text-red-700">
              Koneksi gagal
            </p>

            <pre className="mt-3 overflow-x-auto text-sm text-red-600">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="mt-6">
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4">
              <p className="font-semibold text-green-700">
                Koneksi Supabase berhasil.
              </p>

              <p className="mt-1 text-sm text-green-600">
                Data berhasil diambil dari tabel keunggulan.
              </p>
            </div>

            <div className="space-y-4">
              {data?.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="font-bold text-blue-950">
                      {item.judul}
                    </h2>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === "Aktif"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {item.deskripsi}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}