import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import { gerarSlug } from '../lib/slug'
import { linhasParaArray } from '../lib/textArray'
import type { ExerciseFormData } from './useAdminExerciseById'

async function updateExercise(input: ExerciseFormData) {
  if (!input.id) throw new Error('ID do exercício não informado.')

  const { id, muscle_ids, joint_ids, ...camposDiretos } = input

  const payload = {
    ...camposDiretos,
    equipamento_id: camposDiretos.equipamento_id || null,
    objetivo_principal_id: camposDiretos.objetivo_principal_id || null,
    regiao_corporal_id: camposDiretos.regiao_corporal_id || null,
    slug: gerarSlug(camposDiretos.nome),
    atualizado_em: new Date().toISOString(),
    cues: linhasParaArray(camposDiretos.cues),
    erros_comuns: linhasParaArray(camposDiretos.erros_comuns),
    indicacoes: linhasParaArray(camposDiretos.indicacoes),
    precaucoes: linhasParaArray(camposDiretos.precaucoes),
    contraindicacoes: linhasParaArray(camposDiretos.contraindicacoes),
  }

  const { data, error } = await supabase
    .from('exercises')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  // Para músculos e articulações, a forma mais simples e segura de
  // "editar" uma relação N:N é: apagar todas as relações antigas desse
  // exercício e recriar do zero com a seleção atual. Evita ter que
  // comparar "o que mudou" item por item.
  const { error: deleteMusclesError } = await supabase
    .from('exercise_muscles')
    .delete()
    .eq('exercise_id', id)
  if (deleteMusclesError) throw new Error(deleteMusclesError.message)

  if (muscle_ids.length > 0) {
    const { error: insertMusclesError } = await supabase
      .from('exercise_muscles')
      .insert(muscle_ids.map((muscle_id) => ({ exercise_id: id, muscle_id })))
    if (insertMusclesError) throw new Error(insertMusclesError.message)
  }

  const { error: deleteJointsError } = await supabase
    .from('exercise_joints')
    .delete()
    .eq('exercise_id', id)
  if (deleteJointsError) throw new Error(deleteJointsError.message)

  if (joint_ids.length > 0) {
    const { error: insertJointsError } = await supabase
      .from('exercise_joints')
      .insert(joint_ids.map((joint_id) => ({ exercise_id: id, joint_id })))
    if (insertJointsError) throw new Error(insertJointsError.message)
  }

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