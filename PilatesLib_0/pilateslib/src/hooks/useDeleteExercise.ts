import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

async function deleteExercise(id: string) {
  // Soft delete: em vez de apagar a linha de verdade (o que perderia o
  // conteúdo para sempre), só marcamos a data de exclusão. A policy de
  // leitura pública já ignora exercícios com excluido_em preenchido.
  const { error } = await supabase
    .from('exercises')
    .update({ excluido_em: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export function useDeleteExercise() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] })
      queryClient.invalidateQueries({ queryKey: ['admin-exercises'] })
    },
  })
}