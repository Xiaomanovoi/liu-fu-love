-- Run after supabase-schema.sql. This migration adds only calendar objects.
begin;

create table if not exists public.love_calendar_entries (
  id uuid primary key,
  couple_id uuid not null references public.love_couples(id) on delete cascade,
  author_id uuid not null,
  author_role text not null check (author_role in ('liu', 'fu')),
  day date not null check (day between date '1900-01-01' and date '2100-12-31'),
  kind text not null check (kind in ('note', 'reply', 'event')),
  parent_id uuid references public.love_calendar_entries(id),
  body text not null check (char_length(body) between 1 and 2000),
  yearly boolean not null default false,
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  version integer not null default 1,
  check ((kind = 'reply') = (parent_id is not null)),
  check (kind = 'event' or not yearly),
  check (kind <> 'event' or char_length(body) <= 80)
);

create index if not exists love_calendar_entries_month
  on public.love_calendar_entries (couple_id, day);
create index if not exists love_calendar_entries_parent
  on public.love_calendar_entries (parent_id) where deleted_at is null;

alter table public.love_calendar_entries enable row level security;
revoke all on public.love_calendar_entries from public, anon, authenticated;

create or replace function public.get_love_calendar(p_day date)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_couple uuid;
  v_month date;
  v_next date;
  v_result jsonb;
begin
  select couple_id into v_couple from public.love_members where user_id = auth.uid();
  if v_couple is null then
    raise exception using errcode = '42501', message = 'CALENDAR_NOT_PAIRED';
  end if;
  if p_day is null or p_day not between date '1900-01-01' and date '2100-12-31' then
    raise exception using errcode = '22023', message = 'CALENDAR_INVALID_DATE';
  end if;
  v_month := date_trunc('month', p_day::timestamp)::date;
  v_next := (v_month + interval '1 month')::date;

  with month_rows as (
    select e.*, extract(day from e.day)::integer as day_number
    from public.love_calendar_entries e
    where e.couple_id = v_couple
      and (
        (e.day >= v_month and e.day < v_next)
        or (e.kind = 'event' and e.yearly and e.day < v_month
            and extract(month from e.day) = extract(month from p_day))
      )
  ), marks as (
    select day_number, bool_or(kind = 'event') as event,
      bool_or(kind <> 'event' and author_role = 'liu') as liu,
      bool_or(kind <> 'event' and author_role = 'fu') as fu
    from month_rows where deleted_at is null group by day_number
  )
  select jsonb_build_object(
    'marks', coalesce((select jsonb_agg(to_jsonb(m) order by m.day_number) from marks m), '[]'::jsonb),
    'entries', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'kind', r.kind, 'day', r.day, 'parent_id', r.parent_id, 'role', r.author_role,
        'body', case when r.deleted_at is null then r.body end,
        'deleted', r.deleted_at is not null, 'yearly', r.yearly,
        'created_at', r.created_at, 'version', r.version, 'mine', r.author_id = auth.uid()
      ) order by r.created_at, r.id)
      from month_rows r
      where r.day_number = extract(day from p_day)
        and (r.deleted_at is null or (
          r.kind = 'note' and exists (
            select 1 from public.love_calendar_entries reply
            where reply.parent_id = r.id and reply.couple_id = v_couple and reply.deleted_at is null
          )
        ))
    ), '[]'::jsonb)
  ) into v_result;
  return v_result;
end;
$$;

create or replace function public.save_love_calendar_entry(
  p_id uuid, p_day date, p_kind text, p_body text, p_parent_id uuid,
  p_yearly boolean, p_expected_version integer
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_member public.love_members%rowtype;
  v_entry public.love_calendar_entries%rowtype;
  v_body text := regexp_replace(p_body, '^[[:space:]]+|[[:space:]]+$', '', 'g');
begin
  select * into v_member from public.love_members where user_id = v_user;
  if not found then
    raise exception using errcode = '42501', message = 'CALENDAR_NOT_PAIRED';
  end if;
  if p_id is null or p_day is null or p_kind is null or p_yearly is null
    or p_day not between date '1900-01-01' and date '2100-12-31'
    or p_kind not in ('note', 'reply', 'event')
    or (p_kind = 'reply') <> (p_parent_id is not null)
    or (p_kind <> 'event' and p_yearly)
    or v_body is null or char_length(v_body) not between 1 and (case when p_kind = 'event' then 80 else 2000 end)
  then
    raise exception using errcode = '22023', message = 'CALENDAR_INVALID_ENTRY';
  end if;

  if p_expected_version is null then
    -- Lock the parent while adding a reply so a concurrent deletion cannot orphan it.
    if p_kind = 'reply' then
      perform 1 from public.love_calendar_entries
      where id = p_parent_id and couple_id = v_member.couple_id and day = p_day and kind = 'note'
        and deleted_at is null for update;
      if not found and not exists (
        select 1 from public.love_calendar_entries
        where id = p_id and couple_id = v_member.couple_id and author_id = v_user
      ) then
        raise exception using errcode = '22023', message = 'CALENDAR_PARENT_MISSING';
      end if;
    end if;

    insert into public.love_calendar_entries (id, couple_id, author_id, author_role, day, kind, parent_id, body, yearly)
    values (p_id, v_member.couple_id, v_user, v_member.role, p_day, p_kind, p_parent_id, v_body, p_yearly)
    on conflict (id) do nothing;
    if found then return; end if;
  end if;

  select * into v_entry from public.love_calendar_entries
  where id = p_id and couple_id = v_member.couple_id and author_id = v_user for update;
  if not found or v_entry.deleted_at is not null then
    raise exception using errcode = '42501', message = 'CALENDAR_ENTRY_UNAVAILABLE';
  end if;
  if v_entry.day <> p_day or v_entry.kind <> p_kind or v_entry.parent_id is distinct from p_parent_id then
    raise exception using errcode = '22023', message = 'CALENDAR_INVALID_ENTRY';
  end if;
  if v_entry.body = v_body and v_entry.yearly = p_yearly
    and (p_expected_version is null or v_entry.version in (p_expected_version, p_expected_version + 1)) then
    return;
  end if;
  if v_entry.version is distinct from p_expected_version then
    raise exception using errcode = '40001', message = 'CALENDAR_ENTRY_CHANGED';
  end if;

  update public.love_calendar_entries
  set body = v_body, yearly = p_yearly, version = version + 1
  where id = p_id;
end;
$$;

create or replace function public.delete_love_calendar_entry(p_id uuid, p_expected_version integer)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_couple uuid;
  v_entry public.love_calendar_entries%rowtype;
begin
  select couple_id into v_couple from public.love_members where user_id = v_user;
  select * into v_entry from public.love_calendar_entries
  where id = p_id and couple_id = v_couple and author_id = v_user for update;
  if not found then
    raise exception using errcode = '42501', message = 'CALENDAR_ENTRY_UNAVAILABLE';
  end if;
  if v_entry.deleted_at is not null then return; end if;
  if v_entry.version is distinct from p_expected_version then
    raise exception using errcode = '40001', message = 'CALENDAR_ENTRY_CHANGED';
  end if;
  update public.love_calendar_entries
  set deleted_at = now(), version = version + 1
  where id = p_id;
end;
$$;

revoke all on function public.get_love_calendar(date) from public, anon, authenticated;
revoke all on function public.save_love_calendar_entry(uuid, date, text, text, uuid, boolean, integer) from public, anon, authenticated;
revoke all on function public.delete_love_calendar_entry(uuid, integer) from public, anon, authenticated;
grant execute on function public.get_love_calendar(date) to authenticated;
grant execute on function public.save_love_calendar_entry(uuid, date, text, text, uuid, boolean, integer) to authenticated;
grant execute on function public.delete_love_calendar_entry(uuid, integer) to authenticated;

notify pgrst, 'reload schema';
commit;
