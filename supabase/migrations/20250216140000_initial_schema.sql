-- Create public schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS public;

-- Set search path to ensure we're using public schema
ALTER DATABASE postgres SET search_path TO public;
SET search_path TO public;

-- Drop extension if it exists
DROP EXTENSION IF EXISTS "uuid-ossp";

-- Enable UUID extension in public schema
CREATE EXTENSION "uuid-ossp" SCHEMA public;

-- Create updated_at function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create sponsor_levels table
CREATE TABLE sponsor_levels (
    id UUID PRIMARY KEY DEFAULT public.uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    amount INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add trigger for sponsor_levels updated_at
CREATE TRIGGER update_sponsor_levels_updated_at
    BEFORE UPDATE ON sponsor_levels
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert initial sponsor levels
INSERT INTO sponsor_levels (name, amount) VALUES
    ('Champion', 5000),
    ('Eagle', 2500),
    ('Golf Gift', 2500),
    ('Celebration Lunch', 2500),
    ('Bloody Mary', 1000),
    ('Golf Cart', 1000),
    ('Celebration Wall', 700),
    ('Thursday Night', 700),
    ('Chick-Fil-A AM', 500),
    ('Bojangles PM', 500);

-- Create sponsors table
CREATE TABLE sponsors (
    id UUID PRIMARY KEY DEFAULT public.uuid_generate_v4(),
    level UUID NOT NULL REFERENCES sponsor_levels(id),
    name TEXT NOT NULL,
    contact_name TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    logo_url TEXT,
    image_url TEXT,
    year INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for sponsors
CREATE INDEX idx_sponsors_level ON sponsors(level);
CREATE INDEX idx_sponsors_year ON sponsors(year);

-- Add trigger for sponsors updated_at
CREATE TRIGGER update_sponsors_updated_at
    BEFORE UPDATE ON sponsors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create players table
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT public.uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add trigger for players updated_at
CREATE TRIGGER update_players_updated_at
    BEFORE UPDATE ON players
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create teams table
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT public.uuid_generate_v4(),
    name TEXT NOT NULL,
    year INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add trigger for teams updated_at
CREATE TRIGGER update_teams_updated_at
    BEFORE UPDATE ON teams
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create team_members table
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id),
    player_id UUID NOT NULL REFERENCES players(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, player_id)
);

-- Add trigger for team_members updated_at
CREATE TRIGGER update_team_members_updated_at
    BEFORE UPDATE ON team_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create tournament_results table
CREATE TABLE tournament_results (
    id UUID PRIMARY KEY DEFAULT public.uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id),
    year INTEGER NOT NULL,
    score INTEGER NOT NULL,
    place INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, year)
);

-- Add trigger for tournament_results updated_at
CREATE TRIGGER update_tournament_results_updated_at
    BEFORE UPDATE ON tournament_results
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

