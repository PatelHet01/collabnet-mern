-- CollabNet initial schema

create type user_role as enum ('admin', 'brand', 'creator', 'agency');
create type campaign_status as enum ('draft', 'open', 'in_progress', 'completed', 'cancelled');
create type application_status as enum ('pending', 'accepted', 'rejected');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null,
  name text not null,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table brands (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references profiles(id) on delete cascade,
  company_name text not null,
  website text,
  industry text
);

create table creators (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references profiles(id) on delete cascade,
  bio text,
  niche text[] default '{}',
  platforms jsonb default '[]'::jsonb
);

create table agencies (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references profiles(id) on delete cascade,
  agency_name text not null
);

create table campaigns (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  title text not null,
  brief text,
  budget_cents integer not null default 0,
  status campaign_status not null default 'draft',
  start_at date,
  end_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table campaign_applications (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  creator_id uuid not null references creators(id) on delete cascade,
  pitch text,
  proposed_rate_cents integer,
  status application_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (campaign_id, creator_id)
);

create index campaigns_brand_id_idx on campaigns(brand_id);
create index campaigns_status_idx on campaigns(status);
create index applications_campaign_idx on campaign_applications(campaign_id);
create index applications_creator_idx on campaign_applications(creator_id);

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  r user_role;
  n text;
begin
  r := coalesce((new.raw_user_meta_data->>'role')::user_role, 'creator');
  n := coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1));

  insert into public.profiles (id, role, name)
  values (new.id, r, n);

  if r = 'brand' then
    insert into brands (profile_id, company_name)
    values (new.id, coalesce(new.raw_user_meta_data->>'company_name', n));
  elsif r = 'creator' then
    insert into creators (profile_id) values (new.id);
  elsif r = 'agency' then
    insert into agencies (profile_id, agency_name)
    values (new.id, coalesce(new.raw_user_meta_data->>'agency_name', n));
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table profiles enable row level security;
alter table brands enable row level security;
alter table creators enable row level security;
alter table agencies enable row level security;
alter table campaigns enable row level security;
alter table campaign_applications enable row level security;

create policy "profiles read own" on profiles for select using (auth.uid() = id);
create policy "profiles read all authenticated" on profiles for select to authenticated using (true);
create policy "profiles update own" on profiles for update using (auth.uid() = id);

create policy "brands read" on brands for select to authenticated using (true);
create policy "brands update own" on brands for update using (profile_id = auth.uid());

create policy "creators read" on creators for select to authenticated using (true);
create policy "creators update own" on creators for update using (profile_id = auth.uid());

create policy "agencies read" on agencies for select to authenticated using (true);
create policy "agencies update own" on agencies for update using (profile_id = auth.uid());

create policy "campaigns read open" on campaigns for select to authenticated using (
  status in ('open', 'in_progress', 'completed')
  or brand_id in (select id from brands where profile_id = auth.uid())
);

create policy "campaigns insert brand" on campaigns for insert to authenticated
  with check (brand_id in (select id from brands where profile_id = auth.uid()));

create policy "campaigns update own brand" on campaigns for update using (
  brand_id in (select id from brands where profile_id = auth.uid())
);

create policy "applications read" on campaign_applications for select to authenticated using (
  creator_id in (select id from creators where profile_id = auth.uid())
  or campaign_id in (
    select c.id from campaigns c
    join brands b on b.id = c.brand_id
    where b.profile_id = auth.uid()
  )
);

create policy "applications insert creator" on campaign_applications for insert to authenticated
  with check (creator_id in (select id from creators where profile_id = auth.uid()));

create policy "applications update brand" on campaign_applications for update using (
  campaign_id in (
    select c.id from campaigns c
    join brands b on b.id = c.brand_id
    where b.profile_id = auth.uid()
  )
);
