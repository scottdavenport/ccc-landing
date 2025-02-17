-- Temporarily disable RLS and use basic grants
DO $$ 
BEGIN
    -- Disable RLS
    ALTER TABLE sponsor_levels DISABLE ROW LEVEL SECURITY;
    ALTER TABLE sponsors DISABLE ROW LEVEL SECURITY;

    -- Drop all existing policies
    DROP POLICY IF EXISTS "Public read access" ON sponsor_levels;
    DROP POLICY IF EXISTS "Service role access" ON sponsor_levels;
    DROP POLICY IF EXISTS "Public read access" ON sponsors;
    DROP POLICY IF EXISTS "Service role access" ON sponsors;

    -- Grant necessary permissions to service_role
    GRANT ALL ON sponsor_levels TO service_role;
    GRANT ALL ON sponsors TO service_role;
    GRANT USAGE ON SCHEMA public TO service_role;

    -- Grant read access to public/anon
    GRANT SELECT ON sponsor_levels TO anon;
    GRANT SELECT ON sponsors TO anon;
    GRANT USAGE ON SCHEMA public TO anon;
END $$;
