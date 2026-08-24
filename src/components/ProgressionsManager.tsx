import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminExercises } from '../hooks/useAdminExercises'
import {
  useExerciseRelations,
  useAddExerciseRelation,
  useRemoveExerciseRelation,
} from '../hooks/useExerciseRelations'

type Props = {
  exerciseId: string
}

export function ProgressionsManager({ exerciseId }: Props) {
  const { data: allExercises } = useAdminExercises()
  const { data: relations, isLoading } = useExerciseRelations(exerciseId, false)
  const addRelation = useAddExerciseRelation()
  const removeRelation = useRemoveExerciseRelation()

  const [selectedId, setSelectedId] = useState('')
  const [tipo, setTipo] = useState<'progressao' | 'regressao'>('progressao')
  const [feedback, setFeedback] = useState<string | null>(null)

  // Não faz sentido o exercício aparecer na lista de opções para se
  // relacionar com ele mesmo
  const opcoes = allExercises?.filter((ex) => ex.id !== exerciseId) ?? []

  async function handleAdd() {
    if (!selectedId) {
      setFeedback('Selecione um exercício.')
      return
    }
    setFeedback(null)
    try {
      await addRelation.mutateAsync({
        exercise_base_id: exerciseId,
        exercise_relacionado_id: selectedId,
        tipo_relacao: tipo,
      })
      setSelectedId('')
    } catch (err) {
      setFeedback('Erro ao adicionar: ' + (err as Error).message)
    }
  }

  async function handleRemove(relationId: string) {
    try {
      await removeRelation.mutateAsync(relationId)
    } catch (err) {
      setFeedback('Erro ao remover: ' + (err as Error).message)
    }
  }

  return (
    <div className="pt-4 border-t border-gray-200 mt-6">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Progressões e regressões
      </h2>

      {feedback && (
        <p className="text-sm px-3 py-2 rounded bg-red-50 text-red-700 mb-3">{feedback}</p>
      )}

      {isLoading && <p className="text-sm text-gray-500">Carregando relações...</p>}

      {relations && (
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-xs font-medium text-gray-500 mb-1">
              Progressões (mais avançado)
            </h3>
            {relations.progressoes.length === 0 && (
              <p className="text-sm text-gray-400">Nenhuma cadastrada.</p>
            )}
            <ul className="space-y-1">
              {relations.progressoes.map((rel) => (
                <li
                  key={rel.relationId}
                  className="flex items-center justify-between text-sm bg-gray-50 rounded px-2 py-1"
                >
                  <Link to={`/exercicio/${rel.exercise.slug}`} className="text-teal-700 hover:underline" target="_blank">
                    {rel.exercise.nome}
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleRemove(rel.relationId)}
                    className="text-red-500 text-xs hover:underline ml-2"
                  >
                    remover
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-medium text-gray-500 mb-1">
              Regressões (mais simples)
            </h3>
            {relations.regressoes.length === 0 && (
              <p className="text-sm text-gray-400">Nenhuma cadastrada.</p>
            )}
            <ul className="space-y-1">
              {relations.regressoes.map((rel) => (
                <li
                  key={rel.relationId}
                  className="flex items-center justify-between text-sm bg-gray-50 rounded px-2 py-1"
                >
                  <Link to={`/exercicio/${rel.exercise.slug}`} className="text-teal-700 hover:underline" target="_blank">
                    {rel.exercise.nome}
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleRemove(rel.relationId)}
                    className="text-red-500 text-xs hover:underline ml-2"
                  >
                    remover
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-end gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Exercício relacionado
          </label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm min-w-[200px]"
          >
            <option value="">Selecione...</option>
            {opcoes.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as 'progressao' | 'regressao')}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="progressao">É uma progressão (mais avançado)</option>
            <option value="regressao">É uma regressão (mais simples)</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={addRelation.isPending}
          className="bg-gray-800 text-white rounded px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          Adicionar
        </button>
      </div>
    </div>
  )
}
