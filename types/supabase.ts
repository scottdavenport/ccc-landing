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
      sponsor_levels: {
        Row: {
          id: string
          name: string
          amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          amount: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          amount?: number
          created_at?: string
          updated_at?: string
        }
      }
      sponsors: {
        Row: {
          id: string
          name: string
          level: string
          year: number
          cloudinary_public_id: string
          image_url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          level: string
          year: number
          cloudinary_public_id: string
          image_url: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          level?: string
          year?: number
          cloudinary_public_id?: string
          image_url?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
