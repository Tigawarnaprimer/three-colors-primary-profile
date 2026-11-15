-- =====================================================================
-- 02_admin_stats_guard.sql
-- JANGAN jalankan sebelum langkah 0 selesai (lihat bawah) dan
-- sebelum kode baru siap dipakai. Menjalankannya MEMUTUSKAN dashboard
-- statistik versi Vercel yang sekarang (/api/visitor/stats memakai
-- service_role, jadi tetap jalan; tetapi pastikan dulu).
-- =====================================================================

-- 0) Tentukan siapa admin. Ganti UUID dengan ID akun admin Anda
--    (Authentication > Users > klik user > copy User UID).
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.admin_users enable row level security;
-- Tanpa policy = tabel tidak bisa dibaca/ubah lewat API publik.

-- insert into public.admin_users (user_id) values ('GANTI-DENGAN-UUID-ADMIN');

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- 1) Pembungkus yang hanya boleh dipanggil admin.
--    Fungsi asli (get_website_stats / get_website_analytics) tidak diubah.
create or replace function public.admin_get_website_stats()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  return public.get_website_stats();
end;
$$;

create or replace function public.admin_get_website_analytics(p_days integer)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if p_days not in (7, 30, 90) then
    raise exception 'invalid period';
  end if;
  return public.get_website_analytics(p_days);
end;
$$;

revoke all on function public.admin_get_website_stats()            from public;
revoke all on function public.admin_get_website_analytics(integer) from public;
grant execute on function public.admin_get_website_stats()            to authenticated;
grant execute on function public.admin_get_website_analytics(integer) to authenticated;

-- 2) Cabut akses langsung ke fungsi asli dari browser.
--    (service_role tetap bisa, jadi API Vercel lama tidak rusak.)
revoke execute on function public.get_website_stats()            from public, anon, authenticated;
revoke execute on function public.get_website_analytics(integer) from public, anon, authenticated;
