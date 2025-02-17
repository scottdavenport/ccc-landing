export interface SponsorLevel {
  id: string;
  name: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

export interface Sponsor {
  id: string;
  name: string;
  level: string; // UUID reference to sponsor_levels
  year: number;
  cloudinary_public_id: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  sponsor_level?: SponsorLevel; // Joined data
}
