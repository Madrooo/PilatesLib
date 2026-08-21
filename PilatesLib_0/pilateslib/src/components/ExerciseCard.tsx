import type { Exercise } from '../hooks/useExercises'

// Mapeia o valor salvo no banco para um texto mais bonito na tela
const nivelLabel: Record<Exercise['nivel'], string> = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
}

// Mapeia o nível para uma cor de destaque (badge)
const nivelCor: Record<Exercise['nivel'], string> = {
  iniciante: 'bg-green-100 text-green-800',
  intermediario: 'bg-yellow-100 text-yellow-800',
  avancado: 'bg-red-100 text-red-800',
}

// "props" são os dados que esse componente recebe de fora.
// Aqui, ele recebe um único exercício para desenhar.
type Props = {
  exercise: Exercise
}

export function ExerciseCard({ exercise }: Props) {
  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow bg-white">
      {/* Se houver imagem, mostra; senão, mostra um bloco cinza no lugar */}
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
    </div>
  )
}