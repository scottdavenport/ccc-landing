-- Reset all tables and types
DROP TABLE IF EXISTS public.tournament_results CASCADE;
DROP TABLE IF EXISTS public.team_members CASCADE;
DROP TABLE IF EXISTS public.teams CASCADE;
DROP TABLE IF EXISTS public.players CASCADE;
DROP TABLE IF EXISTS public.sponsors CASCADE;
DROP TABLE IF EXISTS public.sponsor_levels CASCADE;

-- Reset any custom types
DROP TYPE IF EXISTS public.tournament_result_type CASCADE;

-- Reset any functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Reset any triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Reset any policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.sponsor_levels;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.sponsors;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.players;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.teams;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.team_members;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.tournament_results;

-- Reset RLS
ALTER TABLE IF EXISTS public.sponsor_levels DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sponsors DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.players DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.teams DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.team_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tournament_results DISABLE ROW LEVEL SECURITY;
