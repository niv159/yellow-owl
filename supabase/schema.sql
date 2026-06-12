-- Yellow Owl — database schema
-- Safe to run multiple times (idempotent).
-- Run via: Supabase → SQL Editor → New query → paste all → Run
-- Or automatically by deploy.js

-- ── Tables ──────────────────────────────────────────────────────────────────

create table if not exists children (
  id              uuid primary key default gen_random_uuid(),
  parent_id       uuid references auth.users(id) on delete cascade not null,
  name            text not null,
  age             integer not null,
  track           text not null check (track in ('junior', 'senior')),
  interest        text not null,
  baseline_scores jsonb,
  created_at      timestamptz default now()
);

create table if not exists sessions (
  id             uuid primary key default gen_random_uuid(),
  child_id       uuid references children(id) on delete cascade not null,
  week           integer not null,
  scores         jsonb not null default '{}',
  responsiveness integer default 0,
  child_tip      text default '',
  weakness       text default '',
  narrative      text default '',
  highlights     jsonb default '[]',
  transcript     text default '',
  created_at     timestamptz default now()
);

create table if not exists content_bank (
  id          uuid primary key default gen_random_uuid(),
  track       text not null,
  interest    text not null,
  step        integer not null,
  type        text not null,
  title       text not null,
  scenario    text not null,
  prompt      text not null,
  options     jsonb,
  curveball   text,
  reading_age integer,
  active      boolean default true,
  created_at  timestamptz default now()
);

create table if not exists baselines (
  id         uuid primary key default gen_random_uuid(),
  track      text not null,
  form       text not null,
  scenario   text not null,
  stages     jsonb not null,
  active     boolean default true,
  created_at timestamptz default now()
);

create table if not exists consent (
  id            uuid primary key default gen_random_uuid(),
  parent_id     uuid references auth.users(id) on delete cascade not null,
  child_id      uuid references children(id) on delete cascade not null,
  agreed        boolean not null,
  terms_version text not null,
  created_at    timestamptz default now()
);

-- ── Row Level Security ───────────────────────────────────────────────────────

alter table children     enable row level security;
alter table sessions     enable row level security;
alter table content_bank enable row level security;
alter table baselines    enable row level security;
alter table consent      enable row level security;

-- Drop first so re-runs don't fail on "already exists"
drop policy if exists "parent owns children"           on children;
drop policy if exists "parent owns sessions"           on sessions;
drop policy if exists "authenticated reads content"    on content_bank;
drop policy if exists "authenticated reads baselines"  on baselines;
drop policy if exists "parent owns consent"            on consent;

create policy "parent owns children" on children
  for all using (auth.uid() = parent_id);

create policy "parent owns sessions" on sessions
  for all using (
    exists (
      select 1 from children
      where children.id = sessions.child_id
        and children.parent_id = auth.uid()
    )
  );

-- content_bank and baselines are written by the seed endpoint (service role, bypasses RLS)
-- and read by any signed-in parent.
create policy "authenticated reads content" on content_bank
  for select using (auth.role() = 'authenticated');

create policy "authenticated reads baselines" on baselines
  for select using (auth.role() = 'authenticated');

create policy "parent owns consent" on consent
  for all using (auth.uid() = parent_id);
