import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import { gerarSlug } from '../lib/slug'
import type { ExerciseFormData } from './useAdminExerciseById'

async function updateExercise(input: ExerciseFormData) {
  if (!input.id) throw new Error('ID do exercício não informado.')

  const { id, ...campos } = input

  const { data, error } = await supabase
    .from('exercises')
    .update({
      ...campos,
      slug: gerarSlug(campos.nome),
      atualizado_em: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export function useUpdateExercise() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateExercise,
    onSuccess: (data) => {
      // Invalida tanto a lista pública quanto a lista/detalhe do admin,
      // para tudo se atualizar sozinho depois de editar
      queryClient.invalidateQueries({ queryKey: ['exercises'] })
      queryClient.invalidateQueries({ queryKey: ['admin-exercises'] })
      queryClient.invalidateQueries({ queryKey: ['admin-exercise', data.id] })
      queryClient.invalidateQueries({ queryKey: ['exercise', data.slug] })
    },
  })
}