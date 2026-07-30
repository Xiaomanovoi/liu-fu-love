-- 刘向强 × 付嘉颖：Supabase 数据库脚本
-- Run the entire file once in Supabase Dashboard > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.love_couples (
  id uuid primary key default gen_random_uuid(),
  invite_code text not null unique,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.love_members (
  couple_id uuid not null references public.love_couples(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('liu', 'fu')),
  created_at timestamptz not null default now(),
  primary key (couple_id, user_id),
  unique (couple_id, role),
  unique (user_id)
);

create table if not exists public.love_shared_state (
  couple_id uuid primary key references public.love_couples(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists public.love_private_state (
  couple_id uuid not null references public.love_couples(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (couple_id, user_id)
);

create or replace function public.is_love_member(target_couple_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.love_members
    where couple_id = target_couple_id and user_id = auth.uid()
  );
$$;

create or replace function public.new_love_invite_code()
returns text
language plpgsql
volatile
set search_path = public
as $$
declare code text;
begin
  loop
    code := upper(substr(encode(gen_random_bytes(5), 'hex'), 1, 8));
    exit when not exists (select 1 from public.love_couples where invite_code = code);
  end loop;
  return code;
end;
$$;

create or replace function public.create_love_space(p_role text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare new_couple_id uuid;
declare new_code text;
begin
  if auth.uid() is null then raise exception 'Please sign in first'; end if;
  if p_role not in ('liu', 'fu') then raise exception 'Invalid role'; end if;
  if exists (select 1 from public.love_members where user_id = auth.uid()) then
    raise exception 'This account already belongs to a couple space';
  end if;
  new_code := public.new_love_invite_code();
  insert into public.love_couples(invite_code, created_by)
  values (new_code, auth.uid()) returning id into new_couple_id;
  insert into public.love_members(couple_id, user_id, role)
  values (new_couple_id, auth.uid(), p_role);
  insert into public.love_shared_state(couple_id) values (new_couple_id);
  return jsonb_build_object('couple_id', new_couple_id, 'invite_code', new_code);
end;
$$;

create or replace function public.join_love_space(p_invite_code text, p_role text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare target_couple_id uuid;
begin
  if auth.uid() is null then raise exception 'Please sign in first'; end if;
  if p_role not in ('liu', 'fu') then raise exception 'Invalid role'; end if;
  if exists (select 1 from public.love_members where user_id = auth.uid()) then
    raise exception 'This account already belongs to a couple space';
  end if;
  select id into target_couple_id from public.love_couples where invite_code = upper(trim(p_invite_code)) for update;
  if target_couple_id is null then raise exception 'Invite code not found'; end if;
  if exists (select 1 from public.love_members where couple_id = target_couple_id and role = p_role) then
    raise exception 'Choose your own role before joining';
  end if;
  if (select count(*) from public.love_members where couple_id = target_couple_id) >= 2 then
    raise exception 'This couple space already has two members';
  end if;
  insert into public.love_members(couple_id, user_id, role)
  values (target_couple_id, auth.uid(), p_role);
  return jsonb_build_object('couple_id', target_couple_id);
end;
$$;

grant usage on schema public to authenticated;
grant select, insert, update on public.love_couples, public.love_members, public.love_shared_state, public.love_private_state to authenticated;
grant execute on function public.create_love_space(text), public.join_love_space(text, text) to authenticated;

alter table public.love_couples enable row level security;
alter table public.love_members enable row level security;
alter table public.love_shared_state enable row level security;
alter table public.love_private_state enable row level security;

drop policy if exists "Couple members can read their space" on public.love_couples;
drop policy if exists "Couple members can see their pair" on public.love_members;
drop policy if exists "Pair can read shared state" on public.love_shared_state;
drop policy if exists "Pair can create shared state" on public.love_shared_state;
drop policy if exists "Pair can update shared state" on public.love_shared_state;
drop policy if exists "Users can read only their private state" on public.love_private_state;
drop policy if exists "Users can create only their private state" on public.love_private_state;
drop policy if exists "Users can update only their private state" on public.love_private_state;

create policy "Couple members can read their space" on public.love_couples
for select to authenticated using (public.is_love_member(id));

create policy "Couple members can see their pair" on public.love_members
for select to authenticated using (public.is_love_member(couple_id));

create policy "Pair can read shared state" on public.love_shared_state
for select to authenticated using (public.is_love_member(couple_id));
create policy "Pair can create shared state" on public.love_shared_state
for insert to authenticated with check (public.is_love_member(couple_id));
create policy "Pair can update shared state" on public.love_shared_state
for update to authenticated using (public.is_love_member(couple_id)) with check (public.is_love_member(couple_id));

create policy "Users can read only their private state" on public.love_private_state
for select to authenticated using (user_id = auth.uid() and public.is_love_member(couple_id));
create policy "Users can create only their private state" on public.love_private_state
for insert to authenticated with check (user_id = auth.uid() and public.is_love_member(couple_id));
create policy "Users can update only their private state" on public.love_private_state
for update to authenticated using (user_id = auth.uid() and public.is_love_member(couple_id)) with check (user_id = auth.uid() and public.is_love_member(couple_id));

create or replace function public.touch_love_state()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists touch_love_shared_state on public.love_shared_state;
create trigger touch_love_shared_state before update on public.love_shared_state
for each row execute function public.touch_love_state();
drop trigger if exists touch_love_private_state on public.love_private_state;
create trigger touch_love_private_state before update on public.love_private_state
for each row execute function public.touch_love_state();

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'love_shared_state'
  ) then alter publication supabase_realtime add table public.love_shared_state; end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'love_private_state'
  ) then alter publication supabase_realtime add table public.love_private_state; end if;
end;
$$;

notify pgrst, 'reload schema';
