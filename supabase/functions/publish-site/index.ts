// Edge Function: publish-site
// Memicu GitHub Actions "Deploy ke Rumahweb" saat admin menekan tombol Publikasikan.
// Token GitHub disimpan sebagai secret Supabase (GITHUB_TOKEN), tidak pernah ke browser.
import { createClient } from "@supabase/supabase-js";

// ===== Pengaturan (ubah di sini bila perlu) =====
const OWNER = "Tigawarnaprimer";
const REPO = "three-colors-primary-profile";
const WORKFLOW = "deploy-rumahweb.yml";
const WORKFLOW_REF = "main"; // branch tempat file workflow berada
const BUILD_REF = "feature/static-export"; // branch yang dibangun menjadi website
// ================================================

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

// Kunci publik proyek (nama variabelnya berbeda antar versi Supabase)
function publicKey(): string {
  const anon = Deno.env.get("SUPABASE_ANON_KEY");
  if (anon) return anon;

  const multi = Deno.env.get("SUPABASE_PUBLISHABLE_KEYS");
  if (multi) {
    try {
      const keys = JSON.parse(multi) as Record<string, string>;
      return keys["default"] ?? Object.values(keys)[0] ?? "";
    } catch {
      return "";
    }
  }
  return "";
}

async function gh(path: string, init: RequestInit = {}) {
  return await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${Deno.env.get("GITHUB_TOKEN")}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "tigawarnaprimer-publish",
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}

type RunState = "idle" | "running" | "success" | "failed";

async function latestRun(): Promise<{
  state: RunState;
  id: number | null;
  finishedAt: string | null;
}> {
  const res = await gh(
    `/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW}/runs?per_page=1`,
  );

  if (!res.ok) throw new Error(`GitHub status ${res.status}`);

  const data = await res.json();
  const run = data.workflow_runs?.[0];

  if (!run) return { state: "idle", id: null, finishedAt: null };

  let state: RunState;
  if (run.status !== "completed") state = "running";
  else state = run.conclusion === "success" ? "success" : "failed";

  return {
    state,
    id: run.id,
    finishedAt: state === "running" ? null : run.updated_at,
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") {
    return json({ error: "Metode tidak didukung." }, 405);
  }

  if (!Deno.env.get("GITHUB_TOKEN")) {
    return json(
      { error: "Server publikasi belum dikonfigurasi (GITHUB_TOKEN)." },
      500,
    );
  }

  // 1. Hanya admin yang boleh. Pemeriksaan memakai sesi si pemanggil + fungsi is_admin().
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "Anda belum login." }, 401);

  const userClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    publicKey(),
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: isAdmin, error: adminError } = await userClient.rpc("is_admin");

  if (adminError || isAdmin !== true) {
    return json({ error: "Hanya admin yang boleh mempublikasikan." }, 403);
  }

  // 2. Aksi yang diminta
  let action = "status";
  try {
    const body = await req.json();
    if (typeof body?.action === "string") action = body.action;
  } catch {
    // body kosong = status
  }

  if (action !== "status" && action !== "publish") {
    return json({ error: "Aksi tidak dikenal." }, 400);
  }

  try {
    const latest = await latestRun();

    if (action === "status") return json(latest);

    if (latest.state === "running") {
      return json(
        { error: "Publikasi sedang berjalan. Tunggu sampai selesai." },
        409,
      );
    }

    const res = await gh(
      `/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW}/dispatches`,
      {
        method: "POST",
        body: JSON.stringify({ ref: WORKFLOW_REF, inputs: { ref: BUILD_REF } }),
      },
    );

    if (res.status !== 204) {
      console.error("GitHub dispatch gagal:", res.status, await res.text());
      return json(
        { error: "GitHub menolak permintaan. Periksa token GitHub." },
        502,
      );
    }

    return json({ ok: true });
  } catch (error) {
    console.error(error);
    return json({ error: "Gagal menghubungi GitHub." }, 502);
  }
});
