-- Create sponsor_levels table if it doesn't exist
CREATE TABLE IF NOT EXISTS sponsor_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    amount DECIMAL NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sponsors table if it doesn't exist
CREATE TABLE IF NOT EXISTS sponsors (
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

-- Add image columns if they don't exist (this is safe to run multiple times)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sponsors' AND column_name = 'image_url') THEN
        ALTER TABLE sponsors ADD COLUMN image_url TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sponsors' AND column_name = 'cloudinary_public_id') THEN
        ALTER TABLE sponsors ADD COLUMN cloudinary_public_id TEXT;
    END IF;

    -- Make columns NOT NULL if they exist
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sponsors' AND column_name = 'image_url') THEN
        ALTER TABLE sponsors ALTER COLUMN image_url SET NOT NULL;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sponsors' AND column_name = 'cloudinary_public_id') THEN
        ALTER TABLE sponsors ALTER COLUMN cloudinary_public_id SET NOT NULL;
    END IF;
END $$;
