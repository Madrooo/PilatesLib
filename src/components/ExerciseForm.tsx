import { useState, type FormEvent } from 'react'
import {
  useEquipment,
  useObjectives,
  useBodyRegions,
  useMuscles,
  useJoints,
} from '../hooks/useTaxonomy'
import { uploadExerciseImage } from '../lib/uploadExerciseImage'
import { CheckboxList } from './CheckboxList'

export type ExerciseFormValues = {
  nome: string
  descricao_curta: string
  nivel: 'iniciante' | 'intermediario' | 'avancado'
  equipamento_id: string
  objetivo_principal_id: string
  regiao_corporal_id: string
  execucao: string
  video_url: string
  imagem_url: string
  cues: string
  erros_comuns: string
  indicacoes: string
  precaucoes: string
  contraindicacoes: string
  // Seleção múltipla: guardamos os IDs dos músculos/articulações marcados
  muscle_ids: string[]
  joint_ids: string[]
}

const CAMPOS_VAZIOS: ExerciseFormValues = {
  nome: '',
  descricao_curta: '',
  nivel: 'iniciante',
  equipamento_id: '',
  objetivo_principal_id: '',
  regiao_corporal_id: '',
  execucao: '',
  video_url: '',
  imagem_url: '',
  cues: '',
  erros_comuns: '',
  indicacoes: '',
  precaucoes: '',
  contraindicacoes: '',
  muscle_ids: [],
  joint_ids: [],
}

type Props = {
  initialValues?: ExerciseFormValues
  onSubmit: (values: ExerciseFormValues, status: 'rascunho' | 'publicado') => void | Promise<void>
  isSaving: boolean
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
  const { data: bodyRegionsList } = useBodyRegions()
  const { data: musclesList } = useMuscles()
  const { data: jointsList } = useJoints()

  const [form, setForm] = useState<ExerciseFormValues>(initialValues ?? CAMPOS_VAZIOS)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  function updateField<K extends keyof ExerciseFormValues>(field: K, value: ExerciseFormValues[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingImage(true)
    setFeedback(null)
    try {
      const url = await uploadExerciseImage(file)
      updateField('imagem_url', url)
    } catch (err) {
      setFeedback('Erro ao enviar imagem: ' + (err as Error).message)
    } finally {
      setIsUploadingImage(false)
      e.target.value = ''
    }
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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Região corporal
          </label>
          <select
            value={form.regiao_corporal_id}
            onChange={(e) => updateField('regiao_corporal_id', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="">Selecione...</option>
            {bodyRegionsList?.map((item) => (
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Imagem</label>

        {form.imagem_url && (
          <img
            src={form.imagem_url}
            alt="Prévia"
            className="w-40 h-28 object-cover rounded border border-gray-200 mb-2"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={isUploadingImage}
          className="text-sm"
        />

        {isUploadingImage && (
          <p className="text-sm text-gray-500 mt-1">Enviando imagem...</p>
        )}
      </div>

      {/* ----- Campos clínicos ----- */}
      <div className="pt-4 border-t border-gray-200">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Informações clínicas
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cues / comandos verbais{' '}
              <span className="text-gray-400 font-normal">(um por linha)</span>
            </label>
            <textarea
              value={form.cues}
              onChange={(e) => updateField('cues', e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Erros comuns{' '}
              <span className="text-gray-400 font-normal">(um por linha)</span>
            </label>
            <textarea
              value={form.erros_comuns}
              onChange={(e) => updateField('erros_comuns', e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Indicações{' '}
              <span className="text-gray-400 font-normal">(um por linha)</span>
            </label>
            <textarea
              value={form.indicacoes}
              onChange={(e) => updateField('indicacoes', e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precauções{' '}
              <span className="text-gray-400 font-normal">(um por linha)</span>
            </label>
            <textarea
              value={form.precaucoes}
              onChange={(e) => updateField('precaucoes', e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraindicações{' '}
              <span className="text-gray-400 font-normal">(um por linha)</span>
            </label>
            <textarea
              value={form.contraindicacoes}
              onChange={(e) => updateField('contraindicacoes', e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Músculos envolvidos
            </label>
            <CheckboxList
              items={musclesList}
              selectedIds={form.muscle_ids}
              onChange={(ids) => updateField('muscle_ids', ids)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Articulações envolvidas
            </label>
            <CheckboxList
              items={jointsList}
              selectedIds={form.joint_ids}
              onChange={(ids) => updateField('joint_ids', ids)}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={(e) => handleClick(e, 'rascunho')}
          disabled={isSaving || isUploadingImage}
          className="border border-gray-300 text-gray-700 rounded px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          Salvar rascunho
        </button>
        <button
          type="button"
          onClick={(e) => handleClick(e, 'publicado')}
          disabled={isSaving || isUploadingImage}
          className="bg-teal-700 text-white rounded px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {isSaving ? 'Salvando...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
