import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import { gerarSlug } from '../lib/slug'
import { linhasParaArray } from '../lib/textArray'
import type { ExerciseFormData } from './useAdminExerciseById'

async function updateExercise(input: ExerciseFormData) {
  if (!input.id) throw new Error('ID do exercício não informado.')

  const { id, ...campos } = input

  const payload = {
    ...campos,
    equipamento_id: campos.equipamento_id || null,
    objetivo_principal_id: campos.objetivo_principal_id || null,
    regiao_corporal_id: campos.regiao_corporal_id || null,
    slug: gerarSlug(campos.nome),
    atualizado_em: new Date().toISOString(),
    cues: linhasParaArray(campos.cues),
    erros_comuns: linhasParaArray(campos.erros_comuns),
    indicacoes: linhasParaArray(campos.indicacoes),
    precaucoes: linhasParaArray(campos.precaucoes),
    contraindicacoes: linhasParaArray(campos.contraindicacoes),
  }

  const { data, error } = await supabase
    .from('exercises')
    .update(payload)
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
      queryClient.invalidateQueries({ queryKey: ['exercises'] })
      queryClient.invalidateQueries({ queryKey: ['admin-exercises'] })
      queryClient.invalidateQueries({ queryKey: ['admin-exercise', data.id] })
      queryClient.invalidateQueries({ queryKey: ['exercise', data.slug] })
    },
  })
}