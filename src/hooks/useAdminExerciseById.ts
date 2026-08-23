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
  // A sintaxe "exercise_muscles(muscle_id)" busca, junto do exercício,
  // a lista de relações já existentes na tabela de associação —
  // equivalente a fazer uma segunda consulta, só que em uma única chamada
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

  return {
    ...data,
    descricao_curta: data.descricao_curta ?? '',
    equipamento_id: data.equipamento_id ?? '',
    objetivo_principal_id: data.objetivo_principal_id ?? '',
    regiao_corporal_id: data.regiao_corporal_id ?? '',
    execucao: data.execucao ?? '',
    video_url: data.video_url ?? '',
    imagem_url: data.imagem_url ?? '',
    cues: arrayParaLinhas(data.cues),
    erros_comuns: arrayParaLinhas(data.erros_comuns),
    indicacoes: arrayParaLinhas(data.indicacoes),
    precaucoes: arrayParaLinhas(data.precaucoes),
    contraindicacoes: arrayParaLinhas(data.contraindicacoes),
    // Convertendo [{muscle_id: "abc"}, {muscle_id: "def"}] em ["abc", "def"]
    // — formato mais simples de trabalhar no formulário
    muscle_ids: (data.exercise_muscles ?? []).map((rel: { muscle_id: string }) => rel.muscle_id),
    joint_ids: (data.exercise_joints ?? []).map((rel: { joint_id: string }) => rel.joint_id),
  }
}

export function useAdminExerciseById(id: string | undefined) {
  return useQuery({
    queryKey: ['admin-exercise', id],
    queryFn: () => fetchExerciseById(id!),
    enabled: !!id,
  })
}