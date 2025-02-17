-- Enable RLS on sponsors table
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON sponsors;
DROP POLICY IF EXISTS "Enable select for all users" ON sponsors;

-- Create policies
BEGIN;
  -- Allow anyone to read sponsors
  CREATE POLICY "Enable select for all users"
    ON sponsors
    FOR SELECT
    USING (true);

  -- Allow service role to insert sponsors
  CREATE POLICY "Enable insert for authenticated users"
    ON sponsors
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');
COMMIT;
