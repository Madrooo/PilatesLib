import { useNavigate } from 'react-router-dom'
import { ExerciseForm, type ExerciseFormValues } from '../components/ExerciseForm'
import { useCreateExercise } from '../hooks/useCreateExercise'

export function AdminNovo() {
  const navigate = useNavigate()
  const createExercise = useCreateExercise()

  async function handleSubmit(values: ExerciseFormValues, status: 'rascunho' | 'publicado') {
    await createExercise.mutateAsync({ ...values, status })
    // Depois de criar, volta para a lista de exercícios
    navigate('/admin')
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Cadastrar novo exercício
      </h1>
      <ExerciseForm
        onSubmit={handleSubmit}
        isSaving={createExercise.isPending}
        submitLabel="Publicar"
      />
    </div>
  )
}
