-- Supabase/PostgreSQL schema recommendation.
-- PostgreSQL stores text as UTF-8. For MySQL, use utf8mb4 and utf8mb4_unicode_ci.

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  provider text not null check (provider in ('google', 'kakao')),
  role text not null default 'USER' check (role in ('USER', 'ADMIN')),
  created_at timestamptz not null default now()
);

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  image_url text not null,
  title text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  photo_id uuid not null references public.photos(id) on delete cascade,
  unique (user_id, photo_id)
);

create table if not exists public.shares (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  photo_id uuid not null references public.photos(id) on delete cascade,
  share_type text not null check (share_type in ('instagram_reels', 'kakao', 'sms', 'copy_link')),
  created_at timestamptz not null default now()
);

create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create or replace view public.photo_rankings as
select
  p.id,
  p.user_id,
  p.image_url,
  p.title,
  p.created_at,
  count(distinct l.id)::integer as likes_count,
  count(distinct s.id)::integer as shares_count,
  (count(distinct l.id) + count(distinct s.id) * 3)::integer as score
from public.photos p
left join public.likes l on l.photo_id = p.id
left join public.shares s on s.photo_id = p.id
group by p.id;
