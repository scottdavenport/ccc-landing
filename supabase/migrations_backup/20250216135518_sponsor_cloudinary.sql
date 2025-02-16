-- Add year and essential Cloudinary columns to sponsors table
ALTER TABLE sponsors
ADD COLUMN year integer NOT NULL,
ADD COLUMN image_url text NOT NULL;

-- Add indexes for common queries
CREATE INDEX idx_sponsors_level ON sponsors(level);
CREATE INDEX idx_sponsors_year ON sponsors(year);
