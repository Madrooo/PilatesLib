import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

// "table" é o nome da tabela (equipment, objectives, muscles, etc.) —
// como as 5 categorias têm exatamente a mesma estrutura (id + nome),
// um único par de hooks genéricos serve para todas, em vez de duplicar
// o mesmo código 5 vezes.

export function useAddTaxonomyItem(table: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (nome: string) => {
      const { error } = await supabase.from(table).insert({ nome: nome.trim() })
      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table] })
    },
  })
}

export function useDeleteTaxonomyItem(table: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) {
        // O banco impede excluir uma categoria que ainda está sendo usada
        // por algum exercício (proteção de integridade dos dados). Em vez
        // de mostrar o erro técnico cru, traduzimos para algo compreensível.
        if (error.message.includes('foreign key constraint')) {
          throw new Error(
            'Não é possível excluir: essa categoria ainda está sendo usada por um ou mais exercícios.'
          )
        }
        throw new Error(error.message)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table] })
    },
  })
}