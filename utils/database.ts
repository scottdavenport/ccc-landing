import { supabase } from './supabase';
import type { Sponsor, Player, Team, TeamMember, TournamentResult } from '../types/database';

// Sponsor level operations
export async function getSponsorLevels() {
  const { data, error } = await supabase
    .from('sponsor_levels')
    .select('*')
    .order('amount', { ascending: false });
  
  if (error) throw error;
  return data as SponsorLevel[];
}

export async function createSponsorLevel(level: Omit<SponsorLevel, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('sponsor_levels')
    .insert(level)
    .select()
    .single();
  
  if (error) throw error;
  return data as SponsorLevel;
}

// Sponsor operations
export async function getSponsors() {
  const { data, error } = await supabase
    .from('sponsors')
    .select(`
      *,
      sponsor_level:sponsor_levels(*)
    `)
    .order('sponsor_level(amount)', { ascending: false });
  
  if (error) throw error;
  return data as (Sponsor & { sponsor_level: SponsorLevel })[];
}

export async function createSponsor(sponsor: Omit<Sponsor, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('sponsors')
    .insert(sponsor)
    .select(`
      *,
      sponsor_level:sponsor_levels(*)
    `)
    .single();
  
  if (error) throw error;
  return data as Sponsor & { sponsor_level: SponsorLevel };
}

// Player operations
export async function getPlayers() {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('last_name');
  
  if (error) throw error;
  return data as Player[];
}

export async function createPlayer(player: Omit<Player, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('players')
    .insert(player)
    .select()
    .single();
  
  if (error) throw error;
  return data as Player;
}

// Team operations
export async function getTeams(year?: number) {
  let query = supabase
    .from('teams')
    .select(`
      *,
      captain:players!teams_captain_id_fkey(*),
      members:team_members(player:players(*))
    `);
  
  if (year) {
    query = query.eq('tournament_year', year);
  }
  
  const { data, error } = await query.order('name');
  
  if (error) throw error;
  return data as (Team & {
    captain: Player;
    members: { player: Player }[];
  })[];
}

export async function createTeam(
  team: Omit<Team, 'id' | 'created_at' | 'updated_at'>,
  memberIds: string[]
) {
  const { data: teamData, error: teamError } = await supabase
    .from('teams')
    .insert(team)
    .select()
    .single();
  
  if (teamError) throw teamError;
  
  const teamMembers = memberIds.map(playerId => ({
    team_id: teamData.id,
    player_id: playerId
  }));
  
  const { error: membersError } = await supabase
    .from('team_members')
    .insert(teamMembers);
  
  if (membersError) throw membersError;
  
  return teamData as Team;
}

// Tournament results operations
export async function getTournamentResults(year: number) {
  const { data, error } = await supabase
    .from('tournament_results')
    .select(`
      *,
      team:teams(
        *,
        captain:players!teams_captain_id_fkey(*),
        members:team_members(player:players(*))
      )
    `)
    .eq('tournament_year', year)
    .order('final_position', { ascending: true });
  
  if (error) throw error;
  return data as (TournamentResult & {
    team: Team & {
      captain: Player;
      members: { player: Player }[];
    };
  })[];
}

export async function createTournamentResult(result: Omit<TournamentResult, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('tournament_results')
    .insert(result)
    .select()
    .single();
  
  if (error) throw error;
  return data as TournamentResult;
}
