import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import { gerarSlug } from '../lib/slug'

export type NewExerciseInput = {
  nome: string
  descricao_curta: string
  nivel: 'iniciante' | 'intermediario' | 'avancado'
  equipamento_id: string
  objetivo_principal_id: string
  execucao: string
  video_url: string
  status: 'rascunho' | 'publicado'
}

async function createExercise(input: NewExerciseInput) {
  const { data, error } = await supabase
    .from('exercises')
    .insert({
      ...input,
      slug: gerarSlug(input.nome),
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export function useCreateExercise() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] })
      queryClient.invalidateQueries({ queryKey: ['admin-exercises'] })
    },
  })
}