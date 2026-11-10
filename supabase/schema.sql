-- OCD Live : base de données des réservations.
-- À coller une seule fois dans Supabase > SQL Editor > Run.

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  member_no integer not null,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled')),
  mode text not null check (mode in ('presentiel', 'distance')),
  date date not null,
  slot_start text not null,
  slot_end text not null,
  package_id text not null,
  price_fcfa integer not null,
  business_name text not null,
  business_type text not null,
  description text not null,
  contact_name text not null,
  whatsapp text not null,
  city text not null,
  country text not null,
  created_at timestamptz not null default now()
);

-- Un seul live par créneau : la base refuse elle-même la double réservation.
create unique index if not exists reservations_one_per_slot
  on public.reservations (date, slot_start)
  where status <> 'cancelled';

create index if not exists reservations_whatsapp_idx on public.reservations (whatsapp);
create index if not exists reservations_date_idx on public.reservations (date);

-- Personne ne lit la table depuis un navigateur : seul le serveur du site
-- y accède, avec la clé secrète (service role), qui ignore ces règles.
alter table public.reservations enable row level security;
