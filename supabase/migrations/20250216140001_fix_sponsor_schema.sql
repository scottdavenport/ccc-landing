-- Drop and recreate tables to ensure clean schema
DROP TABLE IF EXISTS sponsors;
DROP TABLE IF EXISTS sponsor_levels;

-- Create sponsor_levels table
CREATE TABLE sponsor_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    amount DECIMAL NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sponsors table with all required columns
CREATE TABLE sponsors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    level UUID REFERENCES sponsor_levels(id),
    year INTEGER NOT NULL,
    website_url TEXT,
    cloudinary_public_id TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert actual sponsor levels
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

-- Create function to refresh schema cache
CREATE OR REPLACE FUNCTION refresh_schema_cache()
RETURNS void AS $$
BEGIN
    -- Force a schema refresh by analyzing tables
    ANALYZE sponsors;
    ANALYZE sponsor_levels;
    -- Add a small delay to ensure cache is updated
    PERFORM pg_sleep(0.1);
END;
$$ LANGUAGE plpgsql;

-- Execute schema refresh
SELECT refresh_schema_cache();
