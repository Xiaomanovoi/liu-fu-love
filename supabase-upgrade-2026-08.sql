-- 2026-08 upgrade: miss-you signals and private voice mailbox.
-- Run this entire file once in Supabase Dashboard > SQL Editor.

create table if not exists public.love_miss_events (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.love_couples(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('liu', 'fu')),
  created_at timestamptz not null default now()
);

create index if not exists love_miss_events_couple_created_idx
on public.love_miss_events(couple_id, created_at desc);

alter table public.love_miss_events enable row level security;

drop policy if exists "Pair can read miss signals" on public.love_miss_events;
create policy "Pair can read miss signals" on public.love_miss_events
for select to authenticated using (public.is_love_member(couple_id));

create or replace function public.get_love_miss_stats()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare target_couple_id uuid;
declare result jsonb;
begin
  select couple_id into target_couple_id
  from public.love_members
  where user_id = auth.uid();

  if target_couple_id is null then
    raise exception 'Please join a love space first';
  end if;

  select jsonb_build_object(
    'liu', jsonb_build_object(
      'total', count(*) filter (where role = 'liu'),
      'today', count(*) filter (
        where role = 'liu'
        and (created_at at time zone 'Asia/Shanghai')::date = (now() at time zone 'Asia/Shanghai')::date
      )
    ),
    'fu', jsonb_build_object(
      'total', count(*) filter (where role = 'fu'),
      'today', count(*) filter (
        where role = 'fu'
        and (created_at at time zone 'Asia/Shanghai')::date = (now() at time zone 'Asia/Shanghai')::date
      )
    )
  ) into result
  from public.love_miss_events
  where couple_id = target_couple_id;

  return result;
end;
$$;

create or replace function public.send_love_miss()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare target_couple_id uuid;
declare member_role text;
begin
  select couple_id, role into target_couple_id, member_role
  from public.love_members
  where user_id = auth.uid();

  if target_couple_id is null then
    raise exception 'Please join a love space first';
  end if;

  insert into public.love_miss_events(couple_id, user_id, role)
  values (target_couple_id, auth.uid(), member_role);

  return public.get_love_miss_stats();
end;
$$;

grant select on public.love_miss_events to authenticated;
revoke all on function public.get_love_miss_stats(), public.send_love_miss() from public;
grant execute on function public.get_love_miss_stats(), public.send_love_miss() to authenticated;

create table if not exists public.love_voice_messages (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.love_couples(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('liu', 'fu')),
  storage_path text not null unique,
  duration_seconds integer not null check (duration_seconds between 1 and 90),
  mime_type text not null default 'audio/webm',
  created_at timestamptz not null default now()
);

create index if not exists love_voice_messages_couple_created_idx
on public.love_voice_messages(couple_id, created_at desc);

alter table public.love_voice_messages enable row level security;

drop policy if exists "Pair can read voice messages" on public.love_voice_messages;
drop policy if exists "Members can create own voice messages" on public.love_voice_messages;
drop policy if exists "Members can delete own voice messages" on public.love_voice_messages;

create policy "Pair can read voice messages" on public.love_voice_messages
for select to authenticated using (public.is_love_member(couple_id));

create policy "Members can create own voice messages" on public.love_voice_messages
for insert to authenticated with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.love_members member
    where member.couple_id = love_voice_messages.couple_id
      and member.user_id = auth.uid()
      and member.role = love_voice_messages.role
  )
);

create policy "Members can delete own voice messages" on public.love_voice_messages
for delete to authenticated using (
  user_id = auth.uid() and public.is_love_member(couple_id)
);

grant select, insert, delete on public.love_voice_messages to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'love-voices',
  'love-voices',
  false,
  12582912,
  array['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/mpeg', 'audio/wav']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Pair can listen to love voices" on storage.objects;
drop policy if exists "Members can upload own love voices" on storage.objects;
drop policy if exists "Members can delete own love voices" on storage.objects;

create policy "Pair can listen to love voices" on storage.objects
for select to authenticated using (
  bucket_id = 'love-voices'
  and public.is_love_member(((storage.foldername(name))[1])::uuid)
);

create policy "Members can upload own love voices" on storage.objects
for insert to authenticated with check (
  bucket_id = 'love-voices'
  and public.is_love_member(((storage.foldername(name))[1])::uuid)
  and (storage.foldername(name))[2] = auth.uid()::text
);

create policy "Members can delete own love voices" on storage.objects
for delete to authenticated using (
  bucket_id = 'love-voices'
  and public.is_love_member(((storage.foldername(name))[1])::uuid)
  and (storage.foldername(name))[2] = auth.uid()::text
);

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'love_miss_events'
  ) then alter publication supabase_realtime add table public.love_miss_events; end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'love_voice_messages'
  ) then alter publication supabase_realtime add table public.love_voice_messages; end if;
end;
$$;

-- Protect shared deletions from stale whole-state writes on another device.
create or replace function public.protect_love_shared_deletions()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_deleted jsonb;
  v_items jsonb;
  v_achievements jsonb;
  v_field text;
  v_id text;
begin
  v_deleted :=
    case when jsonb_typeof(old.data -> 'deletedRecords') = 'object' then old.data -> 'deletedRecords' else '{}'::jsonb end
    ||
    case when jsonb_typeof(new.data -> 'deletedRecords') = 'object' then new.data -> 'deletedRecords' else '{}'::jsonb end;

  new.data := jsonb_set(coalesce(new.data, '{}'::jsonb), '{deletedRecords}', v_deleted, true);

  foreach v_field in array array['messages', 'tasks', 'loveNotes', 'studyLogs', 'gameRecords', 'meetings', 'photos']
  loop
    v_items := case when jsonb_typeof(new.data -> v_field) = 'array' then new.data -> v_field else '[]'::jsonb end;
    new.data := jsonb_set(
      new.data,
      array[v_field],
      coalesce((
        select jsonb_agg(item)
        from jsonb_array_elements(v_items) as item
        where not (v_deleted ? coalesce(item ->> 'id', ''))
      ), '[]'::jsonb),
      true
    );
  end loop;

  v_achievements := case when jsonb_typeof(new.data -> 'achievements') = 'object' then new.data -> 'achievements' else '{}'::jsonb end;
  v_items := case when jsonb_typeof(v_achievements -> 'custom') = 'array' then v_achievements -> 'custom' else '[]'::jsonb end;
  v_achievements := jsonb_set(
    v_achievements,
    '{custom}',
    coalesce((
      select jsonb_agg(item)
      from jsonb_array_elements(v_items) as item
      where not (v_deleted ? coalesce(item ->> 'id', ''))
    ), '[]'::jsonb),
    true
  );

  for v_id in
    select key from jsonb_each(v_deleted)
    where value ->> 'field' = 'achievementCustom'
  loop
    v_achievements := jsonb_set(
      v_achievements,
      '{completed}',
      (case when jsonb_typeof(v_achievements -> 'completed') = 'object' then v_achievements -> 'completed' else '{}'::jsonb end) - v_id,
      true
    );
    v_achievements := jsonb_set(
      v_achievements,
      '{edits}',
      (case when jsonb_typeof(v_achievements -> 'edits') = 'object' then v_achievements -> 'edits' else '{}'::jsonb end) - v_id,
      true
    );
  end loop;
  new.data := jsonb_set(new.data, '{achievements}', v_achievements, true);
  return new;
end;
$$;

drop trigger if exists protect_love_shared_deletions on public.love_shared_state;
create trigger protect_love_shared_deletions
before update on public.love_shared_state
for each row execute function public.protect_love_shared_deletions();

create or replace function public.delete_love_shared_record(p_field text, p_record_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_couple_id uuid;
  v_data jsonb;
  v_items jsonb;
  v_deleted jsonb;
  v_achievements jsonb;
begin
  if auth.uid() is null then raise exception 'Please sign in first'; end if;
  if not (p_field = any(array['messages', 'tasks', 'loveNotes', 'studyLogs', 'gameRecords', 'meetings', 'photos', 'achievementCustom']::text[])) then
    raise exception 'Unsupported shared record field';
  end if;

  select couple_id into v_couple_id
  from public.love_members
  where user_id = auth.uid()
  limit 1;
  if v_couple_id is null then raise exception 'Please join a love space first'; end if;

  select data into v_data
  from public.love_shared_state
  where couple_id = v_couple_id
  for update;
  v_data := coalesce(v_data, '{}'::jsonb);
  v_deleted :=
    case when jsonb_typeof(v_data -> 'deletedRecords') = 'object' then v_data -> 'deletedRecords' else '{}'::jsonb end
    || jsonb_build_object(
      p_record_id,
      jsonb_build_object('field', p_field, 'deletedAt', now()::text, 'deletedBy', auth.uid()::text)
    );
  v_data := jsonb_set(v_data, '{deletedRecords}', v_deleted, true);

  if p_field = 'achievementCustom' then
    v_achievements := case when jsonb_typeof(v_data -> 'achievements') = 'object' then v_data -> 'achievements' else '{}'::jsonb end;
    v_items := case when jsonb_typeof(v_achievements -> 'custom') = 'array' then v_achievements -> 'custom' else '[]'::jsonb end;
    v_achievements := jsonb_set(
      v_achievements,
      '{custom}',
      coalesce((select jsonb_agg(item) from jsonb_array_elements(v_items) as item where item ->> 'id' <> p_record_id), '[]'::jsonb),
      true
    );
    v_achievements := jsonb_set(v_achievements, '{completed}', (case when jsonb_typeof(v_achievements -> 'completed') = 'object' then v_achievements -> 'completed' else '{}'::jsonb end) - p_record_id, true);
    v_achievements := jsonb_set(v_achievements, '{edits}', (case when jsonb_typeof(v_achievements -> 'edits') = 'object' then v_achievements -> 'edits' else '{}'::jsonb end) - p_record_id, true);
    v_data := jsonb_set(v_data, '{achievements}', v_achievements, true);
  else
    v_items := case when jsonb_typeof(v_data -> p_field) = 'array' then v_data -> p_field else '[]'::jsonb end;
    v_data := jsonb_set(
      v_data,
      array[p_field],
      coalesce((select jsonb_agg(item) from jsonb_array_elements(v_items) as item where item ->> 'id' <> p_record_id), '[]'::jsonb),
      true
    );
  end if;

  update public.love_shared_state
  set data = v_data, updated_by = auth.uid()
  where couple_id = v_couple_id
  returning data into v_data;
  return v_data;
end;
$$;

revoke all on function public.delete_love_shared_record(text, text) from public;
grant execute on function public.delete_love_shared_record(text, text) to authenticated;


notify pgrst, 'reload schema';
