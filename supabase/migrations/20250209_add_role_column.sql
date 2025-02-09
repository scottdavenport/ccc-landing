-- Add role column to users table
alter table auth.users 
add column if not exists role text default 'user';

-- Update existing users
update auth.users 
set role = 'admin' 
where email = 'scott@thinkcode.ai';

update auth.users 
set role = 'user' 
where email = 'scottied2@pm.me';
