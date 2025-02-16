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
    ('Champion', 10000),
    ('Eagle', 7500),
    ('Platinum', 5000),
    ('Gold', 2500),
    ('Silver', 1000),
    ('Bronze', 500);
