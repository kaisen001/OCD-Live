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
  address text not null default '',
  city text not null,
  country text not null,
  created_at timestamptz not null default now()
);

create index if not exists reservations_whatsapp_idx on public.reservations (whatsapp);
create index if not exists reservations_date_idx on public.reservations (date);

-- Les créneaux occupés. Un package long occupe plusieurs créneaux de suite.
-- La clé (date, créneau) est unique : la base refuse elle-même la double réservation.
create table if not exists public.booked_slots (
  date date not null,
  slot_start text not null,
  reservation_id uuid not null,
  primary key (date, slot_start)
);

create index if not exists booked_slots_reservation_idx on public.booked_slots (reservation_id);

-- Personne ne lit ces tables depuis un navigateur : seul le serveur du site
-- y accède, avec la clé secrète (service role), qui ignore ces règles.
alter table public.reservations enable row level security;
alter table public.booked_slots enable row level security;

grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on table public.reservations to postgres, service_role;
grant all on table public.booked_slots to postgres, service_role;
revoke all on table public.reservations from anon, authenticated;
revoke all on table public.booked_slots from anon, authenticated;
