import { useExercises } from '../hooks/useExercises'
import { ExerciseCard } from '../components/ExerciseCard'

export function Biblioteca() {
  const { data: exercises, isLoading, error } = useExercises()

  // Enquanto os dados ainda estão sendo buscados no Supabase
  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Carregando exercícios...
      </div>
    )
  }

  // Se algo deu errado na busca (ex: sem internet, erro de permissão)
  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        Não foi possível carregar os exercícios: {error.message}
      </div>
    )
  }

  // Se a busca funcionou mas não existe nenhum exercício cadastrado ainda
  if (!exercises || exercises.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        Nenhum exercício cadastrado ainda.
      </div>
    )
  }

  // Caso normal: desenha um card para cada exercício encontrado
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Biblioteca de Exercícios
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {exercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </div>
  )
}