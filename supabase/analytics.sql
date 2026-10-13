create table if not exists public.tcb_analytics_events (
  id uuid primary key,
  occurred_at timestamptz not null default now(),
  event_name text not null check (event_name in ('case_study_open','pricing_cta_click','create_project_click','view_work_click','portfolio_filter_click')),
  project_id text not null default ''
);
create index if not exists tcb_analytics_events_time on public.tcb_analytics_events(occurred_at);
alter table public.tcb_analytics_events enable row level security;
revoke all on public.tcb_analytics_events from public, anon, authenticated;

create or replace function public.tcb_analytics_record(event_id uuid, event_name text, project_id text default '') returns void
language sql security definer set search_path = public as $$
  insert into public.tcb_analytics_events(id,event_name,project_id) values($1,$2,left($3,80)) on conflict(id) do nothing;
  delete from public.tcb_analytics_events where occurred_at < now() - interval '90 days';
$$;
create or replace function public.tcb_analytics_summary(since_at timestamptz, until_at timestamptz) returns jsonb
language sql security definer set search_path = public as $$
select jsonb_build_object(
  'events',coalesce((select jsonb_agg(t) from (select event_name as name,count(*) as count from public.tcb_analytics_events where occurred_at >= since_at and occurred_at < until_at group by event_name order by count(*) desc) t),'[]'::jsonb),
  'projects',coalesce((select jsonb_agg(t) from (select project_id as id,count(*) as count from public.tcb_analytics_events where occurred_at >= since_at and occurred_at < until_at and event_name='case_study_open' group by project_id order by count(*) desc limit 10) t),'[]'::jsonb)
);
$$;
revoke all on function public.tcb_analytics_record(uuid,text,text) from public,anon,authenticated;
revoke all on function public.tcb_analytics_summary(timestamptz,timestamptz) from public,anon,authenticated;
grant execute on function public.tcb_analytics_record(uuid,text,text) to service_role;
grant execute on function public.tcb_analytics_summary(timestamptz,timestamptz) to service_role;

create or replace function public.tcb_analytics_cleanup() returns void
language sql security definer set search_path = public as $$
  delete from public.tcb_analytics_events where occurred_at < now() - interval '90 days';
$$;
revoke all on function public.tcb_analytics_cleanup() from public,anon,authenticated;
grant execute on function public.tcb_analytics_cleanup() to service_role;
