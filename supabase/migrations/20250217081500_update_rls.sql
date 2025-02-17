-- Drop existing policies for sponsors
DROP POLICY IF EXISTS "Enable read access for all users" ON sponsors;
DROP POLICY IF EXISTS "Enable write access for authenticated users" ON sponsors;

-- Recreate policies for sponsors
-- Everyone can view sponsors
CREATE POLICY "Enable read access for all users" ON sponsors
    FOR SELECT
    TO public
    USING (true);

-- Service role and authenticated users can modify sponsors
CREATE POLICY "Enable write access for service role and authenticated users" ON sponsors
    FOR ALL
    USING (
        -- Allow service role to bypass RLS
        (current_user = 'service_role') OR
        -- Allow authenticated users
        (auth.role() = 'authenticated')
    )
    WITH CHECK (
        -- Allow service role to bypass RLS
        (current_user = 'service_role') OR
        -- Allow authenticated users
        (auth.role() = 'authenticated')
    );
