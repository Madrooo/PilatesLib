import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

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
  // Cada relação vem como um objeto aninhado (muscles: {nome}) — tratamos
  // isso na função de busca abaixo, convertendo para uma lista simples de nomes
  exercise_muscles: { muscles: { nome: string } }[]
  exercise_joints: { joints: { nome: string } }[]
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
      body_regions:regiao_corporal_id ( nome ),
      exercise_muscles ( muscles ( nome ) ),
      exercise_joints ( joints ( nome ) )
    `
    )
    .eq('slug', slug)
    .eq('status', 'publicado')
    .is('excluido_em', null)
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