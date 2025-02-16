-- Add image columns to sponsors table if they don't exist
DO $$ 
BEGIN
    -- Add image_url column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'sponsors' 
        AND column_name = 'image_url'
    ) THEN
        ALTER TABLE sponsors 
        ADD COLUMN image_url text NOT NULL;
    END IF;

    -- Add cloudinary_public_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'sponsors' 
        AND column_name = 'cloudinary_public_id'
    ) THEN
        ALTER TABLE sponsors 
        ADD COLUMN cloudinary_public_id text NOT NULL;
    END IF;
END $$;
