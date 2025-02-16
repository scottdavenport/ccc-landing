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
  website_url?: string;
  cloudinary_public_id: string;
  cloudinary_url: string;
  cloudinary_secure_url: string;
  cloudinary_thumbnail_url: string;
  cloudinary_original_filename?: string;
  cloudinary_format: string;
  cloudinary_resource_type: string;
  cloudinary_created_at: Date;
  cloudinary_bytes: number;
  cloudinary_width: number;
  cloudinary_height: number;
  cloudinary_folder: string;
  cloudinary_tags: string[];
  created_at: string;
  updated_at: string;
  sponsor_level?: SponsorLevel; // Joined data
}

export interface Player {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  handicap?: number;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  captain_id: string;
  tournament_year: number;
  total_score?: number;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  team_id: string;
  player_id: string;
  created_at: string;
}

export interface TournamentResult {
  id: string;
  team_id: string;
  tournament_year: number;
  final_position?: number;
  total_score: number;
  created_at: string;
  updated_at: string;
}
