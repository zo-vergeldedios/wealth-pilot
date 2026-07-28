-- ============================================================
-- Migration 001: add auth (users table) + wire up foreign keys
-- ------------------------------------------------------------
-- Purpose: upgrade an EXISTING WealthPilot database (which already has
-- profiles / expenses / income / financial_goals with a plain user_id column)
-- to the token-based auth model, WITHOUT dropping or recreating anything.
--
-- Safe to run multiple times: every step is guarded (IF NOT EXISTS / ON
-- CONFLICT / catalog checks), so re-running is a no-op. No existing data is
-- deleted or reset.
--
-- Run this in the Supabase SQL editor (Dashboard -> SQL Editor).
-- ============================================================

-- pgcrypto gives us gen_random_uuid() for the users PK and user_token default.
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 1. Create the users table (only if it isn't there yet).
-- ------------------------------------------------------------
create table if not exists users (
  id         uuid primary key default gen_random_uuid(),
  username   text not null unique,
  user_token uuid not null unique default gen_random_uuid(),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 2. Backfill users so existing rows have an owner to point at.
--
-- Foreign keys are validated against existing data when added, so every
-- user_id already present in the data tables must exist in `users` FIRST or
-- step 3 would fail.
-- ------------------------------------------------------------

-- 2a. The pre-seeded demo account. Its id matches the user_id on all the
-- existing seed rows, and the fixed token matches db/seed.sql so you can log
-- in as username "demo". ON CONFLICT keeps this safe to re-run.
insert into users (id, username, user_token)
values (
  '11111111-1111-1111-1111-111111111111',
  'demo',
  '22222222-2222-2222-2222-222222222222'
)
on conflict (id) do nothing;

-- 2b. Safety net: create a user row for ANY other distinct user_id that
-- already exists in the data tables but isn't in `users` yet. The username is
-- derived from the id (guaranteed unique, since id is unique) so it never
-- collides. Normally this inserts nothing beyond the demo user above.
insert into users (id, username)
select distinct t.user_id, 'user_' || replace(t.user_id::text, '-', '')
from (
  select user_id from profiles
  union
  select user_id from expenses
  union
  select user_id from income
  union
  select user_id from financial_goals
) t
where t.user_id is not null
  and not exists (select 1 from users u where u.id = t.user_id)
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- 3. Add the foreign keys (only if the constraint isn't already present).
--
-- Postgres has no "ADD CONSTRAINT IF NOT EXISTS", so each add is wrapped in a
-- DO block that first checks pg_constraint by name. The names match the ones
-- a fresh schema.sql would generate, so this won't duplicate them.
-- ------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_user_id_fkey') then
    alter table profiles
      add constraint profiles_user_id_fkey
      foreign key (user_id) references users (id) on delete cascade;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'expenses_user_id_fkey') then
    alter table expenses
      add constraint expenses_user_id_fkey
      foreign key (user_id) references users (id) on delete cascade;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'income_user_id_fkey') then
    alter table income
      add constraint income_user_id_fkey
      foreign key (user_id) references users (id) on delete cascade;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'financial_goals_user_id_fkey') then
    alter table financial_goals
      add constraint financial_goals_user_id_fkey
      foreign key (user_id) references users (id) on delete cascade;
  end if;
end $$;

-- ------------------------------------------------------------
-- 4. Make sure profiles.user_id is unique (one profile per user).
-- The original schema declared this inline; older databases may lack it.
-- ------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_user_id_key') then
    alter table profiles
      add constraint profiles_user_id_key unique (user_id);
  end if;
end $$;

-- ------------------------------------------------------------
-- 5. Supporting indexes (idempotent — no-op if they already exist).
-- ------------------------------------------------------------
create index if not exists expenses_user_date_idx        on expenses (user_id, date desc);
create index if not exists income_user_date_idx          on income (user_id, date desc);
create index if not exists financial_goals_user_idx      on financial_goals (user_id);
