import { useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../types/database.types'

type Tables = Database['public']['Tables']

export function useDonations() {
  const createDonation = useCallback(async (donation: Tables['donations']['Insert']) => {
    const { data, error } = await supabase
      .from('donations')
      .insert([donation])
      .select()
      .single()
    
    if (error) throw error
    return data
  }, [])

  const getPublicDonations = useCallback(async () => {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('anonymous', false)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }, [])

  return { createDonation, getPublicDonations }
}

export function useSponsors() {
  const getActiveSponsors = useCallback(async () => {
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .eq('active', true)
      .order('tier', { ascending: true })
    
    if (error) throw error
    return data
  }, [])

  const createSponsor = useCallback(async (sponsor: Tables['sponsors']['Insert']) => {
    const { data, error } = await supabase
      .from('sponsors')
      .insert([sponsor])
      .select()
      .single()
    
    if (error) throw error
    return data
  }, [])

  return { getActiveSponsors, createSponsor }
}

export function useRegistrations() {
  const createRegistration = useCallback(async (registration: Tables['registrations']['Insert']) => {
    const { data, error } = await supabase
      .from('registrations')
      .insert([registration])
      .select()
      .single()
    
    if (error) throw error
    return data
  }, [])

  const getUserRegistrations = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }, [])

  return { createRegistration, getUserRegistrations }
}

export function useTournamentHistory() {
  const getTournamentHistory = useCallback(async () => {
    const { data, error } = await supabase
      .from('tournament_history')
      .select('*')
      .order('year', { ascending: false })
    
    if (error) throw error
    return data
  }, [])

  const getCurrentYear = useCallback(async () => {
    const { data, error } = await supabase
      .from('tournament_history')
      .select('*')
      .order('year', { ascending: false })
      .limit(1)
      .single()
    
    if (error) throw error
    return data
  }, [])

  return { getTournamentHistory, getCurrentYear }
}
