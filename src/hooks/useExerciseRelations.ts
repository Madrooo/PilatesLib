import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

export type RelatedExercise = {
  relationId: string
  exercise: { id: string; nome: string; slug: string }
}

type ExerciseRefRow = {
  id: string
  nome: string
  slug: string
  status: 'rascunho' | 'publicado'
  excluido_em: string | null
}

// Busca as relações de um exercício nos DOIS sentidos: como "base" da
// relação (exercise_base_id) e como "relacionado" (exercise_relacionado_id).
// Isso é necessário porque, se A→B é progressão, o sistema já deve saber
// que B→A é regressão, sem precisar de uma segunda linha no banco (ver
// seção 8 da documentação).
async function fetchExerciseRelations(
  exerciseId: string,
  onlyPublished: boolean
): Promise<{ progressoes: RelatedExercise[]; regressoes: RelatedExercise[] }> {
  const [comoBase, comoRelacionado] = await Promise.all([
    supabase
      .from('exercise_progressions')
      .select('id, tipo_relacao, exercises:exercise_relacionado_id ( id, nome, slug, status, excluido_em )')
      .eq('exercise_base_id', exerciseId),
    supabase
      .from('exercise_progressions')
      .select('id, tipo_relacao, exercises:exercise_base_id ( id, nome, slug, status, excluido_em )')
      .eq('exercise_relacionado_id', exerciseId),
  ])

  if (comoBase.error) throw new Error(comoBase.error.message)
  if (comoRelacionado.error) throw new Error(comoRelacionado.error.message)

  function elegivel(ex: ExerciseRefRow | null): ex is ExerciseRefRow {
    if (!ex) return false
    if (!onlyPublished) return true
    return ex.status === 'publicado' && ex.excluido_em === null
  }

  const progressoes: RelatedExercise[] = []
  const regressoes: RelatedExercise[] = []

  // Relações em que este exercício é a "base": o sentido é direto
  for (const row of comoBase.data as unknown as Array<{
    id: string
    tipo_relacao: 'progressao' | 'regressao'
    exercises: ExerciseRefRow | null
  }>) {
    if (!elegivel(row.exercises)) continue
    const item = { relationId: row.id, exercise: row.exercises }
    if (row.tipo_relacao === 'progressao') progressoes.push(item)
    else regressoes.push(item)
  }

  // Relações em que este exercício é o "relacionado": o sentido é invertido
  for (const row of comoRelacionado.data as unknown as Array<{
    id: string
    tipo_relacao: 'progressao' | 'regressao'
    exercises: ExerciseRefRow | null
  }>) {
    if (!elegivel(row.exercises)) continue
    const item = { relationId: row.id, exercise: row.exercises }
    // Se X é regressão de A (A→X, tipo=regressao), então A é progressão de X
    if (row.tipo_relacao === 'regressao') progressoes.push(item)
    // Se X é progressão de A (A→X, tipo=progressao), então A é regressão de X
    else regressoes.push(item)
  }

  return { progressoes, regressoes }
}

export function useExerciseRelations(exerciseId: string | undefined, onlyPublished: boolean) {
  return useQuery({
    queryKey: ['exercise-relations', exerciseId, onlyPublished],
    queryFn: () => fetchExerciseRelations(exerciseId!, onlyPublished),
    enabled: !!exerciseId,
  })
}

export function useAddExerciseRelation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: {
      exercise_base_id: string
      exercise_relacionado_id: string
      tipo_relacao: 'progressao' | 'regressao'
    }) => {
      const { error } = await supabase.from('exercise_progressions').insert(input)
      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-relations'] })
    },
  })
}

export function useRemoveExerciseRelation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (relationId: string) => {
      const { error } = await supabase
        .from('exercise_progressions')
        .delete()
        .eq('id', relationId)
      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-relations'] })
    },
  })
}