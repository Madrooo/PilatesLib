import type { TaxonomyItem } from '../hooks/useTaxonomy'

type Props = {
  items: TaxonomyItem[] | undefined
  selectedIds: string[]
  onChange: (newSelectedIds: string[]) => void
}

// Lista de checkboxes genérica: recebe as opções disponíveis, quais estão
// marcadas, e uma função para avisar quando a seleção mudar. Usada tanto
// para músculos quanto para articulações (mesma lógica, dados diferentes).
export function CheckboxList({ items, selectedIds, onChange }: Props) {
  function toggle(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((selectedId) => selectedId !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 max-h-48 overflow-y-auto border border-gray-200 rounded p-3">
      {items?.map((item) => (
        <label key={item.id} className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={selectedIds.includes(item.id)}
            onChange={() => toggle(item.id)}
            className="rounded border-gray-300"
          />
          {item.nome}
        </label>
      ))}
    </div>
  )
}
