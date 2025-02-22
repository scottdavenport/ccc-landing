-- Fix service role permissions
BEGIN;
  -- Drop existing policies
  DROP POLICY IF EXISTS "Enable insert for all users" ON sponsors;
  DROP POLICY IF EXISTS "Enable select for all users" ON sponsors;
  DROP POLICY IF EXISTS "Enable read access for all users" ON sponsor_levels;

  -- Grant direct permissions to service_role
  GRANT USAGE ON SCHEMA public TO service_role;
  GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
  GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

  -- Create new policies that explicitly allow service_role
  CREATE POLICY "Enable insert for service role"
    ON sponsors
    FOR INSERT
    TO service_role
    WITH CHECK (true);

  CREATE POLICY "Enable select for service role"
    ON sponsors
    FOR SELECT
    TO service_role
    USING (true);

  CREATE POLICY "Enable read access for service role"
    ON sponsor_levels
    FOR SELECT
    TO service_role
    USING (true);

  -- Also create policies for authenticated users
  CREATE POLICY "Enable select for authenticated users"
    ON sponsors
    FOR SELECT
    TO authenticated
    USING (true);

  CREATE POLICY "Enable read access for authenticated users"
    ON sponsor_levels
    FOR SELECT
    TO authenticated
    USING (true);

  -- Ensure RLS is enabled but service_role can bypass
  ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.sponsor_levels ENABLE ROW LEVEL SECURITY;
  
  -- Force RLS for all users except service_role
  ALTER TABLE public.sponsors FORCE ROW LEVEL SECURITY;
  ALTER TABLE public.sponsor_levels FORCE ROW LEVEL SECURITY;
COMMIT;
