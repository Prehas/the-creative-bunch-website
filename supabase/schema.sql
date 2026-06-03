-- The Creative Bunch admin MVP schema
-- Run this in Supabase SQL Editor after creating the project.

create table if not exists public.projects (
    id bigint primary key,
    title text not null,
    category text not null check (category in ('graphics', 'branding', 'web')),
    tag text not null,
    description text not null,
    image text not null,
    sort_order integer default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists public.analytics_events (
    id uuid primary key default gen_random_uuid(),
    event_name text not null,
    page_path text,
    project_id bigint,
    country text,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now()
);

create table if not exists public.meetings (
    id uuid primary key default gen_random_uuid(),
    contact_name text not null,
    contact_email text,
    topic text,
    meeting_time timestamptz,
    status text default 'upcoming',
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now()
);

create table if not exists public.case_studies (
    project_id bigint primary key references public.projects(id) on delete cascade,
    content jsonb not null default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

alter table public.projects enable row level security;
alter table public.analytics_events enable row level security;
alter table public.meetings enable row level security;
alter table public.case_studies enable row level security;

-- Public website can read projects.
create policy "Public can read projects"
    on public.projects for select
    using (true);

create policy "Public can read case studies"
    on public.case_studies for select
    using (true);

-- Only authenticated admins should mutate projects.
-- Keep the admin email in sync with supabase-config.js.
create policy "Admin can manage projects"
    on public.projects for all
    using (auth.jwt() ->> 'email' = 'raduniculescu22@gmail.com')
    with check (auth.jwt() ->> 'email' = 'raduniculescu22@gmail.com');

create policy "Admin can manage case studies"
    on public.case_studies for all
    using (auth.jwt() ->> 'email' = 'raduniculescu22@gmail.com')
    with check (auth.jwt() ->> 'email' = 'raduniculescu22@gmail.com');

create policy "Admin can read analytics"
    on public.analytics_events for select
    using (auth.jwt() ->> 'email' = 'raduniculescu22@gmail.com');

create policy "Admin can read meetings"
    on public.meetings for select
    using (auth.jwt() ->> 'email' = 'raduniculescu22@gmail.com');

insert into public.projects (id, title, category, tag, description, image, sort_order)
values
    (1, 'Merkaz Israel 76 Campaign', 'graphics', 'Event Poster & Campaign Design', 'Visual campaign materials for Merkaz, promoting the Israel 76 cultural event with bold typography, clean layout, and community-focused imagery.', 'assets/project_merkaz_thumb.webp', 1),
    (7, 'Infinik Logo', 'branding', 'Logo Design & Brand Mark', 'Futuristic identity mark for Infinik, pairing a geometric infinity symbol with a sharp, digital wordmark system.', 'assets/project_infinik_logo_thumb.webp', 2),
    (10, 'Every Idea Has a Form', 'branding', 'Print & Object Branding', 'Every idea deserves a form. We transform it into print - on paper, fabric, or objects. The format does not matter. What matters is your vision.', 'assets/project_every_idea_form_thumb.webp', 3),
    (9, 'JCC Brochure', 'graphics', 'Brochure & Community Campaign', 'High-energy brochure cover for JCC Bucharest, combining cultural photography, bold typography, and event-led visual storytelling.', 'assets/project_jcc_brochure_thumb.webp', 4),
    (8, 'Creative Alex Website', 'web', 'Portfolio Website Design', 'Website direction and visual presentation for creativealex.eu, built around bold portfolio thumbnails and a clean creator-first experience.', 'assets/project_creativealex_website_thumb.webp', 5)
on conflict (id) do update set
    title = excluded.title,
    category = excluded.category,
    tag = excluded.tag,
    description = excluded.description,
    image = excluded.image,
    sort_order = excluded.sort_order,
    updated_at = now();
