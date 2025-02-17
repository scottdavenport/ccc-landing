-- Reset and fix permissions for service role user
DO $$ 
DECLARE
    service_role_user text;
BEGIN
    -- Get the service role user
    service_role_user := current_user;
    
    RAISE NOTICE 'Service role user: %', service_role_user;

    -- Revoke all permissions first
    EXECUTE format('REVOKE ALL ON ALL TABLES IN SCHEMA public FROM %I', service_role_user);
    EXECUTE format('REVOKE ALL ON SCHEMA public FROM %I', service_role_user);
    
    -- Grant schema usage
    EXECUTE format('GRANT USAGE ON SCHEMA public TO %I', service_role_user);
    
    -- Grant table permissions
    EXECUTE format('GRANT ALL ON TABLE public.sponsors TO %I', service_role_user);
    EXECUTE format('GRANT ALL ON TABLE public.sponsor_levels TO %I', service_role_user);
    
    -- Grant sequence permissions (for auto-incrementing IDs)
    EXECUTE format('GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO %I', service_role_user);

    -- Disable RLS for now
    ALTER TABLE public.sponsors DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.sponsor_levels DISABLE ROW LEVEL SECURITY;

    -- Drop existing policies
    DROP POLICY IF EXISTS "Public read access" ON sponsors;
    DROP POLICY IF EXISTS "Service role access" ON sponsors;
    DROP POLICY IF EXISTS "Public read access" ON sponsor_levels;
    DROP POLICY IF EXISTS "Service role access" ON sponsor_levels;

    -- Grant minimal permissions to anon role
    GRANT USAGE ON SCHEMA public TO anon;
    GRANT SELECT ON public.sponsors TO anon;
    GRANT SELECT ON public.sponsor_levels TO anon;
END $$;
