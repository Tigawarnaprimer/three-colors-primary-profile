-- =====================================================================
-- 01_visitor_rpc.sql
-- Pengganti app/api/visitor (POST) dan app/api/visitor/summary (GET).
-- AMAN dijalankan: hanya MEMBUAT objek baru, tidak mengubah yang ada.
-- Asumsi kolom (sesuai kode API lama):
--   website_visitors(id, visitor_id uuid UNIQUE, last_seen_at timestamptz)
--   website_page_views(id, visitor_id uuid, page_path text, visited_at timestamptz)
-- =====================================================================

-- 1) Catat kunjungan (dipanggil dari browser pengunjung)
create or replace function public.track_visit(p_visitor_id uuid, p_path text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_path text;
begin
  -- Validasi sama seperti API lama
  if p_visitor_id is null
     or p_path is null
     or left(p_path, 1) <> '/'
     or left(p_path, 2) = '//'
     or length(p_path) > 500
     or position('\' in p_path) > 0 then
    raise exception 'invalid input';
  end if;

  -- Simpan hanya pathname, tanpa query string / hash
  v_path := split_part(split_part(p_path, '?', 1), '#', 1);

  -- Abaikan jika visitor yang sama membuka path yang sama < 10 detik lalu
  -- (mengurangi spam/refresh beruntun)
  if exists (
    select 1 from public.website_page_views
    where visitor_id = p_visitor_id
      and page_path = v_path
      and visited_at > now() - interval '10 seconds'
  ) then
    return;
  end if;

  insert into public.website_visitors (visitor_id, last_seen_at)
  values (p_visitor_id, now())
  on conflict (visitor_id) do update set last_seen_at = excluded.last_seen_at;

  insert into public.website_page_views (visitor_id, page_path)
  values (p_visitor_id, v_path);
end;
$$;

-- 2) Ringkasan publik (angka saja, bukan data pengunjung)
create or replace function public.get_public_visitor_summary()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  with b as (
    select
      (date_trunc('day',   now() at time zone 'Asia/Jakarta') at time zone 'Asia/Jakarta') as today_start,
      (date_trunc('month', now() at time zone 'Asia/Jakarta') at time zone 'Asia/Jakarta') as month_start
  )
  select jsonb_build_object(
    'total_page_views',        (select count(*) from public.website_page_views),
    'total_unique_visitors',   (select count(*) from public.website_visitors),
    'page_views_this_month',   (select count(*) from public.website_page_views, b where visited_at >= b.month_start),
    'unique_visitors_today',   (select count(distinct visitor_id) from public.website_page_views, b
                                 where visited_at >= b.today_start
                                   and visited_at <  b.today_start + interval '1 day')
  );
$$;

-- 3) Hak akses: boleh dipanggil publik (anon) dan user login
revoke all on function public.track_visit(uuid, text)        from public;
revoke all on function public.get_public_visitor_summary()   from public;
grant execute on function public.track_visit(uuid, text)      to anon, authenticated;
grant execute on function public.get_public_visitor_summary() to anon, authenticated;
