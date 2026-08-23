import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useExercises } from '../hooks/useExercises'
import { useEquipment, useObjectives, useBodyRegions } from '../hooks/useTaxonomy'
import { ExerciseCard } from '../components/ExerciseCard'

export function Biblioteca() {
  // useSearchParams lê e escreve os filtros direto na URL (ex: ?nivel=iniciante).
  // Isso deixa a busca "compartilhável" — se você copiar o link, os filtros vão junto.
  const [searchParams, setSearchParams] = useSearchParams()

  const { data: equipmentList } = useEquipment()
  const { data: objectivesList } = useObjectives()
  const { data: bodyRegionsList } = useBodyRegions()

  // O campo de texto tem um estado próprio, separado da URL, porque
  // não queremos disparar uma busca a cada letra digitada (ver useEffect abaixo)
  const [searchInput, setSearchInput] = useState(searchParams.get('busca') ?? '')

  // "Debounce": espera a pessoa parar de digitar por 400ms antes de
  // atualizar a URL (e, consequentemente, disparar a busca no banco).
  // Sem isso, cada letra digitada faria uma consulta nova — desperdício.
  useEffect(() => {
    const timeout = setTimeout(() => {
      updateParam('busca', searchInput)
    }, 400)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams)
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    setSearchParams(next)
  }

  function limparFiltros() {
    setSearchInput('')
    setSearchParams({})
  }

  const filters = {
    search: searchParams.get('busca') ?? undefined,
    nivel: searchParams.get('nivel') ?? undefined,
    equipamento_id: searchParams.get('equipamento') ?? undefined,
    objetivo_principal_id: searchParams.get('objetivo') ?? undefined,
    regiao_corporal_id: searchParams.get('regiao') ?? undefined,
  }

  const { data: exercises, isLoading, error } = useExercises(filters)

  const temFiltroAtivo = Object.values(filters).some(Boolean)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Biblioteca de Exercícios
      </h1>

      {/* Barra de busca e filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Buscar por nome..."
          className="border border-gray-300 rounded px-3 py-2 text-sm flex-1 min-w-[200px]"
        />

        <select
          value={filters.nivel ?? ''}
          onChange={(e) => updateParam('nivel', e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="">Nível: todos</option>
          <option value="iniciante">Iniciante</option>
          <option value="intermediario">Intermediário</option>
          <option value="avancado">Avançado</option>
        </select>

        <select
          value={filters.equipamento_id ?? ''}
          onChange={(e) => updateParam('equipamento', e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="">Equipamento: todos</option>
          {equipmentList?.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nome}
            </option>
          ))}
        </select>

        <select
          value={filters.objetivo_principal_id ?? ''}
          onChange={(e) => updateParam('objetivo', e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="">Objetivo: todos</option>
          {objectivesList?.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nome}
            </option>
          ))}
        </select>

        <select
          value={filters.regiao_corporal_id ?? ''}
          onChange={(e) => updateParam('regiao', e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="">Região: todas</option>
          {bodyRegionsList?.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nome}
            </option>
          ))}
        </select>

        {temFiltroAtivo && (
          <button
            onClick={limparFiltros}
            className="text-sm text-gray-500 hover:text-gray-800 underline"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {isLoading && (
        <div className="p-8 text-center text-gray-500">Carregando exercícios...</div>
      )}

      {error && (
        <div className="p-8 text-center text-red-600">
          Não foi possível carregar os exercícios: {error.message}
        </div>
      )}

      {exercises && exercises.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          {temFiltroAtivo
            ? 'Nenhum exercício encontrado com esses filtros.'
            : 'Nenhum exercício cadastrado ainda.'}
        </div>
      )}

      {exercises && exercises.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      )}
    </div>
  )
}
