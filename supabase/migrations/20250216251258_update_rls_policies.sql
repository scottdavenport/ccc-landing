-- Update policies for sponsors table to allow inserts
DROP POLICY IF EXISTS "Enable read access for all users" ON sponsors;

CREATE POLICY "Enable read access for all users" ON sponsors
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert access for all users" ON sponsors
    FOR INSERT
    WITH CHECK (true);

-- Grant additional permissions for sponsors table
GRANT INSERT ON sponsors TO anon, authenticated;

-- Grant usage of the uuid-ossp extension if needed for gen_random_uuid()
GRANT USAGE ON SCHEMA extensions TO anon, authenticated;
GRANT EXECUTE ON FUNCTION extensions.uuid_generate_v4() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION gen_random_uuid() TO anon, authenticated;
