-- Enable RLS on all tables
ALTER TABLE sponsor_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_results ENABLE ROW LEVEL SECURITY;

-- Create policies for sponsor_levels
-- Everyone can view sponsor levels
CREATE POLICY "Enable read access for all users" ON sponsor_levels
    FOR SELECT
    TO public
    USING (true);

-- Only authenticated users can modify sponsor levels
CREATE POLICY "Enable write access for authenticated users" ON sponsor_levels
    FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Create policies for sponsors
-- Everyone can view sponsors
CREATE POLICY "Enable read access for all users" ON sponsors
    FOR SELECT
    TO public
    USING (true);

-- Only authenticated users can modify sponsors
CREATE POLICY "Enable write access for authenticated users" ON sponsors
    FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Create policies for players
-- Everyone can view players
CREATE POLICY "Enable read access for all users" ON players
    FOR SELECT
    TO public
    USING (true);

-- Only authenticated users can modify players
CREATE POLICY "Enable write access for authenticated users" ON players
    FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Create policies for teams
-- Everyone can view teams
CREATE POLICY "Enable read access for all users" ON teams
    FOR SELECT
    TO public
    USING (true);

-- Only authenticated users can modify teams
CREATE POLICY "Enable write access for authenticated users" ON teams
    FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Create policies for team_members
-- Everyone can view team members
CREATE POLICY "Enable read access for all users" ON team_members
    FOR SELECT
    TO public
    USING (true);

-- Only authenticated users can modify team members
CREATE POLICY "Enable write access for authenticated users" ON team_members
    FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Create policies for tournament_results
-- Everyone can view tournament results
CREATE POLICY "Enable read access for all users" ON tournament_results
    FOR SELECT
    TO public
    USING (true);

-- Only authenticated users can modify tournament results
CREATE POLICY "Enable write access for authenticated users" ON tournament_results
    FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
