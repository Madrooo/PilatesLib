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
  status: 'rascunho' | 'publicado'
}

async function createExercise(input: NewExerciseInput) {
  const payload = {
    ...input,
    equipamento_id: input.equipamento_id || null,
    objetivo_principal_id: input.objetivo_principal_id || null,
    regiao_corporal_id: input.regiao_corporal_id || null,
    slug: gerarSlug(input.nome),
    // Convertendo o texto "um item por linha" em listas antes de
    // salvar — é assim que essas colunas são guardadas no banco (text[])
    cues: linhasParaArray(input.cues),
    erros_comuns: linhasParaArray(input.erros_comuns),
    indicacoes: linhasParaArray(input.indicacoes),
    precaucoes: linhasParaArray(input.precaucoes),
    contraindicacoes: linhasParaArray(input.contraindicacoes),
  }

  const { data, error } = await supabase
    .from('exercises')
    .insert(payload)
    .select()
    .single()

  if (error) throw new Error(error.message)
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