import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

export type TaxonomyItem = {
  id: string
  nome: string
}

async function fetchTaxonomy(table: string): Promise<TaxonomyItem[]> {
  const { data, error } = await supabase.from(table).select('id, nome').order('nome')

  if (error) throw new Error(error.message)
  return data ?? []
}

export function useEquipment() {
  return useQuery({
    queryKey: ['equipment'],
    queryFn: () => fetchTaxonomy('equipment'),
  })
}

export function useObjectives() {
  return useQuery({
    queryKey: ['objectives'],
    queryFn: () => fetchTaxonomy('objectives'),
  })
}

export function useBodyRegions() {
  return useQuery({
    queryKey: ['body_regions'],
    queryFn: () => fetchTaxonomy('body_regions'),
  })
}

export function useMuscles() {
  return useQuery({
    queryKey: ['muscles'],
    queryFn: () => fetchTaxonomy('muscles'),
  })
}

export function useJoints() {
  return useQuery({
    queryKey: ['joints'],
    queryFn: () => fetchTaxonomy('joints'),
  })
}