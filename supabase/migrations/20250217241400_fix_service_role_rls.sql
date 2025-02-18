-- Fix service role RLS bypass
BEGIN;
  -- Get the service role user
  DO $$ 
  DECLARE
      service_role_user text;
  BEGIN
      -- Get the service role user
      service_role_user := current_user;
      
      -- Grant RLS bypass to service role
      EXECUTE format('ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY');
      EXECUTE format('ALTER TABLE public.sponsor_levels ENABLE ROW LEVEL SECURITY');
      
      EXECUTE format('ALTER TABLE public.sponsors FORCE ROW LEVEL SECURITY');
      EXECUTE format('ALTER TABLE public.sponsor_levels FORCE ROW LEVEL SECURITY');
      
      EXECUTE format('GRANT ALL ON public.sponsors TO %I', service_role_user);
      EXECUTE format('GRANT ALL ON public.sponsor_levels TO %I', service_role_user);
  END $$;

  -- Ensure RLS policies are in place
  DROP POLICY IF EXISTS "Enable insert for all users" ON sponsors;
  CREATE POLICY "Enable insert for all users"
    ON sponsors
    FOR INSERT
    WITH CHECK (true);

  DROP POLICY IF EXISTS "Enable select for all users" ON sponsors;
  CREATE POLICY "Enable select for all users"
    ON sponsors
    FOR SELECT
    USING (true);

  DROP POLICY IF EXISTS "Enable read access for all users" ON sponsor_levels;
  CREATE POLICY "Enable read access for all users"
    ON sponsor_levels
    FOR SELECT
    USING (true);
COMMIT;
