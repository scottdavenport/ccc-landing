-- Create sponsor_levels table
CREATE TABLE sponsor_levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    amount INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add trigger for updated_at
CREATE TRIGGER update_sponsor_levels_updated_at
    BEFORE UPDATE ON sponsor_levels
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update sponsors table to reference sponsor_levels
ALTER TABLE sponsors
    DROP CONSTRAINT sponsors_level_check,
    ALTER COLUMN level TYPE UUID USING uuid_generate_v4(),
    ALTER COLUMN level SET NOT NULL,
    ADD CONSTRAINT sponsors_level_fkey FOREIGN KEY (level) REFERENCES sponsor_levels(id);

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
