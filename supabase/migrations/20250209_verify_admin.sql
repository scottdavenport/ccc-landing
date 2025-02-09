-- First, let's see current users and their roles
SELECT 
    auth.users.email,
    auth.users.id,
    profiles.role
FROM auth.users 
LEFT JOIN public.profiles ON auth.users.id = profiles.id;

-- Now let's ensure scott@thinkcode.ai is an admin
INSERT INTO public.profiles (id, role)
SELECT 
    auth.users.id,
    'admin'::user_role
FROM auth.users 
WHERE email = 'scott@thinkcode.ai'
ON CONFLICT (id) 
DO UPDATE SET role = 'admin'::user_role;
