-- Reset and fix schema permissions
DO $$ 
BEGIN
    -- Reset permissions
    -- Revoke all permissions from public schema
    REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
    REVOKE ALL ON SCHEMA public FROM PUBLIC;
    
    -- Grant usage on public schema
    GRANT USAGE ON SCHEMA public TO PUBLIC;
    GRANT USAGE ON SCHEMA public TO service_role;
    GRANT USAGE ON SCHEMA public TO anon;
    GRANT USAGE ON SCHEMA public TO authenticated;

    -- Enable RLS on tables
    ALTER TABLE public.sponsor_levels ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

    -- Allow service_role to bypass RLS
    ALTER TABLE public.sponsor_levels FORCE ROW LEVEL SECURITY;
    ALTER TABLE public.sponsors FORCE ROW LEVEL SECURITY;

    -- Grant permissions for service_role (admin access)
    GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
    GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
    GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

    -- Grant read access to public tables for anon and authenticated roles
    GRANT SELECT ON public.sponsor_levels TO anon;
    GRANT SELECT ON public.sponsor_levels TO authenticated;
    GRANT SELECT ON public.sponsors TO anon;
    GRANT SELECT ON public.sponsors TO authenticated;

    -- Make sure sequences are accessible
    GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO service_role;

    -- Create policies that allow service_role to bypass RLS
    DROP POLICY IF EXISTS service_role_sponsor_levels ON public.sponsor_levels;
    CREATE POLICY service_role_sponsor_levels ON public.sponsor_levels
        USING (true)
        WITH CHECK (true);

    DROP POLICY IF EXISTS service_role_sponsors ON public.sponsors;
    CREATE POLICY service_role_sponsors ON public.sponsors
        USING (true)
        WITH CHECK (true);
END $$;
