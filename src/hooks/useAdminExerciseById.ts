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
  status: 'rascunho' | 'publicado'
}

async function fetchExerciseById(id: string): Promise<ExerciseFormData | null> {
  const { data, error } = await supabase
    .from('exercises')
    .select(
      'id, nome, descricao_curta, nivel, equipamento_id, objetivo_principal_id, regiao_corporal_id, execucao, video_url, imagem_url, cues, erros_comuns, indicacoes, precaucoes, contraindicacoes, status'
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
    // Convertendo as listas vindas do banco de volta em texto multi-linha,
    // para exibir dentro das <textarea> do formulário de edição
    cues: arrayParaLinhas(data.cues),
    erros_comuns: arrayParaLinhas(data.erros_comuns),
    indicacoes: arrayParaLinhas(data.indicacoes),
    precaucoes: arrayParaLinhas(data.precaucoes),
    contraindicacoes: arrayParaLinhas(data.contraindicacoes),
  }
}

export function useAdminExerciseById(id: string | undefined) {
  return useQuery({
    queryKey: ['admin-exercise', id],
    queryFn: () => fetchExerciseById(id!),
    enabled: !!id,
  })
}