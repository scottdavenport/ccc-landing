-- Grant INSERT permissions on sponsors table
BEGIN;
  -- Grant INSERT to anon role
  GRANT INSERT ON sponsors TO anon;
  
  -- Grant INSERT to authenticated role
  GRANT INSERT ON sponsors TO authenticated;
  
  -- Grant USAGE on uuid-ossp functions
  GRANT EXECUTE ON FUNCTION uuid_generate_v4() TO anon;
  GRANT EXECUTE ON FUNCTION uuid_generate_v4() TO authenticated;
COMMIT;
