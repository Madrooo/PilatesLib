import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ExerciseForm, type ExerciseFormValues } from '../components/ExerciseForm'
import { useAdminExerciseById } from '../hooks/useAdminExerciseById'
import { useUpdateExercise } from '../hooks/useUpdateExercise'

export function AdminEditar() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: exercise, isLoading, error } = useAdminExerciseById(id)
  const updateExercise = useUpdateExercise()
  const [saveError, setSaveError] = useState<string | null>(null)

  async function handleSubmit(values: ExerciseFormValues, status: 'rascunho' | 'publicado') {
    setSaveError(null)
    try {
      await updateExercise.mutateAsync({ id, ...values, status })
      navigate('/admin')
    } catch (err) {
      // Antes, um erro aqui "sumia" silenciosamente. Agora ele fica visível.
      setSaveError((err as Error).message)
    }
  }

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Carregando...</div>
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        Erro ao carregar exercício: {error.message}
      </div>
    )
  }

  if (!exercise) {
    return (
      <div className="p-8 text-center text-gray-500">
        Exercício não encontrado.
        <div className="mt-2">
          <Link to="/admin" className="text-teal-700 underline">
            Voltar para a lista
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Editar: {exercise.nome}
      </h1>

      {saveError && (
        <p className="mb-4 text-sm px-3 py-2 rounded bg-red-50 text-red-700">
          Erro ao salvar: {saveError}
        </p>
      )}

      <ExerciseForm
        initialValues={exercise}
        onSubmit={handleSubmit}
        isSaving={updateExercise.isPending}
        submitLabel="Salvar alterações"
      />
    </div>
  )
}
