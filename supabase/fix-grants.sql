-- COLLE TOUT CE BLOC dans Supabase → SQL Editor → Run
-- Corrige le 500 à la réservation : permission denied for table reservations / booked_slots

-- 1) Droits sur le schéma
grant usage on schema public to postgres, anon, authenticated, service_role;

-- 2) Droits complets pour le serveur du site (clé service_role)
grant select, insert, update, delete, references, trigger on table public.reservations to service_role;
grant select, insert, update, delete, references, trigger on table public.booked_slots to service_role;

grant all on table public.reservations to postgres;
grant all on table public.booked_slots to postgres;

-- 3) Pas d'accès direct depuis le navigateur
revoke all on table public.reservations from anon, authenticated;
revoke all on table public.booked_slots from anon, authenticated;

-- 4) Vérification (doit afficher service_role avec des droits)
select grantee, table_name, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in ('reservations', 'booked_slots')
  and grantee in ('service_role', 'anon', 'authenticated')
order by table_name, grantee, privilege_type;
