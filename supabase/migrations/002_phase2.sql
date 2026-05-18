-- Phase 2: messaging, notifications, agency roster, payouts, shortlists, deliverables

create type payout_status as enum ('pending', 'processing', 'paid', 'failed');
create type deliverable_status as enum ('pending', 'submitted', 'approved', 'revision');

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references campaigns(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table agency_creators (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references agencies(id) on delete cascade,
  creator_id uuid not null references creators(id) on delete cascade,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  unique (agency_id, creator_id)
);

create table payouts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references creators(id) on delete cascade,
  campaign_id uuid references campaigns(id) on delete set null,
  amount_paise integer not null,
  status payout_status not null default 'pending',
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table brand_shortlists (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  creator_id uuid not null references creators(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (brand_id, creator_id)
);

create table deliverables (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references campaign_applications(id) on delete cascade,
  title text not null,
  status deliverable_status not null default 'pending',
  asset_url text,
  due_at date,
  created_at timestamptz not null default now()
);

create index notifications_user_idx on notifications(user_id);
create index messages_campaign_idx on messages(campaign_id);
create index payouts_creator_idx on payouts(creator_id);

alter table notifications enable row level security;
alter table messages enable row level security;
alter table agency_creators enable row level security;
alter table payouts enable row level security;
alter table brand_shortlists enable row level security;
alter table deliverables enable row level security;

create policy "notifications own" on notifications for all using (user_id = auth.uid());
create policy "messages read" on messages for select to authenticated using (true);
create policy "messages insert" on messages for insert to authenticated with check (sender_id = auth.uid());

create policy "agency_creators agency" on agency_creators for all using (
  agency_id in (select id from agencies where profile_id = auth.uid())
);
create policy "agency_creators read" on agency_creators for select to authenticated using (true);

create policy "payouts creator read" on payouts for select using (
  creator_id in (select id from creators where profile_id = auth.uid())
);
create policy "payouts insert service" on payouts for insert to authenticated with check (true);

create policy "shortlists brand" on brand_shortlists for all using (
  brand_id in (select id from brands where profile_id = auth.uid())
);
create policy "shortlists read creators" on brand_shortlists for select to authenticated using (true);

create policy "deliverables read" on deliverables for select to authenticated using (true);
create policy "deliverables creator update" on deliverables for update using (
  application_id in (
    select ca.id from campaign_applications ca
    join creators c on c.id = ca.creator_id
    where c.profile_id = auth.uid()
  )
);
