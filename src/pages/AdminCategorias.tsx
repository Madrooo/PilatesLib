import { useState } from 'react'
import {
  useEquipment,
  useObjectives,
  useBodyRegions,
  useMuscles,
  useJoints,
  type TaxonomyItem,
} from '../hooks/useTaxonomy'
import { useAddTaxonomyItem, useDeleteTaxonomyItem } from '../hooks/useTaxonomyManager'

type Aba = {
  chave: string
  titulo: string
  tabela: string
  useLista: () => { data: TaxonomyItem[] | undefined; isLoading: boolean }
}

const ABAS: Aba[] = [
  { chave: 'equipment', titulo: 'Equipamento', tabela: 'equipment', useLista: useEquipment },
  { chave: 'objectives', titulo: 'Objetivo', tabela: 'objectives', useLista: useObjectives },
  { chave: 'body_regions', titulo: 'Região corporal', tabela: 'body_regions', useLista: useBodyRegions },
  { chave: 'muscles', titulo: 'Músculos', tabela: 'muscles', useLista: useMuscles },
  { chave: 'joints', titulo: 'Articulações', tabela: 'joints', useLista: useJoints },
]

export function AdminCategorias() {
  const [abaAtiva, setAbaAtiva] = useState(ABAS[0].chave)
  const aba = ABAS.find((a) => a.chave === abaAtiva)!

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Gerenciar categorias</h1>

      {/* Abas */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
        {ABAS.map((a) => (
          <button
            key={a.chave}
            onClick={() => setAbaAtiva(a.chave)}
            className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px ${
              a.chave === abaAtiva
                ? 'border-teal-700 text-teal-700'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {a.titulo}
          </button>
        ))}
      </div>

      {/* Conteúdo da aba selecionada — o "key" força recriar o painel ao
          trocar de aba, evitando estado antigo (ex: campo de texto)
          "vazar" de uma categoria para outra */}
      <CategoriaPainel key={aba.chave} aba={aba} />
    </div>
  )
}

function CategoriaPainel({ aba }: { aba: Aba }) {
  const { data: items, isLoading } = aba.useLista()
  const addItem = useAddTaxonomyItem(aba.tabela)
  const deleteItem = useDeleteTaxonomyItem(aba.tabela)

  const [novoNome, setNovoNome] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [confirmandoId, setConfirmandoId] = useState<string | null>(null)

  async function handleAdd() {
    if (!novoNome.trim()) {
      setFeedback('Digite um nome antes de adicionar.')
      return
    }
    setFeedback(null)
    try {
      await addItem.mutateAsync(novoNome)
      setNovoNome('')
    } catch (err) {
      setFeedback((err as Error).message)
    }
  }

  async function handleDelete(id: string) {
    setFeedback(null)
    try {
      await deleteItem.mutateAsync(id)
    } catch (err) {
      setFeedback((err as Error).message)
    } finally {
      setConfirmandoId(null)
    }
  }

  return (
    <div>
      {feedback && (
        <p className="text-sm px-3 py-2 rounded bg-red-50 text-red-700 mb-3">{feedback}</p>
      )}

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
          placeholder={`Nova opção de ${aba.titulo.toLowerCase()}...`}
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
        />
        <button
          onClick={handleAdd}
          disabled={addItem.isPending}
          className="bg-teal-700 text-white rounded px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          Adicionar
        </button>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Carregando...</p>}

      <ul className="divide-y divide-gray-100 border border-gray-200 rounded">
        {items?.map((item) => (
          <li key={item.id} className="flex items-center justify-between px-3 py-2 text-sm">
            <span>{item.nome}</span>

            {confirmandoId === item.id ? (
              <span className="flex items-center gap-2">
                <span className="text-gray-500 text-xs">Excluir mesmo?</span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 font-medium hover:underline text-xs"
                >
                  Sim
                </button>
                <button
                  onClick={() => setConfirmandoId(null)}
                  className="text-gray-500 hover:underline text-xs"
                >
                  Cancelar
                </button>
              </span>
            ) : (
              <button
                onClick={() => setConfirmandoId(item.id)}
                className="text-red-500 text-xs hover:underline"
              >
                excluir
              </button>
            )}
          </li>
        ))}
        {items && items.length === 0 && (
          <li className="px-3 py-2 text-sm text-gray-400">Nenhum item cadastrado.</li>
        )}
      </ul>
    </div>
  )
}
