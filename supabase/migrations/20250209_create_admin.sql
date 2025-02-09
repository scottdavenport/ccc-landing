-- Get the first user and make them an admin
DO $$ 
DECLARE
  first_user_id UUID;
BEGIN
  -- Get the first user's ID
  SELECT id INTO first_user_id FROM auth.users LIMIT 1;
  
  -- Insert or update the profile for this user
  INSERT INTO public.profiles (id, role)
  VALUES (first_user_id, 'admin'::user_role)
  ON CONFLICT (id) DO UPDATE
  SET role = 'admin'::user_role;
END $$;
