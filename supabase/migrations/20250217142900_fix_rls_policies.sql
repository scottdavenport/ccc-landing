-- Reapply RLS policies for all tables
DO $$ 
BEGIN
    -- Enable RLS on all tables
    ALTER TABLE sponsor_levels ENABLE ROW LEVEL SECURITY;
    ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

    -- Drop all existing policies
    DROP POLICY IF EXISTS "Public read access" ON sponsor_levels;
    DROP POLICY IF EXISTS "Service role access" ON sponsor_levels;
    DROP POLICY IF EXISTS "Public read access" ON sponsors;
    DROP POLICY IF EXISTS "Service role access" ON sponsors;

    -- Create policies for sponsor_levels
    CREATE POLICY "Public read access"
    ON sponsor_levels
    FOR SELECT
    TO public
    USING (true);

    CREATE POLICY "Service role access"
    ON sponsor_levels
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

    -- Create policies for sponsors
    CREATE POLICY "Public read access"
    ON sponsors
    FOR SELECT
    TO public
    USING (true);

    CREATE POLICY "Service role access"
    ON sponsors
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

    -- Grant necessary permissions to service_role
    GRANT ALL ON sponsor_levels TO service_role;
    GRANT ALL ON sponsors TO service_role;
    GRANT USAGE ON SCHEMA public TO service_role;

    -- Grant read access to public/anon
    GRANT SELECT ON sponsor_levels TO anon;
    GRANT SELECT ON sponsors TO anon;
    GRANT USAGE ON SCHEMA public TO anon;
END $$;
