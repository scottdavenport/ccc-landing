-- Create admin role
create role admin;

-- Grant necessary permissions to admin role
grant usage on schema public to admin;
grant all on all tables in schema public to admin;
grant all on all sequences in schema public to admin;
grant all on all routines in schema public to admin;

-- Allow admin to access auth schema
grant usage on schema auth to admin;
grant select on auth.users to admin;
