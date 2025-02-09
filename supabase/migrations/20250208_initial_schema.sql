-- Create users table that extends auth.users
create table public.users (
  id uuid references auth.users not null primary key,
  full_name text not null,
  email text not null,
  role text not null check (role in ('admin', 'player')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.users enable row level security;

-- Create policy to allow users to read all profiles
create policy "Users can view all profiles"
  on public.users for select
  using (true);

-- Create policy to allow users to update their own profile
create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id);

-- Create registrations table
create table public.registrations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users not null,
  tournament_year integer not null,
  team_name text not null,
  payment_status text not null check (payment_status in ('pending', 'completed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.registrations enable row level security;

-- Create policy to allow users to read their own registrations
create policy "Users can view their own registrations"
  on public.registrations for select
  using (auth.uid() = user_id);

-- Create policy to allow users to create their own registrations
create policy "Users can create their own registrations"
  on public.registrations for insert
  with check (auth.uid() = user_id);

-- Create donations table
create table public.donations (
  id uuid default uuid_generate_v4() primary key,
  donor_name text not null,
  amount decimal not null,
  email text not null,
  anonymous boolean default false not null,
  message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.donations enable row level security;

-- Create policy to allow anyone to create donations
create policy "Anyone can create donations"
  on public.donations for insert
  with check (true);

-- Create policy to allow anyone to view non-anonymous donations
create policy "Anyone can view non-anonymous donations"
  on public.donations for select
  using (not anonymous);

-- Create sponsors table
create table public.sponsors (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  tier text not null check (tier in ('platinum', 'gold', 'silver')),
  logo_url text not null,
  website_url text not null,
  active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.sponsors enable row level security;

-- Create policy to allow anyone to view active sponsors
create policy "Anyone can view active sponsors"
  on public.sponsors for select
  using (active = true);

-- Create tournament_history table
create table public.tournament_history (
  year integer primary key,
  winning_team text not null,
  total_raised decimal not null,
  participant_count integer not null,
  photos_urls text[] default array[]::text[] not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.tournament_history enable row level security;

-- Create policy to allow anyone to view tournament history
create policy "Anyone can view tournament history"
  on public.tournament_history for select
  using (true);

-- Create admin policies
create policy "Admins can do everything"
  on public.users for all
  using (auth.uid() in (
    select id from public.users where role = 'admin'
  ));

create policy "Admins can do everything"
  on public.registrations for all
  using (auth.uid() in (
    select id from public.users where role = 'admin'
  ));

create policy "Admins can do everything"
  on public.donations for all
  using (auth.uid() in (
    select id from public.users where role = 'admin'
  ));

create policy "Admins can do everything"
  on public.sponsors for all
  using (auth.uid() in (
    select id from public.users where role = 'admin'
  ));

create policy "Admins can do everything"
  on public.tournament_history for all
  using (auth.uid() in (
    select id from public.users where role = 'admin'
  ));
