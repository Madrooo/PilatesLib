import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

export type AdminExerciseRow = {
  id: string
  nome: string
  slug: string
  nivel: 'iniciante' | 'intermediario' | 'avancado'
  status: 'rascunho' | 'publicado'
}

async function fetchAdminExercises(): Promise<AdminExerciseRow[]> {
  // Repare que aqui NÃO filtramos por status = 'publicado' — a policy de RLS
  // "admin_le_tudo" (que já criamos no banco) libera o admin a ver tudo,
  // inclusive rascunhos. Filtramos só os excluídos (soft delete).
  const { data, error } = await supabase
    .from('exercises')
    .select('id, nome, slug, nivel, status')
    .is('excluido_em', null)
    .order('nome')

  if (error) throw new Error(error.message)
  return data ?? []
}

export function useAdminExercises() {
  return useQuery({
    queryKey: ['admin-exercises'],
    queryFn: fetchAdminExercises,
  })
}