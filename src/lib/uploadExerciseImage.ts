import { supabase } from './supabaseClient'
import { converterParaWebp } from './converterParaWebp'

// Faz o processo completo: converte para WebP e envia ao bucket,
// retornando a URL pública para salvar no campo imagem_url do exercício
export async function uploadExerciseImage(file: File): Promise<string> {
  const arquivoWebp = await converterParaWebp(file)

  // Nome único para evitar que duas pessoas subindo imagens ao mesmo
  // tempo sobrescrevam uma a outra por engano
  const nomeArquivo = `${crypto.randomUUID()}.webp`

  const { error } = await supabase.storage
    .from('exercise-images')
    .upload(nomeArquivo, arquivoWebp, {
      contentType: 'image/webp',
      upsert: false,
    })

  if (error) throw new Error(error.message)

  // getPublicUrl não faz uma chamada de rede — só monta a URL final,
  // já que o bucket é público
  const { data } = supabase.storage.from('exercise-images').getPublicUrl(nomeArquivo)

  return data.publicUrl
}