-- ============================================================
-- WealthPilot database schema
-- Run this in the Supabase SQL editor (Dashboard -> SQL Editor).
-- ============================================================

-- The pgcrypto extension gives us gen_random_uuid() for primary keys.
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- profiles: one row per user holding their high-level finances.
-- ------------------------------------------------------------
create table if not exists profiles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null unique,
  income      numeric(12, 2) not null default 0,   -- monthly income
  net_worth   numeric(12, 2) not null default 0,
  investments numeric(12, 2) not null default 0,
  debt        numeric(12, 2) not null default 0,
  created_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- expenses: every transaction the user logs.
-- ------------------------------------------------------------
create table if not exists expenses (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null,
  name       text not null,
  amount     numeric(12, 2) not null,
  category   text not null,
  date       date not null,
  created_at timestamptz not null default now()
);

-- Speeds up the common "all expenses for this user, newest first" query.
create index if not exists expenses_user_date_idx
  on expenses (user_id, date desc);

-- ------------------------------------------------------------
-- financial_goals: savings targets the user is working toward.
-- ------------------------------------------------------------
create table if not exists financial_goals (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null,
  name           text not null,
  target_amount  numeric(12, 2) not null,
  current_amount numeric(12, 2) not null default 0,
  created_at     timestamptz not null default now()
);

create index if not exists financial_goals_user_idx
  on financial_goals (user_id);

-- ------------------------------------------------------------
-- Row Level Security note:
-- The Express API connects with the service_role key, which bypasses RLS.
-- Because all access goes through our server (never directly from the
-- browser), we intentionally leave RLS off for this single-user MVP.
-- If real auth is added later, enable RLS and add per-user policies here.
-- ------------------------------------------------------------
