create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id uuid not null,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  address text,
  message text,
  original_image_url text,
  generated_image_url text,
  selected_surfaces jsonb not null default '[]'::jsonb,
  selected_colours jsonb not null default '[]'::jsonb,
  measurements jsonb not null default '{}'::jsonb,
  selected_work jsonb not null default '[]'::jsonb,
  estimated_min numeric,
  estimated_max numeric,
  marketing_consent boolean not null default false,
  consent_timestamp timestamptz not null,
  privacy_policy_version text not null,
  source text not null default 'kleuro-app',
  lead_status text not null default 'nieuw',
  constraint leads_status_check check (
    lead_status in (
      'nieuw',
      'gecontacteerd',
      'geïnteresseerd',
      'klant',
      'niet geïnteresseerd',
      'gesloten'
    )
  )
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_session_id_idx on public.leads (session_id);
create index if not exists leads_status_idx on public.leads (lead_status);

alter table public.leads enable row level security;
alter table public.leads force row level security;

revoke all on public.leads from anon, authenticated, public;
grant insert, select, update on public.leads to service_role;

insert into storage.buckets (id, name, public)
values
  ('lead-originals', 'lead-originals', false),
  ('lead-visuals', 'lead-visuals', false)
on conflict (id) do update
set public = excluded.public;

-- storage.objects already has RLS on hosted Supabase. The migration role
-- is not the table owner, so ENABLE ROW LEVEL SECURITY cannot be re-run.
-- Confirm with: select relrowsecurity from pg_class c join pg_namespace n
--   on n.oid = c.relnamespace where n.nspname = 'storage' and c.relname = 'objects';

-- Geen policies voor lead-originals / lead-visuals:
-- anon en authenticated hebben geen lees- of schrijfrecht.
-- Alleen de server (service_role) mag uploaden en lezen.
