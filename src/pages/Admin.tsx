import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminExercises } from '../hooks/useAdminExercises'
import { useDeleteExercise } from '../hooks/useDeleteExercise'

const nivelLabel = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
}

export function Admin() {
  const { data: exercises, isLoading, error } = useAdminExercises()
  const deleteExercise = useDeleteExercise()

  // Guarda qual exercício está com o "tem certeza?" aberto no momento
  const [confirmandoId, setConfirmandoId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    await deleteExercise.mutateAsync(id)
    setConfirmandoId(null)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Área administrativa</h1>
        <Link
          to="/admin/novo"
          className="bg-teal-700 text-white rounded px-4 py-2 text-sm font-medium"
        >
          + Novo exercício
        </Link>
      </div>

      {isLoading && <p className="text-gray-500">Carregando...</p>}
      {error && <p className="text-red-600">Erro: {error.message}</p>}

      {exercises && exercises.length === 0 && (
        <p className="text-gray-500">Nenhum exercício cadastrado ainda.</p>
      )}

      {exercises && exercises.length > 0 && (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left border-b border-gray-200 text-gray-500">
              <th className="py-2">Nome</th>
              <th className="py-2">Nível</th>
              <th className="py-2">Status</th>
              <th className="py-2 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {exercises.map((exercise) => (
              <tr key={exercise.id} className="border-b border-gray-100">
                <td className="py-2 font-medium text-gray-900">{exercise.nome}</td>
                <td className="py-2 text-gray-600">{nivelLabel[exercise.nivel]}</td>
                <td className="py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      exercise.status === 'publicado'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {exercise.status === 'publicado' ? 'Publicado' : 'Rascunho'}
                  </span>
                </td>
                <td className="py-2 text-right space-x-3">
                  <Link
                    to={`/admin/${exercise.id}/editar`}
                    className="text-teal-700 hover:underline"
                  >
                    Editar
                  </Link>

                  {confirmandoId === exercise.id ? (
                    <>
                      <span className="text-gray-500">Excluir mesmo?</span>
                      <button
                        onClick={() => handleDelete(exercise.id)}
                        disabled={deleteExercise.isPending}
                        className="text-red-600 font-medium hover:underline"
                      >
                        Sim
                      </button>
                      <button
                        onClick={() => setConfirmandoId(null)}
                        className="text-gray-500 hover:underline"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setConfirmandoId(exercise.id)}
                      className="text-red-600 hover:underline"
                    >
                      Excluir
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
