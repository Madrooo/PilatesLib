import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

// Formato completo de um exercício, incluindo os nomes das categorias
// relacionadas (não só os IDs, que é o que a tabela "exercises" guarda)
export type ExerciseDetail = {
  id: string
  nome: string
  slug: string
  descricao_curta: string | null
  posicao_inicial: string | null
  execucao: string | null
  respiracao: string | null
  cues: string[] | null
  erros_comuns: string[] | null
  indicacoes: string[] | null
  precaucoes: string[] | null
  contraindicacoes: string[] | null
  nivel: 'iniciante' | 'intermediario' | 'avancado'
  video_url: string | null
  imagem_url: string | null
  equipment: { nome: string } | null
  objectives: { nome: string } | null
  body_regions: { nome: string } | null
}

async function fetchExerciseBySlug(slug: string): Promise<ExerciseDetail | null> {
  const { data, error } = await supabase
    .from('exercises')
    .select(
      `
      id, nome, slug, descricao_curta, posicao_inicial, execucao, respiracao,
      cues, erros_comuns, indicacoes, precaucoes, contraindicacoes,
      nivel, video_url, imagem_url,
      equipment:equipamento_id ( nome ),
      objectives:objetivo_principal_id ( nome ),
      body_regions:regiao_corporal_id ( nome )
    `
    )
    .eq('slug', slug)
    .eq('status', 'publicado')
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(error.message)
  }

  return data as unknown as ExerciseDetail
}

export function useExercise(slug: string | undefined) {
  return useQuery({
    queryKey: ['exercise', slug],
    queryFn: () => fetchExerciseBySlug(slug!),
    enabled: !!slug,
  })
}