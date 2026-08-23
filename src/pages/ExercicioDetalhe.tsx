import { useParams, Link } from 'react-router-dom'
import { useExercise } from '../hooks/useExercise'

const nivelLabel = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
}

// Pequeno componente auxiliar: mostra uma seção só se ela tiver conteúdo.
// Reaproveitado várias vezes abaixo, para não repetir esse "if" toda hora.
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
        {title}
      </h2>
      <div className="text-gray-800">{children}</div>
    </div>
  )
}

// Mostra uma lista de textos (cues, erros comuns, etc.) como bullet points
function ListSection({ title, items }: { title: string; items: string[] | null }) {
  if (!items || items.length === 0) return null
  return (
    <Section title={title}>
      <ul className="list-disc pl-5 space-y-1">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </Section>
  )
}

// Tenta extrair o ID de vídeo do YouTube de uma URL comum, para montar o embed
function getYoutubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

export function ExercicioDetalhe() {
  // useParams lê o pedaço dinâmico da URL, ex: /exercicio/bridge -> slug = "bridge"
  const { slug } = useParams<{ slug: string }>()
  const { data: exercise, isLoading, error } = useExercise(slug)

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
          <Link to="/" className="text-teal-700 underline">
            Voltar para a Biblioteca
          </Link>
        </div>
      </div>
    )
  }

  const embedUrl = exercise.video_url ? getYoutubeEmbedUrl(exercise.video_url) : null

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link to="/" className="text-sm text-teal-700 hover:underline">
        ← Voltar para a Biblioteca
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mt-2">{exercise.nome}</h1>

      {/* Badges de nível, equipamento e objetivo */}
      <div className="flex flex-wrap gap-2 mt-3">
        <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
          {nivelLabel[exercise.nivel]}
        </span>
        {exercise.equipment && (
          <span className="px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700">
            {exercise.equipment.nome}
          </span>
        )}
        {exercise.objectives && (
          <span className="px-2 py-1 rounded text-xs font-medium bg-purple-50 text-purple-700">
            {exercise.objectives.nome}
          </span>
        )}
        {exercise.body_regions && (
          <span className="px-2 py-1 rounded text-xs font-medium bg-orange-50 text-orange-700">
            {exercise.body_regions.nome}
          </span>
        )}
      </div>

      {/* Mostra o vídeo, se existir. Só mostra a imagem se NÃO houver vídeo
          (evita repetir a mesma informação visual duas vezes seguidas) */}
      {embedUrl ? (
        <div className="mt-6 aspect-video">
          <iframe
            src={embedUrl}
            title={exercise.nome}
            className="w-full h-full rounded-lg"
            allowFullScreen
          />
        </div>
      ) : (
        exercise.imagem_url && (
          <img
            src={exercise.imagem_url}
            alt={exercise.nome}
            className="w-full rounded-lg mt-6"
          />
        )
      )}

      {exercise.descricao_curta && (
        <p className="mt-6 text-gray-600">{exercise.descricao_curta}</p>
      )}

      {exercise.posicao_inicial && (
        <Section title="Posição inicial">{exercise.posicao_inicial}</Section>
      )}

      {exercise.execucao && (
        <Section title="Execução">
          <p className="whitespace-pre-line">{exercise.execucao}</p>
        </Section>
      )}

      {exercise.respiracao && (
        <Section title="Respiração">{exercise.respiracao}</Section>
      )}

      <ListSection title="Cues / comandos verbais" items={exercise.cues} />
      <ListSection title="Erros comuns" items={exercise.erros_comuns} />
      <ListSection title="Indicações" items={exercise.indicacoes} />
      <ListSection title="Precauções" items={exercise.precaucoes} />
      <ListSection title="Contraindicações" items={exercise.contraindicacoes} />
    </div>
  )
}
