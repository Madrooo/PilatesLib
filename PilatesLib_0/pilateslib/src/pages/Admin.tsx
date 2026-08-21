import { useState, type FormEvent } from 'react'
import { useEquipment, useObjectives } from '../hooks/useTaxonomy'
import { useCreateExercise } from '../hooks/useCreateExercise'

export function Admin() {
  const { data: equipmentList } = useEquipment()
  const { data: objectivesList } = useObjectives()
  const createExercise = useCreateExercise()

  const [form, setForm] = useState({
    nome: '',
    descricao_curta: '',
    nivel: 'iniciante' as 'iniciante' | 'intermediario' | 'avancado',
    equipamento_id: '',
    objetivo_principal_id: '',
    execucao: '',
    video_url: '',
  })

  const [feedback, setFeedback] = useState<string | null>(null)

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: FormEvent, status: 'rascunho' | 'publicado') {
    e.preventDefault()
    setFeedback(null)

    // Validação manual: como os botões não são "type=submit",
    // o navegador não bloqueia sozinho campos vazios. Fazemos isso aqui.
    if (!form.nome.trim()) {
      setFeedback('Preencha o nome do exercício.')
      return
    }
    if (!form.equipamento_id) {
      setFeedback('Selecione um equipamento.')
      return
    }
    if (!form.objetivo_principal_id) {
      setFeedback('Selecione um objetivo principal.')
      return
    }

    try {
      await createExercise.mutateAsync({ ...form, status })
      setFeedback(
        status === 'publicado'
          ? 'Exercício publicado com sucesso!'
          : 'Exercício salvo como rascunho.'
      )
      setForm({
        nome: '',
        descricao_curta: '',
        nivel: 'iniciante',
        equipamento_id: '',
        objetivo_principal_id: '',
        execucao: '',
        video_url: '',
      })
    } catch (err) {
      setFeedback('Erro ao salvar: ' + (err as Error).message)
    }
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Cadastrar novo exercício
      </h1>

      {feedback && (
        <p className="mb-4 text-sm px-3 py-2 rounded bg-teal-50 text-teal-800">
          {feedback}
        </p>
      )}

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome do exercício
          </label>
          <input
            type="text"
            value={form.nome}
            onChange={(e) => updateField('nome', e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição curta
          </label>
          <textarea
            value={form.descricao_curta}
            onChange={(e) => updateField('descricao_curta', e.target.value)}
            rows={2}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nível
            </label>
            <select
              value={form.nivel}
              onChange={(e) => updateField('nivel', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="iniciante">Iniciante</option>
              <option value="intermediario">Intermediário</option>
              <option value="avancado">Avançado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Equipamento
            </label>
            <select
              value={form.equipamento_id}
              onChange={(e) => updateField('equipamento_id', e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">Selecione...</option>
              {equipmentList?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Objetivo principal
            </label>
            <select
              value={form.objetivo_principal_id}
              onChange={(e) => updateField('objetivo_principal_id', e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">Selecione...</option>
              {objectivesList?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Execução (passo a passo)
          </label>
          <textarea
            value={form.execucao}
            onChange={(e) => updateField('execucao', e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Link do vídeo (YouTube, etc.)
          </label>
          <input
            type="url"
            value={form.video_url}
            onChange={(e) => updateField('video_url', e.target.value)}
            placeholder="https://..."
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'rascunho')}
            disabled={createExercise.isPending}
            className="border border-gray-300 text-gray-700 rounded px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            Salvar rascunho
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'publicado')}
            disabled={createExercise.isPending}
            className="bg-teal-700 text-white rounded px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            Publicar
          </button>
        </div>
      </form>
    </div>
  )
}