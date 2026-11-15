-- Run this whole file once in Supabase: SQL Editor > New query > paste > Run.
-- Safe to run again; it will not delete anything.

create extension if not exists "pgcrypto";

create table if not exists sarees (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  price integer not null check (price >= 0),
  status text not null default 'draft' check (status in ('draft','live','hidden','sold')),
  category text,
  colour text,
  fabric text,
  occasion text,
  style text,
  length text,
  blouse_info text,
  care text,
  hook text,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists saree_images (
  id uuid primary key default gen_random_uuid(),
  saree_id uuid not null references sarees(id) on delete cascade,
  url text not null,
  kind text not null default 'real' check (kind in ('real','ai')),
  approved boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists ai_jobs (
  id bigserial primary key,
  tool text not null,
  status text not null,
  detail text,
  created_at timestamptz not null default now()
);

create table if not exists error_log (
  id bigserial primary key,
  place text,
  message text,
  created_at timestamptz not null default now()
);

create index if not exists sarees_status_idx on sarees(status);
create index if not exists saree_images_saree_idx on saree_images(saree_id);
create index if not exists ai_jobs_created_idx on ai_jobs(created_at);

-- Row Level Security: the public website may ONLY read visible sarees and their approved photos.
alter table sarees enable row level security;
alter table saree_images enable row level security;
alter table ai_jobs enable row level security;
alter table error_log enable row level security;

drop policy if exists "public reads visible sarees" on sarees;
create policy "public reads visible sarees" on sarees
  for select using (status in ('live','sold'));

drop policy if exists "public reads approved images" on saree_images;
create policy "public reads approved images" on saree_images
  for select using (
    approved = true
    and exists (select 1 from sarees s where s.id = saree_id and s.status in ('live','sold'))
  );
-- ai_jobs and error_log have no public policy: only the server (service role key) can use them.

-- Public photo bucket.
insert into storage.buckets (id, name, public)
values ('saree-photos', 'saree-photos', true)
on conflict (id) do nothing;

-- OPTIONAL sample data so you can see the site working. Delete these from My sarees later.
insert into sarees (code, name, price, status, category, colour, fabric, occasion, style, length, blouse_info, care, hook, description)
values
 ('SR-DEMO1','Sample Kanchipuram Silk',18500,'live','Silk','Maroon','Silk','Wedding','Traditional','5.5 m saree with blouse piece','Contrast gold blouse piece','Dry clean only','A rich maroon drape for your special day.','This is a sample saree so you can see how the website looks. Replace it with your real sarees.'),
 ('SR-DEMO2','Sample Soft Cotton',2450,'live','Cotton','Indigo','Cotton','Daily wear','Minimal','5.5 m saree with blouse piece','Matching blouse piece','Gentle hand wash','Light, breezy and easy to wear all day.','This is a sample saree. Delete it from the admin when you add your own.'),
 ('SR-DEMO3','Sample Festive Georgette',6200,'sold','Festive','Emerald','Georgette','Festive','Contemporary','5.5 m saree with blouse piece','Embroidered blouse piece','Dry clean recommended','A festive emerald with a flowing fall.','This sample shows how a sold saree appears on the website.')
on conflict (code) do nothing;
