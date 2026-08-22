import { Link } from 'react-router-dom'
import type { Exercise } from '../hooks/useExercises'

const nivelLabel: Record<Exercise['nivel'], string> = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
}

const nivelCor: Record<Exercise['nivel'], string> = {
  iniciante: 'bg-green-100 text-green-800',
  intermediario: 'bg-yellow-100 text-yellow-800',
  avancado: 'bg-red-100 text-red-800',
}

type Props = {
  exercise: Exercise
}

export function ExerciseCard({ exercise }: Props) {
  return (
    // Link envolvendo o card inteiro: o card todo vira clicável,
    // levando até /exercicio/<slug-do-exercicio>
    <Link
      to={`/exercicio/${exercise.slug}`}
      className="block rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow bg-white"
    >
      {exercise.imagem_url ? (
        <img
          src={exercise.imagem_url}
          alt={exercise.nome}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          Sem imagem
        </div>
      )}

      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{exercise.nome}</h3>

        {exercise.descricao_curta && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {exercise.descricao_curta}
          </p>
        )}

        <span
          className={`inline-block mt-3 px-2 py-1 rounded text-xs font-medium ${nivelCor[exercise.nivel]}`}
        >
          {nivelLabel[exercise.nivel]}
        </span>
      </div>
    </Link>
  )
}
