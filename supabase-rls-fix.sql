-- Run this in Supabase SQL Editor → New query
-- Disables RLS on all three tables so Realtime works without policy setup

alter table messages disable row level security;
alter table owner_presence disable row level security;
alter table contacts disable row level security;

-- Verify Realtime is enabled on messages table
-- (re-add in case it wasn't applied)
alter publication supabase_realtime add table messages;
