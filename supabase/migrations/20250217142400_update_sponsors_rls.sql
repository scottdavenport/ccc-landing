-- Update RLS policies for sponsors table
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access" ON sponsors;
DROP POLICY IF EXISTS "Service role access" ON sponsors;

-- Create policies
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
