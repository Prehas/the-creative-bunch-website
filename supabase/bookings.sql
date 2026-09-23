-- Run once in Supabase SQL Editor. Separate from the legacy admin MVP schema.
-- Private state preserves the existing atomic booking service contract.
begin;
create schema if not exists tcb_private;
revoke all on schema tcb_private from public, anon, authenticated;
grant usage on schema tcb_private to service_role;
create table if not exists tcb_private.booking_state (
    id integer primary key check (id = 1),
    version bigint not null default 0,
    payload jsonb
);
insert into tcb_private.booking_state(id) values (1) on conflict do nothing;
create table if not exists tcb_private.booking_rates (
    key text primary key,
    count integer not null,
    expires_at timestamptz not null
);
create index if not exists booking_rates_expiry on tcb_private.booking_rates(expires_at);
alter table tcb_private.booking_state enable row level security;
alter table tcb_private.booking_rates enable row level security;
revoke all on all tables in schema tcb_private from public, anon, authenticated;
grant select, insert, update, delete on all tables in schema tcb_private to service_role;
create or replace function public.tcb_booking_read() returns jsonb
language sql security invoker set search_path = '' as $$
    select payload from tcb_private.booking_state where id = 1;
$$;
create or replace function public.tcb_booking_commit(expected_version bigint, next_state jsonb) returns boolean
language plpgsql security invoker set search_path = '' as $$
begin
    if expected_version < 0 or next_state is null
       or (next_state->>'version')::bigint is distinct from expected_version + 1
       or jsonb_typeof(next_state->'bookings') is distinct from 'array'
       or jsonb_typeof(next_state->'settings') is distinct from 'object' then
        raise exception 'Invalid booking state';
    end if;
    update tcb_private.booking_state set payload = next_state, version = expected_version + 1
    where id = 1 and version = expected_version;
    return found;
end;
$$;
create or replace function public.tcb_booking_rate_limit(rate_key text, max_requests integer, window_seconds integer) returns boolean
language plpgsql security invoker set search_path = '' as $$
declare hits integer;
begin
    if rate_key is null or length(rate_key) > 100 or max_requests < 1 or window_seconds < 1 or window_seconds > 86400 then
        raise exception 'Invalid rate limit';
    end if;
    delete from tcb_private.booking_rates where expires_at <= now();
    insert into tcb_private.booking_rates as rates(key, count, expires_at)
    values (rate_key, 1, now() + make_interval(secs => window_seconds))
    on conflict (key) do update set count = case when rates.expires_at <= now() then 1 else rates.count + 1 end,
    expires_at = case when rates.expires_at <= now() then excluded.expires_at else rates.expires_at end
    returning count into hits;
    return hits <= max_requests;
end;
$$;
revoke all on function public.tcb_booking_read() from public, anon, authenticated;
revoke all on function public.tcb_booking_commit(bigint,jsonb) from public, anon, authenticated;
revoke all on function public.tcb_booking_rate_limit(text,integer,integer) from public, anon, authenticated;
grant execute on function public.tcb_booking_read() to service_role;
grant execute on function public.tcb_booking_commit(bigint,jsonb) to service_role;
grant execute on function public.tcb_booking_rate_limit(text,integer,integer) to service_role;
commit;
