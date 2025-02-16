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

-- Insert sponsor levels with specific UUIDs
INSERT INTO sponsor_levels (id, name, amount) VALUES
    ('d8ce4029-8e84-49f5-9a43-a0367066bb54', 'Diamond', 10000),
    ('f7b5c8a1-6d31-4e6c-9f5d-b9a3d5e8c742', 'Platinum', 5000),
    ('a2e9d1b3-7c45-4f8a-ae6b-c1d2e3f4a5b6', 'Gold', 2500),
    ('c4d5e6f7-8g9h-0i1j-2k3l-4m5n6o7p8q9r', 'Silver', 1000);

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
