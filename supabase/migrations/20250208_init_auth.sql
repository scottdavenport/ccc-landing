-- Create admin_users table
create table public.admin_users (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.admin_users enable row level security;

-- Create policy to allow users to view their own data
create policy "Users can view own admin profile"
  on public.admin_users
  for select
  using (auth.uid() = id);

-- Create policy to allow users to update their own data
create policy "Users can update own admin profile"
  on public.admin_users
  for update
  using (auth.uid() = id);

-- Function to handle new user creation
create or replace function public.handle_new_admin_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.admin_users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- Trigger to automatically create admin_user record
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_admin_user();
