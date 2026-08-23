// Transforma o texto digitado no formulário (um item por linha) em uma
// lista de textos — formato que o banco espera para campos como "cues".
// Ex: "Ombros relaxados\nCore ativado" -> ["Ombros relaxados", "Core ativado"]
export function linhasParaArray(texto: string): string[] {
  return texto
    .split('\n')
    .map((linha) => linha.trim())
    .filter((linha) => linha.length > 0) // remove linhas em branco
}

// Faz o caminho inverso: pega a lista vinda do banco e junta em texto
// multi-linha, para exibir dentro de uma <textarea> ao editar
export function arrayParaLinhas(items: string[] | null | undefined): string {
  return (items ?? []).join('\n')
}