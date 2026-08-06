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
    code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8));
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
  if target_couple_id is null then raise exception 'Please join a love space first'; end if;

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
  if target_couple_id is null then raise exception 'Please join a love space first'; end if;
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
for delete to authenticated using (user_id = auth.uid() and public.is_love_member(couple_id));

grant select, insert, delete on public.love_voice_messages to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'love-voices', 'love-voices', false, 12582912,
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

-- Merge concurrent whole-state writes and protect deletions from stale clients.
create or replace function public.protect_love_shared_deletions()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_deleted jsonb;
  v_items jsonb;
  v_old_items jsonb;
  v_new_items jsonb;
  v_achievements jsonb;
  v_field text;
  v_id text;
begin
  v_deleted :=
    case when jsonb_typeof(old.data -> 'deletedRecords') = 'object' then old.data -> 'deletedRecords' else '{}'::jsonb end
    ||
    case when jsonb_typeof(new.data -> 'deletedRecords') = 'object' then new.data -> 'deletedRecords' else '{}'::jsonb end;

  new.data := jsonb_set(coalesce(new.data, '{}'::jsonb), '{deletedRecords}', v_deleted, true);

  foreach v_field in array array['messages', 'tasks', 'loveNotes', 'studyLogs', 'gameRecords', 'meetings', 'photos', 'wheels', 'wheelOptions', 'wheelHistory']
  loop
    if not (new.data ? v_field) then
      new.data := jsonb_set(
        new.data,
        array[v_field],
        case when jsonb_typeof(old.data -> v_field) = 'array' then old.data -> v_field else '[]'::jsonb end,
        true
      );
      continue;
    end if;
    v_old_items := case when jsonb_typeof(old.data -> v_field) = 'array' then old.data -> v_field else '[]'::jsonb end;
    v_new_items := case when jsonb_typeof(new.data -> v_field) = 'array' then new.data -> v_field else '[]'::jsonb end;
    if v_field = 'gameRecords' then
      select coalesce(jsonb_agg(
        case
          when coalesce(new_item.item ->> 'image', '') = '' then
            new_item.item || coalesce((
              select jsonb_build_object('image', old_item.item -> 'image')
              from jsonb_array_elements(v_old_items) as old_item(item)
              where old_item.item ->> 'id' = new_item.item ->> 'id'
                and coalesce(old_item.item ->> 'image', '') <> ''
              limit 1
            ), '{}'::jsonb)
          else new_item.item
        end
      ), '[]'::jsonb)
      into v_new_items
      from jsonb_array_elements(v_new_items) as new_item(item);
    end if;
    select coalesce(jsonb_agg(chosen.item order by chosen.item_order), '[]'::jsonb)
    into v_items
    from (
      select distinct on (candidate.item ->> 'id') candidate.item, candidate.item_order
      from (
        select old_item.item, old_item.item_order, 0 as source_order
        from jsonb_array_elements(v_old_items) with ordinality as old_item(item, item_order)
        union all
        select new_item.item, new_item.item_order, 1 as source_order
        from jsonb_array_elements(v_new_items) with ordinality as new_item(item, item_order)
      ) candidate
      where coalesce(candidate.item ->> 'id', '') <> ''
        and not (v_deleted ? coalesce(candidate.item ->> 'id', ''))
      order by candidate.item ->> 'id',
        coalesce(candidate.item ->> 'updatedAt', candidate.item ->> 'createdAt', candidate.item ->> 'date', '') desc,
        candidate.source_order desc
    ) chosen;
    new.data := jsonb_set(
      new.data,
      array[v_field],
      v_items,
      true
    );
  end loop;

  v_achievements := case when jsonb_typeof(new.data -> 'achievements') = 'object' then new.data -> 'achievements' else '{}'::jsonb end;
  v_old_items := case when jsonb_typeof(old.data -> 'achievements' -> 'custom') = 'array' then old.data -> 'achievements' -> 'custom' else '[]'::jsonb end;
  v_new_items := case when jsonb_typeof(v_achievements -> 'custom') = 'array' then v_achievements -> 'custom' else '[]'::jsonb end;
  select coalesce(jsonb_agg(chosen.item order by chosen.item_order), '[]'::jsonb)
  into v_items
  from (
    select distinct on (candidate.item ->> 'id') candidate.item, candidate.item_order
    from (
      select old_item.item, old_item.item_order, 0 as source_order
      from jsonb_array_elements(v_old_items) with ordinality as old_item(item, item_order)
      union all
      select new_item.item, new_item.item_order, 1 as source_order
      from jsonb_array_elements(v_new_items) with ordinality as new_item(item, item_order)
    ) candidate
    where coalesce(candidate.item ->> 'id', '') <> ''
      and not (v_deleted ? coalesce(candidate.item ->> 'id', ''))
    order by candidate.item ->> 'id',
      coalesce(candidate.item ->> 'updatedAt', candidate.item ->> 'createdAt', candidate.item ->> 'date', '') desc,
      candidate.source_order desc
  ) chosen;
  v_achievements := jsonb_set(
    v_achievements,
    '{custom}',
    v_items,
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

create or replace function public.love_shared_core_data(p_data jsonb)
returns jsonb
language sql
immutable
set search_path = public
as $$
  select jsonb_set(
    coalesce(p_data, '{}'::jsonb) - 'photos',
    '{gameRecords}',
    coalesce((
      select jsonb_agg(item - 'image')
      from jsonb_array_elements(
        case when jsonb_typeof(p_data -> 'gameRecords') = 'array' then p_data -> 'gameRecords' else '[]'::jsonb end
      ) as game(item)
    ), '[]'::jsonb),
    true
  );
$$;

create or replace function public.get_love_shared_core()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_couple_id uuid;
  v_data jsonb;
  v_updated_at timestamptz;
  v_exists boolean;
begin
  if auth.uid() is null then raise exception 'Please sign in first'; end if;
  select couple_id into v_couple_id
  from public.love_members
  where user_id = auth.uid()
  limit 1;
  if v_couple_id is null then raise exception 'Please join a love space first'; end if;

  select data, updated_at into v_data, v_updated_at
  from public.love_shared_state
  where couple_id = v_couple_id;
  v_exists := found;

  return jsonb_build_object(
    'exists', v_exists,
    'media_split', true,
    'data', public.love_shared_core_data(v_data),
    'updated_at', v_updated_at
  );
end;
$$;

create or replace function public.get_love_shared_media()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_couple_id uuid;
  v_data jsonb;
  v_game_images jsonb;
begin
  if auth.uid() is null then raise exception 'Please sign in first'; end if;
  select couple_id into v_couple_id
  from public.love_members
  where user_id = auth.uid()
  limit 1;
  if v_couple_id is null then raise exception 'Please join a love space first'; end if;

  select data into v_data
  from public.love_shared_state
  where couple_id = v_couple_id;
  v_data := coalesce(v_data, '{}'::jsonb);
  select coalesce(jsonb_agg(jsonb_build_object('id', item ->> 'id', 'image', item -> 'image')), '[]'::jsonb)
  into v_game_images
  from jsonb_array_elements(
    case when jsonb_typeof(v_data -> 'gameRecords') = 'array' then v_data -> 'gameRecords' else '[]'::jsonb end
  ) as game(item)
  where coalesce(item ->> 'id', '') <> '' and coalesce(item ->> 'image', '') <> '';

  return jsonb_build_object(
    'photos', case when jsonb_typeof(v_data -> 'photos') = 'array' then v_data -> 'photos' else '[]'::jsonb end,
    'gameImages', v_game_images
  );
end;
$$;

create or replace function public.get_love_shared_photos()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_couple_id uuid;
  v_photos jsonb;
begin
  if auth.uid() is null then raise exception 'Please sign in first'; end if;
  select couple_id into v_couple_id
  from public.love_members
  where user_id = auth.uid()
  limit 1;
  if v_couple_id is null then raise exception 'Please join a love space first'; end if;

  select data -> 'photos' into v_photos
  from public.love_shared_state
  where couple_id = v_couple_id;
  return case when jsonb_typeof(v_photos) = 'array' then v_photos else '[]'::jsonb end;
end;
$$;

revoke all on function public.get_love_shared_core() from public;
revoke all on function public.get_love_shared_photos() from public;
revoke all on function public.get_love_shared_media() from public;
grant execute on function public.get_love_shared_core() to authenticated;
grant execute on function public.get_love_shared_photos() to authenticated;
grant execute on function public.get_love_shared_media() to authenticated;

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
  if not (p_field = any(array['messages', 'tasks', 'loveNotes', 'studyLogs', 'gameRecords', 'meetings', 'photos', 'wheels', 'wheelOptions', 'wheelHistory', 'achievementCustom']::text[])) then
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
  return public.love_shared_core_data(v_data);
end;
$$;

revoke all on function public.delete_love_shared_record(text, text) from public;
grant execute on function public.delete_love_shared_record(text, text) to authenticated;


notify pgrst, 'reload schema';
