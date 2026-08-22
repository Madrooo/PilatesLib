import { useState, type FormEvent } from 'react'
import { useEquipment, useObjectives } from '../hooks/useTaxonomy'

// Formato dos dados que o formulário manipula (sem o "status",
// que quem usa o formulário decide através dos botões)
export type ExerciseFormValues = {
  nome: string
  descricao_curta: string
  nivel: 'iniciante' | 'intermediario' | 'avancado'
  equipamento_id: string
  objetivo_principal_id: string
  execucao: string
  video_url: string
}

const CAMPOS_VAZIOS: ExerciseFormValues = {
  nome: '',
  descricao_curta: '',
  nivel: 'iniciante',
  equipamento_id: '',
  objetivo_principal_id: '',
  execucao: '',
  video_url: '',
}

type Props = {
  // Valores iniciais (preenchidos ao editar; vazio ao criar)
  initialValues?: ExerciseFormValues
  // Função chamada quando a pessoa clica em salvar, recebendo os
  // dados do formulário e o status escolhido
  onSubmit: (values: ExerciseFormValues, status: 'rascunho' | 'publicado') => void | Promise<void>
  isSaving: boolean
  // Texto do botão principal (ex: "Publicar" ou "Salvar alterações")
  submitLabel?: string
}

export function ExerciseForm({
  initialValues,
  onSubmit,
  isSaving,
  submitLabel = 'Publicar',
}: Props) {
  const { data: equipmentList } = useEquipment()
  const { data: objectivesList } = useObjectives()

  const [form, setForm] = useState<ExerciseFormValues>(initialValues ?? CAMPOS_VAZIOS)
  const [feedback, setFeedback] = useState<string | null>(null)

  function updateField<K extends keyof ExerciseFormValues>(field: K, value: ExerciseFormValues[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function validar(): string | null {
    if (!form.nome.trim()) return 'Preencha o nome do exercício.'
    if (!form.equipamento_id) return 'Selecione um equipamento.'
    if (!form.objetivo_principal_id) return 'Selecione um objetivo principal.'
    return null
  }

  async function handleClick(e: FormEvent, status: 'rascunho' | 'publicado') {
    e.preventDefault()
    const erro = validar()
    if (erro) {
      setFeedback(erro)
      return
    }
    setFeedback(null)
    await onSubmit(form, status)
  }

  return (
    <form className="space-y-4">
      {feedback && (
        <p className="text-sm px-3 py-2 rounded bg-red-50 text-red-700">{feedback}</p>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome do exercício
        </label>
        <input
          type="text"
          value={form.nome}
          onChange={(e) => updateField('nome', e.target.value)}
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Nível</label>
          <select
            value={form.nivel}
            onChange={(e) => updateField('nivel', e.target.value as ExerciseFormValues['nivel'])}
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
          onClick={(e) => handleClick(e, 'rascunho')}
          disabled={isSaving}
          className="border border-gray-300 text-gray-700 rounded px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          Salvar rascunho
        </button>
        <button
          type="button"
          onClick={(e) => handleClick(e, 'publicado')}
          disabled={isSaving}
          className="bg-teal-700 text-white rounded px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {isSaving ? 'Salvando...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
