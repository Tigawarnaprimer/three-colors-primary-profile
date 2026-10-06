import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";

export const Route = createFileRoute("/karir")({
  component: Karir,
});

function Karir() {
  const jobs = [
    { title: "Sales", type: "Full Time", location: "Tangerang" },
    { title: "Quality Control", type: "Full Time", location: "Tangerang" },
    { title: "Purchasing Lokal", type: "Full Time", location: "Tangerang" },
    { title: "Penerjemahan Mandarin", type: "Full Time", location: "Tangerang" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20 px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-12">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red mb-3">Karir</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight leading-tight">Bergabung Bersama Kami</h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Kami selalu mencari talenta terbaik untuk berkembang bersama PT Tiga Warna Primer. Temukan peluang karir yang sesuai dengan passion Anda.
            <br/><br/>
            <strong>Silakan langsung hubungi kami dan kirim CV Anda melalui WhatsApp ke nomor: <a href="https://wa.me/6285136035632" target="_blank" className="text-brand-blue hover:underline">+62 851-3603-5632</a></strong>
          </p>
        </div>

        <div className="grid gap-4">
          {jobs.map((job, i) => (
            <div key={i} className="p-6 rounded-2xl border border-border bg-background hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-xl">{job.title}</h3>
                <div className="flex gap-3 text-sm text-muted-foreground mt-2">
                  <span>{job.type}</span>
                  <span>•</span>
                  <span>{job.location}</span>
                </div>
              </div>
              <a href="https://wa.me/6285136035632" target="_blank" className="rounded-full bg-foreground text-background px-6 py-2.5 text-sm font-medium hover:opacity-90 transition inline-flex items-center justify-center">
                Kirim CV (WhatsApp)
              </a>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-display font-bold">
            <span>PT Tiga Warna Primer</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 PT Tiga Warna Primer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
