-- Add Cloudinary metadata columns to sponsors table
ALTER TABLE sponsors
ADD COLUMN cloudinary_url text NOT NULL,
ADD COLUMN cloudinary_secure_url text NOT NULL,
ADD COLUMN cloudinary_thumbnail_url text NOT NULL,
ADD COLUMN cloudinary_original_filename text,
ADD COLUMN cloudinary_format text NOT NULL,
ADD COLUMN cloudinary_resource_type text NOT NULL,
ADD COLUMN cloudinary_created_at timestamp with time zone NOT NULL,
ADD COLUMN cloudinary_bytes integer NOT NULL,
ADD COLUMN cloudinary_width integer NOT NULL,
ADD COLUMN cloudinary_height integer NOT NULL,
ADD COLUMN cloudinary_folder text NOT NULL,
ADD COLUMN cloudinary_tags text[] NOT NULL DEFAULT '{}';

-- Add indexes for common queries
CREATE INDEX idx_sponsors_cloudinary_public_id ON sponsors(cloudinary_public_id);
CREATE INDEX idx_sponsors_level ON sponsors(level);
CREATE INDEX idx_sponsors_year ON sponsors(year);
