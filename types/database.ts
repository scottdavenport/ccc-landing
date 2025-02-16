export type SponsorLevel = 'platinum' | 'gold' | 'silver' | 'bronze';

export interface Sponsor {
  id: string;
  name: string;
  level: SponsorLevel;
  website_url?: string;
  cloudinary_public_id: string;
  created_at: string;
  updated_at: string;
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
