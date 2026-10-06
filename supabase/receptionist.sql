-- Droxion AI receptionist MVP schema, Supabase SQL editor
create extension if not exists pgcrypto;

create table if not exists public.demo_inquiries (
  id uuid primary key default gen_random_uuid(),
  contact_name text not null,
  business_name text not null,
  email text not null,
  phone text not null,
  city text not null,
  call_volume text not null default 'Not specified',
  notes text not null default '',
  ip_hash text not null,
  status text not null default 'new' check (status in ('new','contacted','demo_booked','pilot','closed_won','closed_lost')),
  consent_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists demo_inquiries_ip_date_idx on public.demo_inquiries(ip_hash,created_at desc);
create index if not exists demo_inquiries_date_idx on public.demo_inquiries(created_at desc);

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_user_id uuid not null unique references auth.users(id) on delete restrict,
  phone_number text,
  retell_agent_id text unique,
  cal_event_type_id bigint unique,
  onboarding_approved boolean not null default false,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  subscription_status text default 'not_started',
  created_at timestamptz not null default now()
);
create index if not exists businesses_user_idx on public.businesses(owner_user_id);

create table if not exists public.calls (
  id uuid primary key default gen_random_uuid(),
  retell_call_id text not null unique,
  business_id uuid not null references public.businesses(id) on delete cascade,
  caller_number text,
  started_at timestamptz,
  duration_seconds integer not null default 0 check (duration_seconds >= 0),
  summary text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists calls_business_recent_idx on public.calls(business_id,created_at desc);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  cal_booking_uid text not null unique,
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_name text not null default 'Customer',
  starts_at timestamptz not null,
  status text not null default 'confirmed' check (status in ('confirmed','cancelled')),
  created_at timestamptz not null default now()
);
create index if not exists bookings_business_date_idx on public.appointments(business_id,starts_at desc);

alter table public.demo_inquiries enable row level security;
alter table public.businesses enable row level security;
alter table public.calls enable row level security;
alter table public.appointments enable row level security;

-- Intentionally no anon/authenticated RLS policies: server functions enforce access
-- and read/write with the service role key. Never expose the service key in Vite.
revoke all on public.demo_inquiries, public.businesses, public.calls, public.appointments from anon, authenticated;

-- An owner account is linked *manually* during verified onboarding:
-- insert into public.businesses(name,owner_user_id) values ('Example HVAC','<verified auth.user ID>');
-- Only attach Retell/Cal/Stripe identifiers after confirming they belong to this customer.
