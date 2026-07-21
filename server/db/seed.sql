-- ============================================================
-- WealthPilot seed data
-- Run this AFTER schema.sql, in the Supabase SQL editor.
-- It populates the demo user so the dashboard looks realistic
-- the moment a reviewer opens the app.
--
-- The demo user id matches DEMO_USER_ID in server/config/constants.js.
-- ============================================================

-- Start clean so this script can be re-run safely.
delete from expenses        where user_id = '11111111-1111-1111-1111-111111111111';
delete from financial_goals where user_id = '11111111-1111-1111-1111-111111111111';
delete from profiles        where user_id = '11111111-1111-1111-1111-111111111111';

-- ------------------------------------------------------------
-- Profile
-- ------------------------------------------------------------
insert into profiles (user_id, income, net_worth, investments, debt)
values ('11111111-1111-1111-1111-111111111111', 7000, 125000, 45000, 10000);

-- ------------------------------------------------------------
-- Expenses (dated relative to today so "this month" always has data)
-- ------------------------------------------------------------
insert into expenses (user_id, name, amount, category, date) values
  ('11111111-1111-1111-1111-111111111111', 'Rent',                1800, 'Housing',        current_date - 1),
  ('11111111-1111-1111-1111-111111111111', 'Electricity bill',     140, 'Housing',        current_date - 3),
  ('11111111-1111-1111-1111-111111111111', 'Groceries',            320, 'Food',           current_date - 2),
  ('11111111-1111-1111-1111-111111111111', 'Restaurant dinner',     85, 'Food',           current_date - 5),
  ('11111111-1111-1111-1111-111111111111', 'Coffee shop',           42, 'Food',           current_date - 6),
  ('11111111-1111-1111-1111-111111111111', 'Gas',                  120, 'Transportation', current_date - 4),
  ('11111111-1111-1111-1111-111111111111', 'Monthly transit pass',  95, 'Transportation', current_date - 8),
  ('11111111-1111-1111-1111-111111111111', 'Movie tickets',         38, 'Entertainment',  current_date - 7),
  ('11111111-1111-1111-1111-111111111111', 'Streaming services',    45, 'Entertainment',  current_date - 9),
  ('11111111-1111-1111-1111-111111111111', 'Concert',              150, 'Entertainment',  current_date - 12),
  ('11111111-1111-1111-1111-111111111111', 'Pharmacy',              60, 'Healthcare',     current_date - 10),
  ('11111111-1111-1111-1111-111111111111', 'Doctor visit',         120, 'Healthcare',     current_date - 14),
  ('11111111-1111-1111-1111-111111111111', 'Gym membership',        55, 'Healthcare',     current_date - 11),
  ('11111111-1111-1111-1111-111111111111', 'Phone bill',            70, 'Other',          current_date - 13),
  ('11111111-1111-1111-1111-111111111111', 'Gift',                  90, 'Other',          current_date - 15);

-- ------------------------------------------------------------
-- Financial goals
-- ------------------------------------------------------------
insert into financial_goals (user_id, name, target_amount, current_amount) values
  ('11111111-1111-1111-1111-111111111111', 'Emergency Fund',       10000, 4000),
  ('11111111-1111-1111-1111-111111111111', 'Vacation to Japan',     6000, 2200),
  ('11111111-1111-1111-1111-111111111111', 'New Car Down Payment', 15000, 9000);
