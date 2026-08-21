import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

// Dados que o formulário vai enviar para criar um exercício.
export type NewExerciseInput = {
  nome: string
  descricao_curta: string
  nivel: 'iniciante' | 'intermediario' | 'avancado'
  equipamento_id: string
  objetivo_principal_id: string
  execucao: string
  video_url: string
  status: 'rascunho' | 'publicado'
}

// Transforma "Bridge com Abdução" em "bridge-com-abducao",
// formato usado na URL de cada exercício (slug)
function gerarSlug(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9]+/g, '-') // troca espaços/símbolos por hífen
    .replace(/(^-|-$)/g, '') // remove hífen sobrando no início/fim
}

async function createExercise(input: NewExerciseInput) {
  const { data, error } = await supabase
    .from('exercises')
    .insert({
      ...input,
      slug: gerarSlug(input.nome),
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

// useMutation é o "irmão" do useQuery, mas para operações de
// escrita (criar/editar/excluir) em vez de leitura.
export function useCreateExercise() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] })
    },
  })
}