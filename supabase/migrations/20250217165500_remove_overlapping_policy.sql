-- supabase/migrations/20250217165500_remove_overlapping_policy.sql

BEGIN;

-- Remove the overlapping policy
DROP POLICY IF EXISTS "Enable write access for service role and authenticated users" ON public.sponsors;

-- Verify the service role policy is correctly applied
-- This is just a comment to ensure we remember to check manually

COMMIT;
