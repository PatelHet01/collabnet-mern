-- Calendar, content scheduling, creator pricing, social metrics, chat threads

create table chat_threads (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  creator_id uuid not null references creators(id) on delete cascade,
  campaign_id uuid references campaigns(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (brand_id, creator_id, campaign_id)
);

alter table messages add column if not exists thread_id uuid references chat_threads(id) on delete cascade;

create table calendar_events (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  campaign_id uuid references campaigns(id) on delete set null,
  title text not null,
  description text,
  event_date date not null,
  event_type text not null default 'general',
  created_at timestamptz not null default now()
);

create table content_schedules (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  campaign_id uuid references campaigns(id) on delete set null,
  title text not null,
  platform text not null default 'instagram',
  scheduled_at timestamptz not null,
  status text not null default 'scheduled',
  notes text,
  created_at timestamptz not null default now()
);

create table creator_pricing (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references creators(id) on delete cascade,
  content_type text not null,
  price_paise integer not null,
  description text,
  created_at timestamptz not null default now(),
  unique (creator_id, content_type)
);

create table social_metrics (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references campaigns(id) on delete cascade,
  creator_id uuid references creators(id) on delete cascade,
  platform text not null default 'instagram',
  views integer not null default 0,
  clicks integer not null default 0,
  spend_paise integer not null default 0,
  conversions integer not null default 0,
  recorded_at date not null default current_date,
  created_at timestamptz not null default now()
);

alter table chat_threads enable row level security;
alter table calendar_events enable row level security;
alter table content_schedules enable row level security;
alter table creator_pricing enable row level security;
alter table social_metrics enable row level security;

create policy "threads participants" on chat_threads for select to authenticated using (
  brand_id in (select id from brands where profile_id = auth.uid())
  or creator_id in (select id from creators where profile_id = auth.uid())
);
create policy "threads brand insert" on chat_threads for insert to authenticated with check (
  brand_id in (select id from brands where profile_id = auth.uid())
);
create policy "threads creator insert" on chat_threads for insert to authenticated with check (
  creator_id in (select id from creators where profile_id = auth.uid())
);

create policy "calendar brand" on calendar_events for all using (
  brand_id in (select id from brands where profile_id = auth.uid())
);
create policy "schedule brand" on content_schedules for all using (
  brand_id in (select id from brands where profile_id = auth.uid())
);
create policy "pricing read" on creator_pricing for select to authenticated using (true);
create policy "pricing creator write" on creator_pricing for all using (
  creator_id in (select id from creators where profile_id = auth.uid())
);
create policy "metrics read" on social_metrics for select to authenticated using (true);
create policy "metrics brand write" on social_metrics for insert to authenticated with check (
  campaign_id in (
    select c.id from campaigns c join brands b on b.id = c.brand_id where b.profile_id = auth.uid()
  )
);

-- Realtime for messages
alter publication supabase_realtime add table messages;
