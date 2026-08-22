import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

// Esse "tipo" descreve o formato de um exercício, tal como o TypeScript
// precisa saber para nos avisar de erros (ex: usar um campo que não existe)
export type Exercise = {
  id: string
  nome: string
  slug: string
  descricao_curta: string | null
  nivel: 'iniciante' | 'intermediario' | 'avancado'
  imagem_url: string | null
  status: 'rascunho' | 'publicado'
}

// Função que efetivamente busca os dados no Supabase
async function fetchExercises(): Promise<Exercise[]> {
  const { data, error } = await supabase
    .from('exercises')
    .select('id, nome, slug, descricao_curta, nivel, imagem_url, status')
    .order('nome')

  if (error) {
    // Se der erro na consulta, "jogamos" o erro para o React Query tratar
    throw new Error(error.message)
  }

  return data ?? []
}

// Esse é o "hook" que qualquer componente vai poder usar assim:
// const { data, isLoading, error } = useExercises()
export function useExercises() {
  return useQuery({
    queryKey: ['exercises'],
    queryFn: fetchExercises,
  })
}