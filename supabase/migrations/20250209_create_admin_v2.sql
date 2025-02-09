-- Make the first user an admin
INSERT INTO public.profiles (id, role)
SELECT id, 'admin'::user_role
FROM auth.users
WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE role = 'admin'
)
LIMIT 1;
