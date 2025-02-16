-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create sponsors table
CREATE TABLE sponsors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('platinum', 'gold', 'silver', 'bronze')),
    website_url TEXT,
    cloudinary_public_id TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create players table
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    handicap INTEGER CHECK (handicap >= 0 AND handicap <= 36),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create teams table
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    captain_id UUID NOT NULL REFERENCES players(id),
    tournament_year INTEGER NOT NULL,
    total_score INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(captain_id, tournament_year)
);

-- Create team_members junction table
CREATE TABLE team_members (
    team_id UUID REFERENCES teams(id),
    player_id UUID REFERENCES players(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (team_id, player_id)
);

-- Create tournament_results table
CREATE TABLE tournament_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id),
    tournament_year INTEGER NOT NULL,
    final_position INTEGER,
    total_score INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(team_id, tournament_year)
);

-- Create RLS policies
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_results ENABLE ROW LEVEL SECURITY;

-- Create policies for sponsors
CREATE POLICY "Sponsors are viewable by everyone" ON sponsors
    FOR SELECT USING (true);
    
CREATE POLICY "Sponsors are editable by authenticated users only" ON sponsors
    FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for players
CREATE POLICY "Players are viewable by everyone" ON players
    FOR SELECT USING (true);
    
CREATE POLICY "Players are editable by authenticated users only" ON players
    FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for teams
CREATE POLICY "Teams are viewable by everyone" ON teams
    FOR SELECT USING (true);
    
CREATE POLICY "Teams are editable by authenticated users only" ON teams
    FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for team_members
CREATE POLICY "Team members are viewable by everyone" ON team_members
    FOR SELECT USING (true);
    
CREATE POLICY "Team members are editable by authenticated users only" ON team_members
    FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for tournament_results
CREATE POLICY "Tournament results are viewable by everyone" ON tournament_results
    FOR SELECT USING (true);
    
CREATE POLICY "Tournament results are editable by authenticated users only" ON tournament_results
    FOR ALL USING (auth.role() = 'authenticated');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to tables
CREATE TRIGGER update_sponsors_updated_at
    BEFORE UPDATE ON sponsors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_players_updated_at
    BEFORE UPDATE ON players
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
    BEFORE UPDATE ON teams
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tournament_results_updated_at
    BEFORE UPDATE ON tournament_results
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
