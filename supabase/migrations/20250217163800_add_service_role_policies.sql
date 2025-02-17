-- supabase/migrations/20250217163800_add_service_role_policies.sql

BEGIN;

-- Add service role policy for sponsor_levels table
CREATE POLICY "Enable all access for service_role"
ON public.sponsor_levels
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Add service role policy for sponsors table
CREATE POLICY "Enable all access for service_role"
ON public.sponsors
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

COMMIT;
