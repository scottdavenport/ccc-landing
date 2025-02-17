-- Disable RLS on existing tables (wrap in DO block to handle errors gracefully)
DO $$ 
BEGIN
    -- Attempt to disable RLS on each table if it exists
    EXECUTE (
        SELECT string_agg(
            format('ALTER TABLE IF EXISTS %I.%I DISABLE ROW LEVEL SECURITY;', 
                   schemaname, tablename),
            E'\n'
        )
        FROM pg_tables
        WHERE schemaname = 'public'
    );
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error disabling RLS: %', SQLERRM;
END $$;

-- Drop all policies (wrap in DO block to handle errors gracefully)
DO $$ 
BEGIN
    -- Attempt to drop policies on each table
    EXECUTE (
        SELECT string_agg(
            format('DROP POLICY IF EXISTS "Enable read access for all users" ON %I.%I;',
                   schemaname, tablename),
            E'\n'
        )
        FROM pg_tables
        WHERE schemaname = 'public'
    );
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error dropping policies: %', SQLERRM;
END $$;

-- Drop all tables
DROP TABLE IF EXISTS public.tournament_results CASCADE;
DROP TABLE IF EXISTS public.team_members CASCADE;
DROP TABLE IF EXISTS public.teams CASCADE;
DROP TABLE IF EXISTS public.players CASCADE;
DROP TABLE IF EXISTS public.sponsors CASCADE;
DROP TABLE IF EXISTS public.sponsor_levels CASCADE;

-- Drop custom types
DROP TYPE IF EXISTS public.tournament_result_type CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Drop triggers (wrap in DO block to handle errors gracefully)
DO $$ 
BEGIN
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error dropping trigger: %', SQLERRM;
END $$;
