-- Add function to check service role access
BEGIN;
  -- Create a function that will verify service role access
  CREATE OR REPLACE FUNCTION public.check_service_role_access()
  RETURNS boolean
  LANGUAGE plpgsql
  SECURITY DEFINER -- This ensures the function runs with the privileges of the creator
  AS $$
  DECLARE
    current_role text;
    has_access boolean;
  BEGIN
    -- Get the current role
    SELECT current_user INTO current_role;
    
    -- Log the role for debugging
    RAISE NOTICE 'Current role: %', current_role;
    
    -- Check if we have access to sponsors table using a subtransaction
    BEGIN
      -- Try to insert a test record (will be rolled back)
      WITH test_insert AS (
        INSERT INTO sponsors (name, level, year, cloudinary_public_id, image_url)
        VALUES ('_test_', '00000000-0000-0000-0000-000000000000', 2025, '_test_', '_test_')
        RETURNING id
      )
      SELECT true INTO has_access
      FROM test_insert;
      
      -- If we get here, we have access
      RAISE NOTICE 'Insert test succeeded';
      has_access := true;
      
      -- Rollback the test insert
      RAISE EXCEPTION 'Rollback test transaction';
    EXCEPTION 
      WHEN OTHERS THEN
        -- If this was our intentional rollback, set access to true
        IF SQLERRM = 'Rollback test transaction' THEN
          has_access := true;
        ELSE
          -- Log the error for other cases
          RAISE NOTICE 'Insert test failed: % %', SQLERRM, SQLSTATE;
          has_access := false;
        END IF;
    END;
    
    -- Return the result
    RETURN has_access;
  END;
  $$;

  -- Grant execute permission to service_role
  GRANT EXECUTE ON FUNCTION public.check_service_role_access() TO service_role;
COMMIT;
