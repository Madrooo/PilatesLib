import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import { arrayParaLinhas } from '../lib/textArray'

export type ExerciseFormData = {
  id?: string
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

async function fetchExerciseById(id: string): Promise<ExerciseFormData | null> {
  const { data, error } = await supabase
    .from('exercises')
    .select(
      `
      id, nome, descricao_curta, nivel, equipamento_id, objetivo_principal_id,
      regiao_corporal_id, execucao, video_url, imagem_url,
      cues, erros_comuns, indicacoes, precaucoes, contraindicacoes, status,
      exercise_muscles ( muscle_id ),
      exercise_joints ( joint_id )
    `
    )
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(error.message)
  }

  // IMPORTANTE: extraímos "exercise_muscles" e "exercise_joints" aqui para
  // FORA do objeto (usando essa sintaxe de desestruturação), justamente
  // para que essas chaves brutas não "vazem" para o restante do formulário
  // — sem isso, elas acabavam sendo enviadas de volta ao Supabase na hora
  // de salvar, e "exercise_joints" não é uma coluna de verdade na tabela.
  const { exercise_muscles, exercise_joints, ...dadosDiretos } = data

  return {
    ...dadosDiretos,
    descricao_curta: dadosDiretos.descricao_curta ?? '',
    equipamento_id: dadosDiretos.equipamento_id ?? '',
    objetivo_principal_id: dadosDiretos.objetivo_principal_id ?? '',
    regiao_corporal_id: dadosDiretos.regiao_corporal_id ?? '',
    execucao: dadosDiretos.execucao ?? '',
    video_url: dadosDiretos.video_url ?? '',
    imagem_url: dadosDiretos.imagem_url ?? '',
    cues: arrayParaLinhas(dadosDiretos.cues),
    erros_comuns: arrayParaLinhas(dadosDiretos.erros_comuns),
    indicacoes: arrayParaLinhas(dadosDiretos.indicacoes),
    precaucoes: arrayParaLinhas(dadosDiretos.precaucoes),
    contraindicacoes: arrayParaLinhas(dadosDiretos.contraindicacoes),
    muscle_ids: (exercise_muscles ?? []).map((rel: { muscle_id: string }) => rel.muscle_id),
    joint_ids: (exercise_joints ?? []).map((rel: { joint_id: string }) => rel.joint_id),
  }
}

export function useAdminExerciseById(id: string | undefined) {
  return useQuery({
    queryKey: ['admin-exercise', id],
    queryFn: () => fetchExerciseById(id!),
    enabled: !!id,
  })
}