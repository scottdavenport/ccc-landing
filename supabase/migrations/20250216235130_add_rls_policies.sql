-- Enable RLS
ALTER TABLE sponsor_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

-- Create policies for sponsor_levels
CREATE POLICY "Enable read access for all users" ON sponsor_levels
    FOR SELECT
    USING (true);

-- Create policies for sponsors
CREATE POLICY "Enable read access for all users" ON sponsors
    FOR SELECT
    USING (true);

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant access to tables
GRANT SELECT ON sponsor_levels TO anon, authenticated;
GRANT SELECT ON sponsors TO anon, authenticated;
