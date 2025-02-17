-- Update RLS policies for sponsors table
BEGIN;
  -- Drop existing insert policy
  DROP POLICY IF EXISTS "Enable insert for authenticated users" ON sponsors;

  -- Create new insert policy that allows anon role
  CREATE POLICY "Enable insert for all users"
    ON sponsors
    FOR INSERT
    WITH CHECK (true);  -- Allow all roles to insert

  -- Note: Select policy remains unchanged
  -- "Enable select for all users" policy already allows all roles to read
COMMIT;
