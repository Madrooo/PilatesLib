import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

export type Exercise = {
  id: string
  nome: string
  slug: string
  descricao_curta: string | null
  nivel: 'iniciante' | 'intermediario' | 'avancado'
  imagem_url: string | null
  status: 'rascunho' | 'publicado'
}

export type ExerciseFilters = {
  search?: string
  nivel?: string
  equipamento_id?: string
  objetivo_principal_id?: string
  regiao_corporal_id?: string
}

async function fetchExercises(filters: ExerciseFilters): Promise<Exercise[]> {
  let query = supabase
    .from('exercises')
    .select('id, nome, slug, descricao_curta, nivel, imagem_url, status')
    // Filtro explícito, independente de quem está logado: a Biblioteca
    // pública NUNCA deve mostrar publicado=false ou excluído, mesmo que
    // a política de RLS do admin libere o acesso a esses dados no banco.
    .eq('status', 'publicado')
    .is('excluido_em', null)

  if (filters.search && filters.search.trim() !== '') {
    query = query.ilike('nome', `%${filters.search.trim()}%`)
  }

  if (filters.nivel) {
    query = query.eq('nivel', filters.nivel)
  }

  if (filters.equipamento_id) {
    query = query.eq('equipamento_id', filters.equipamento_id)
  }

  if (filters.objetivo_principal_id) {
    query = query.eq('objetivo_principal_id', filters.objetivo_principal_id)
  }

  if (filters.regiao_corporal_id) {
    query = query.eq('regiao_corporal_id', filters.regiao_corporal_id)
  }

  const { data, error } = await query.order('nome')

  if (error) throw new Error(error.message)
  return data ?? []
}

export function useExercises(filters: ExerciseFilters = {}) {
  return useQuery({
    queryKey: ['exercises', filters],
    queryFn: () => fetchExercises(filters),
  })
}