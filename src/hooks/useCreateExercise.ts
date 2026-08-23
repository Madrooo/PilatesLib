import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import { gerarSlug } from '../lib/slug'
import { linhasParaArray } from '../lib/textArray'

export type NewExerciseInput = {
  nome: string
  descricao_curta: string
  nivel: 'iniciante' | 'intermediario' | 'avancado'
  equipamento_id: string
  objetivo_principal_id: string
  regiao_corporal_id: string
  execucao: string
  video_url: string
  imagem_url: string
  cues: string
  erros_comuns: string
  indicacoes: string
  precaucoes: string
  contraindicacoes: string
  muscle_ids: string[]
  joint_ids: string[]
  status: 'rascunho' | 'publicado'
}

async function createExercise(input: NewExerciseInput) {
  const { muscle_ids, joint_ids, ...camposDiretos } = input

  const payload = {
    ...camposDiretos,
    equipamento_id: camposDiretos.equipamento_id || null,
    objetivo_principal_id: camposDiretos.objetivo_principal_id || null,
    regiao_corporal_id: camposDiretos.regiao_corporal_id || null,
    slug: gerarSlug(camposDiretos.nome),
    cues: linhasParaArray(camposDiretos.cues),
    erros_comuns: linhasParaArray(camposDiretos.erros_comuns),
    indicacoes: linhasParaArray(camposDiretos.indicacoes),
    precaucoes: linhasParaArray(camposDiretos.precaucoes),
    contraindicacoes: linhasParaArray(camposDiretos.contraindicacoes),
  }

  // Passo 1: cria o exercício em si e recebe o ID gerado de volta
  const { data, error } = await supabase
    .from('exercises')
    .insert(payload)
    .select()
    .single()

  if (error) throw new Error(error.message)

  // Passo 2: com o ID em mãos, cria as relações de músculos (tabela separada)
  if (muscle_ids.length > 0) {
    const { error: muscleError } = await supabase
      .from('exercise_muscles')
      .insert(muscle_ids.map((muscle_id) => ({ exercise_id: data.id, muscle_id })))
    if (muscleError) throw new Error(muscleError.message)
  }

  // Passo 3: o mesmo para articulações
  if (joint_ids.length > 0) {
    const { error: jointError } = await supabase
      .from('exercise_joints')
      .insert(joint_ids.map((joint_id) => ({ exercise_id: data.id, joint_id })))
    if (jointError) throw new Error(jointError.message)
  }

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