import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import { gerarSlug } from '../lib/slug'

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
  status: 'rascunho' | 'publicado'
}

async function createExercise(input: NewExerciseInput) {
  // Se a região não foi selecionada, mandamos "null" em vez de string
  // vazia, para o banco não tentar salvar um UUID inválido
  const payload = {
    ...input,
    equipamento_id: input.equipamento_id || null,
    objetivo_principal_id: input.objetivo_principal_id || null,
    regiao_corporal_id: input.regiao_corporal_id || null,
    slug: gerarSlug(input.nome),
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