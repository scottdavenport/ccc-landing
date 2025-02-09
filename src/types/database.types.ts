export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          full_name: string
          email: string
          role: 'admin' | 'player'
          created_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          role?: 'admin' | 'player'
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          role?: 'admin' | 'player'
          created_at?: string
        }
      }
      registrations: {
        Row: {
          id: string
          user_id: string
          tournament_year: number
          team_name: string
          payment_status: 'pending' | 'completed'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tournament_year: number
          team_name: string
          payment_status?: 'pending' | 'completed'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tournament_year?: number
          team_name?: string
          payment_status?: 'pending' | 'completed'
          created_at?: string
        }
      }
      donations: {
        Row: {
          id: string
          donor_name: string
          amount: number
          email: string
          anonymous: boolean
          message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          donor_name: string
          amount: number
          email: string
          anonymous?: boolean
          message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          donor_name?: string
          amount?: number
          email?: string
          anonymous?: boolean
          message?: string | null
          created_at?: string
        }
      }
      sponsors: {
        Row: {
          id: string
          name: string
          tier: 'platinum' | 'gold' | 'silver'
          logo_url: string
          website_url: string
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          tier: 'platinum' | 'gold' | 'silver'
          logo_url: string
          website_url: string
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          tier?: 'platinum' | 'gold' | 'silver'
          logo_url?: string
          website_url?: string
          active?: boolean
          created_at?: string
        }
      }
      tournament_history: {
        Row: {
          year: number
          winning_team: string
          total_raised: number
          participant_count: number
          photos_urls: string[]
          created_at: string
        }
        Insert: {
          year: number
          winning_team: string
          total_raised: number
          participant_count: number
          photos_urls?: string[]
          created_at?: string
        }
        Update: {
          year?: number
          winning_team?: string
          total_raised?: number
          participant_count?: number
          photos_urls?: string[]
          created_at?: string
        }
      }
    }
  }
}
