import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

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
  status: 'rascunho' | 'publicado'
}

async function fetchExerciseById(id: string): Promise<ExerciseFormData | null> {
  const { data, error } = await supabase
    .from('exercises')
    .select(
      'id, nome, descricao_curta, nivel, equipamento_id, objetivo_principal_id, regiao_corporal_id, execucao, video_url, imagem_url, status'
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
  }
}

export function useAdminExerciseById(id: string | undefined) {
  return useQuery({
    queryKey: ['admin-exercise', id],
    queryFn: () => fetchExerciseById(id!),
    enabled: !!id,
  })
}