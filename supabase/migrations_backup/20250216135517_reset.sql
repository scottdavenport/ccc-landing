-- Drop all existing tables
DROP TABLE IF EXISTS tournament_results CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS sponsors CASCADE;
DROP TABLE IF EXISTS sponsor_levels CASCADE;

-- Drop any existing functions
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
