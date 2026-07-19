-- MiPeticion — esquema inicial (Incremento 3: auth + guardado + tracker).
-- Modelo: profiles (espejo de auth.users), petitions, filings, events.
-- Seguridad: RLS por auth.uid(); cada quien solo ve y edita lo suyo.

-- ============ Enums ============
create type doc_type as enum ('CC', 'NIT', 'CE', 'PASAPORTE', 'TI');

create type petition_tipo as enum (
  'peticion_interes_particular',
  'peticion_interes_general',
  'peticion_informacion',
  'consulta',
  'queja',
  'reclamo',
  'sugerencia',
  'denuncia'
);

create type petition_status as enum (
  'draft',
  'generated',
  'filed',
  'awaiting_response',
  'responded',
  'overdue',
  'tutela_drafted'
);

-- ============ profiles ============
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text,
  doc_type doc_type,
  doc_number text,
  email text,
  ciudad text,
  consent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============ petitions ============
create table public.petitions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  entity text not null default 'DIAN',
  tipo petition_tipo not null,
  category text,
  problem_text text,
  requested_action text,
  document jsonb,
  status petition_status not null default 'generated',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index petitions_user_id_idx on public.petitions (user_id);

-- ============ filings ============
create table public.filings (
  id uuid primary key default gen_random_uuid(),
  petition_id uuid not null references public.petitions (id) on delete cascade,
  radicado_number text,
  filed_date date,
  legal_term_days integer,
  due_date date,
  response_received_at timestamptz,
  created_at timestamptz not null default now()
);

create index filings_petition_id_idx on public.filings (petition_id);
create index filings_due_date_idx on public.filings (due_date);

-- ============ events ============
create table public.events (
  id uuid primary key default gen_random_uuid(),
  petition_id uuid not null references public.petitions (id) on delete cascade,
  type text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);

create index events_petition_id_idx on public.events (petition_id);

-- ============ updated_at trigger ============
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger petitions_set_updated_at
  before update on public.petitions
  for each row execute function public.set_updated_at();

-- ============ RLS ============
alter table public.profiles enable row level security;
alter table public.petitions enable row level security;
alter table public.filings enable row level security;
alter table public.events enable row level security;

-- profiles: cada quien administra su propio perfil.
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles
  for delete using (auth.uid() = id);

-- petitions: cada quien administra sus peticiones.
create policy "petitions_select_own" on public.petitions
  for select using (auth.uid() = user_id);
create policy "petitions_insert_own" on public.petitions
  for insert with check (auth.uid() = user_id);
create policy "petitions_update_own" on public.petitions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "petitions_delete_own" on public.petitions
  for delete using (auth.uid() = user_id);

-- filings: acceso a través de la petición dueña.
create policy "filings_select_own" on public.filings
  for select using (
    exists (select 1 from public.petitions p where p.id = petition_id and p.user_id = auth.uid())
  );
create policy "filings_insert_own" on public.filings
  for insert with check (
    exists (select 1 from public.petitions p where p.id = petition_id and p.user_id = auth.uid())
  );
create policy "filings_update_own" on public.filings
  for update using (
    exists (select 1 from public.petitions p where p.id = petition_id and p.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.petitions p where p.id = petition_id and p.user_id = auth.uid())
  );
create policy "filings_delete_own" on public.filings
  for delete using (
    exists (select 1 from public.petitions p where p.id = petition_id and p.user_id = auth.uid())
  );

-- events: acceso a través de la petición dueña.
create policy "events_select_own" on public.events
  for select using (
    exists (select 1 from public.petitions p where p.id = petition_id and p.user_id = auth.uid())
  );
create policy "events_insert_own" on public.events
  for insert with check (
    exists (select 1 from public.petitions p where p.id = petition_id and p.user_id = auth.uid())
  );
