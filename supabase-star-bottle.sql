-- 心动存档：星语瓶独立数据表与安全接口
-- 在 Supabase Dashboard > SQL Editor 中完整执行一次。

create extension if not exists pgcrypto;

create table if not exists public.love_star_notes (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.love_couples(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  sender_role text not null check (sender_role in ('liu', 'fu')),
  recipient_role text not null check (recipient_role in ('liu', 'fu')),
  content text not null check (char_length(btrim(content)) between 1 and 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  opened_at timestamptz,
  opened_by uuid references auth.users(id) on delete set null,
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id) on delete set null,
  check (sender_role <> recipient_role)
);

alter table public.love_star_notes
add column if not exists client_token text;

create unique index if not exists love_star_notes_client_token_idx
on public.love_star_notes(sender_id, client_token)
where client_token is not null;

create index if not exists love_star_notes_unopened_idx
on public.love_star_notes(couple_id, recipient_role, created_at)
where opened_at is null and deleted_at is null;

create index if not exists love_star_notes_sender_pending_idx
on public.love_star_notes(sender_id, created_at desc)
where opened_at is null and deleted_at is null;

create index if not exists love_star_notes_history_idx
on public.love_star_notes(couple_id, opened_at desc)
where opened_at is not null and deleted_at is null;

create index if not exists love_star_notes_daily_open_idx
on public.love_star_notes(couple_id, recipient_role, opened_at)
where opened_at is not null;

alter table public.love_star_notes enable row level security;
revoke all on public.love_star_notes from anon, authenticated;

create or replace function public.get_love_star_snapshot(
  p_history_recipient text default null,
  p_history_limit integer default 5,
  p_history_offset integer default 0,
  p_pending_limit integer default 5,
  p_pending_offset integer default 0
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_couple_id uuid;
  v_role text;
  v_counts jsonb;
  v_opened_today boolean;
  v_pending jsonb;
  v_pending_total integer;
  v_history jsonb;
  v_history_total integer;
  v_history_limit integer := least(greatest(coalesce(p_history_limit, 5), 1), 5000);
  v_history_offset integer := greatest(coalesce(p_history_offset, 0), 0);
  v_pending_limit integer := least(greatest(coalesce(p_pending_limit, 5), 1), 5000);
  v_pending_offset integer := greatest(coalesce(p_pending_offset, 0), 0);
begin
  if auth.uid() is null then raise exception 'Please sign in first'; end if;
  if p_history_recipient is not null and p_history_recipient not in ('liu', 'fu') then
    raise exception 'Invalid history recipient';
  end if;

  select couple_id, role into v_couple_id, v_role
  from public.love_members
  where user_id = auth.uid()
  limit 1;
  if v_couple_id is null then raise exception 'Please join a love space first'; end if;

  select jsonb_build_object(
    'liu', count(*) filter (where recipient_role = 'liu'),
    'fu', count(*) filter (where recipient_role = 'fu')
  ) into v_counts
  from public.love_star_notes
  where couple_id = v_couple_id
    and opened_at is null
    and deleted_at is null;

  select exists (
    select 1
    from public.love_star_notes
    where couple_id = v_couple_id
      and recipient_role = v_role
      and opened_at is not null
      and (opened_at at time zone 'Asia/Shanghai')::date = (now() at time zone 'Asia/Shanghai')::date
  ) into v_opened_today;

  select count(*) into v_pending_total
  from public.love_star_notes
  where couple_id = v_couple_id
    and sender_id = auth.uid()
    and opened_at is null
    and deleted_at is null;

  select coalesce(jsonb_agg(to_jsonb(pending_row) order by pending_row.created_at desc), '[]'::jsonb)
  into v_pending
  from (
    select id, sender_role, recipient_role, content, created_at, updated_at, client_token
    from public.love_star_notes
    where couple_id = v_couple_id
      and sender_id = auth.uid()
      and opened_at is null
      and deleted_at is null
    order by created_at desc
    limit v_pending_limit offset v_pending_offset
  ) pending_row;

  select count(*) into v_history_total
  from public.love_star_notes
  where couple_id = v_couple_id
    and opened_at is not null
    and deleted_at is null
    and (p_history_recipient is null or recipient_role = p_history_recipient);

  select coalesce(jsonb_agg(to_jsonb(history_row) order by history_row.opened_at desc), '[]'::jsonb)
  into v_history
  from (
    select id, sender_role, recipient_role, content, created_at, updated_at, opened_at,
      sender_id = auth.uid() as can_delete
    from public.love_star_notes
    where couple_id = v_couple_id
      and opened_at is not null
      and deleted_at is null
      and (p_history_recipient is null or recipient_role = p_history_recipient)
    order by opened_at desc
    limit v_history_limit offset v_history_offset
  ) history_row;

  return jsonb_build_object(
    'role', v_role,
    'counts', coalesce(v_counts, jsonb_build_object('liu', 0, 'fu', 0)),
    'opened_today', v_opened_today,
    'pending', v_pending,
    'pending_total', v_pending_total,
    'history', v_history,
    'history_total', v_history_total,
    'history_recipient', p_history_recipient,
    'server_date', (now() at time zone 'Asia/Shanghai')::date
  );
end;
$$;

create or replace function public.get_love_star_summary()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_couple_id uuid;
  v_role text;
  v_counts jsonb;
  v_opened_today boolean;
  v_pending_total integer;
  v_history_total integer;
begin
  if auth.uid() is null then raise exception 'Please sign in first'; end if;

  select couple_id, role into v_couple_id, v_role
  from public.love_members
  where user_id = auth.uid()
  limit 1;
  if v_couple_id is null then raise exception 'Please join a love space first'; end if;

  select jsonb_build_object(
    'liu', count(*) filter (where recipient_role = 'liu'),
    'fu', count(*) filter (where recipient_role = 'fu')
  ) into v_counts
  from public.love_star_notes
  where couple_id = v_couple_id
    and opened_at is null
    and deleted_at is null;

  select exists (
    select 1
    from public.love_star_notes
    where couple_id = v_couple_id
      and recipient_role = v_role
      and opened_at is not null
      and (opened_at at time zone 'Asia/Shanghai')::date = (now() at time zone 'Asia/Shanghai')::date
  ) into v_opened_today;

  select count(*) into v_pending_total
  from public.love_star_notes
  where couple_id = v_couple_id
    and sender_id = auth.uid()
    and opened_at is null
    and deleted_at is null;

  select count(*) into v_history_total
  from public.love_star_notes
  where couple_id = v_couple_id
    and opened_at is not null
    and deleted_at is null;

  return jsonb_build_object(
    'role', v_role,
    'counts', coalesce(v_counts, jsonb_build_object('liu', 0, 'fu', 0)),
    'opened_today', v_opened_today,
    'pending_total', v_pending_total,
    'history_total', v_history_total,
    'server_date', (now() at time zone 'Asia/Shanghai')::date
  );
end;
$$;

create or replace function public.create_love_star(p_content text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_couple_id uuid;
  v_role text;
  v_recipient text;
  v_note public.love_star_notes%rowtype;
begin
  if auth.uid() is null then raise exception 'Please sign in first'; end if;
  if char_length(btrim(coalesce(p_content, ''))) not between 1 and 500 then
    raise exception 'Star content must contain 1 to 500 characters';
  end if;
  select couple_id, role into v_couple_id, v_role
  from public.love_members
  where user_id = auth.uid()
  limit 1;
  if v_couple_id is null then raise exception 'Please join a love space first'; end if;
  v_recipient := case when v_role = 'liu' then 'fu' else 'liu' end;

  insert into public.love_star_notes(couple_id, sender_id, sender_role, recipient_role, content)
  values (v_couple_id, auth.uid(), v_role, v_recipient, btrim(p_content))
  returning * into v_note;

  return jsonb_build_object(
    'id', v_note.id,
    'sender_role', v_note.sender_role,
    'recipient_role', v_note.recipient_role,
    'content', v_note.content,
    'created_at', v_note.created_at,
    'updated_at', v_note.updated_at
  );
end;
$$;

create or replace function public.create_love_star_v2(p_content text, p_client_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_couple_id uuid;
  v_role text;
  v_recipient text;
  v_note public.love_star_notes%rowtype;
  v_counts jsonb;
begin
  if auth.uid() is null then raise exception 'Please sign in first'; end if;
  if char_length(btrim(coalesce(p_content, ''))) not between 1 and 500 then
    raise exception 'Star content must contain 1 to 500 characters';
  end if;
  if char_length(btrim(coalesce(p_client_token, ''))) not between 8 and 100 then
    raise exception 'Invalid star client token';
  end if;

  select couple_id, role into v_couple_id, v_role
  from public.love_members
  where user_id = auth.uid()
  limit 1;
  if v_couple_id is null then raise exception 'Please join a love space first'; end if;
  v_recipient := case when v_role = 'liu' then 'fu' else 'liu' end;

  select * into v_note
  from public.love_star_notes
  where sender_id = auth.uid()
    and client_token = btrim(p_client_token)
  limit 1;

  if v_note.id is not null
    and v_note.opened_at is null
    and v_note.deleted_at is null
    and v_note.content is distinct from btrim(p_content) then
    update public.love_star_notes
    set content = btrim(p_content), updated_at = now()
    where id = v_note.id
    returning * into v_note;
  end if;

  if v_note.id is null then
    insert into public.love_star_notes(
      couple_id, sender_id, sender_role, recipient_role, content, client_token
    ) values (
      v_couple_id, auth.uid(), v_role, v_recipient, btrim(p_content), btrim(p_client_token)
    )
    on conflict (sender_id, client_token) where client_token is not null do nothing
    returning * into v_note;

    if v_note.id is null then
      select * into v_note
      from public.love_star_notes
      where sender_id = auth.uid()
        and client_token = btrim(p_client_token)
      limit 1;
    end if;
  end if;

  select jsonb_build_object(
    'liu', count(*) filter (where recipient_role = 'liu'),
    'fu', count(*) filter (where recipient_role = 'fu')
  ) into v_counts
  from public.love_star_notes
  where couple_id = v_couple_id
    and opened_at is null
    and deleted_at is null;

  return jsonb_build_object(
    'note', jsonb_build_object(
      'id', v_note.id,
      'sender_role', v_note.sender_role,
      'recipient_role', v_note.recipient_role,
      'content', v_note.content,
      'created_at', v_note.created_at,
      'updated_at', v_note.updated_at,
      'client_token', v_note.client_token,
      'opened_at', v_note.opened_at,
      'deleted_at', v_note.deleted_at
    ),
    'counts', coalesce(v_counts, jsonb_build_object('liu', 0, 'fu', 0))
  );
end;
$$;

create or replace function public.delete_love_star_by_token(p_client_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_note public.love_star_notes%rowtype;
begin
  if auth.uid() is null then raise exception 'Please sign in first'; end if;
  if char_length(btrim(coalesce(p_client_token, ''))) not between 8 and 100 then
    raise exception 'Invalid star client token';
  end if;

  update public.love_star_notes
  set deleted_at = now(), deleted_by = auth.uid()
  where sender_id = auth.uid()
    and client_token = btrim(p_client_token)
    and opened_at is null
    and deleted_at is null
  returning * into v_note;

  return jsonb_build_object('deleted', v_note.id is not null, 'id', v_note.id);
end;
$$;

create or replace function public.update_love_star(p_note_id uuid, p_content text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_note public.love_star_notes%rowtype;
begin
  if auth.uid() is null then raise exception 'Please sign in first'; end if;
  if char_length(btrim(coalesce(p_content, ''))) not between 1 and 500 then
    raise exception 'Star content must contain 1 to 500 characters';
  end if;

  update public.love_star_notes
  set content = btrim(p_content), updated_at = now()
  where id = p_note_id
    and sender_id = auth.uid()
    and opened_at is null
    and deleted_at is null
  returning * into v_note;

  if not found then raise exception 'STAR_NOTE_NOT_EDITABLE'; end if;
  return jsonb_build_object('id', v_note.id, 'content', v_note.content, 'updated_at', v_note.updated_at);
end;
$$;

create or replace function public.delete_love_star(p_note_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_note public.love_star_notes%rowtype;
begin
  if auth.uid() is null then raise exception 'Please sign in first'; end if;

  update public.love_star_notes
  set deleted_at = now(), deleted_by = auth.uid()
  where id = p_note_id
    and sender_id = auth.uid()
    and deleted_at is null
  returning * into v_note;

  if not found then raise exception 'STAR_NOTE_NOT_FOUND'; end if;
  return jsonb_build_object('id', v_note.id, 'opened_at', v_note.opened_at);
end;
$$;

create or replace function public.open_love_star()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_couple_id uuid;
  v_role text;
  v_note public.love_star_notes%rowtype;
begin
  if auth.uid() is null then raise exception 'Please sign in first'; end if;

  select couple_id, role into v_couple_id, v_role
  from public.love_members
  where user_id = auth.uid()
  limit 1
  for update;
  if v_couple_id is null then raise exception 'Please join a love space first'; end if;

  if exists (
    select 1
    from public.love_star_notes
    where couple_id = v_couple_id
      and recipient_role = v_role
      and opened_at is not null
      and (opened_at at time zone 'Asia/Shanghai')::date = (now() at time zone 'Asia/Shanghai')::date
  ) then
    raise exception 'STAR_ALREADY_OPENED_TODAY';
  end if;

  select * into v_note
  from public.love_star_notes
  where couple_id = v_couple_id
    and recipient_role = v_role
    and opened_at is null
    and deleted_at is null
  order by random()
  limit 1
  for update skip locked;

  if v_note.id is null then raise exception 'STAR_BOTTLE_EMPTY'; end if;

  update public.love_star_notes
  set opened_at = now(), opened_by = auth.uid()
  where id = v_note.id
  returning * into v_note;

  return jsonb_build_object(
    'note', jsonb_build_object(
      'id', v_note.id,
      'sender_role', v_note.sender_role,
      'recipient_role', v_note.recipient_role,
      'content', v_note.content,
      'created_at', v_note.created_at,
      'updated_at', v_note.updated_at,
      'opened_at', v_note.opened_at
    )
  );
end;
$$;

revoke all on function public.get_love_star_snapshot(text, integer, integer, integer, integer) from public;
revoke all on function public.get_love_star_summary() from public;
revoke all on function public.create_love_star(text) from public;
revoke all on function public.create_love_star_v2(text, text) from public;
revoke all on function public.delete_love_star_by_token(text) from public;
revoke all on function public.update_love_star(uuid, text) from public;
revoke all on function public.delete_love_star(uuid) from public;
revoke all on function public.open_love_star() from public;

grant execute on function public.get_love_star_snapshot(text, integer, integer, integer, integer) to authenticated;
grant execute on function public.get_love_star_summary() to authenticated;
grant execute on function public.create_love_star(text) to authenticated;
grant execute on function public.create_love_star_v2(text, text) to authenticated;
grant execute on function public.delete_love_star_by_token(text) to authenticated;
grant execute on function public.update_love_star(uuid, text) to authenticated;
grant execute on function public.delete_love_star(uuid) to authenticated;
grant execute on function public.open_love_star() to authenticated;

notify pgrst, 'reload schema';
