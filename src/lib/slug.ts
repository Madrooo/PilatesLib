// Transforma "Bridge com Abdução" em "bridge-com-abducao",
// formato usado na URL de cada exercício. Usado tanto ao criar
// quanto ao editar (se o nome mudar, o slug acompanha).
export function gerarSlug(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9]+/g, '-') // troca espaços/símbolos por hífen
    .replace(/(^-|-$)/g, '') // remove hífen sobrando no início/fim
}