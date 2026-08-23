// Converte um arquivo de imagem (JPEG, PNG, etc.) para o formato WebP,
// diretamente no navegador, usando um <canvas> como "estação de conversão"
// temporária. Também redimensiona se a imagem for maior que o necessário,
// economizando espaço extra.
export function converterParaWebp(
  file: File,
  larguraMaxima = 1200,
  qualidade = 0.82
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const urlTemporaria = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(urlTemporaria) // libera a memória usada pela prévia

      // Calcula o novo tamanho, mantendo a proporção original,
      // só reduzindo se a imagem for maior que o limite definido
      const escala = Math.min(1, larguraMaxima / img.width)
      const largura = Math.round(img.width * escala)
      const altura = Math.round(img.height * escala)

      const canvas = document.createElement('canvas')
      canvas.width = largura
      canvas.height = altura

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Não foi possível processar a imagem.'))
        return
      }
      ctx.drawImage(img, 0, 0, largura, altura)

      // toBlob converte o desenho do canvas em um arquivo de verdade,
      // já no formato webp e com a qualidade definida (0 a 1)
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Falha ao converter a imagem para WebP.'))
            return
          }
          const novoNome = file.name.replace(/\.[^.]+$/, '') + '.webp'
          resolve(new File([blob], novoNome, { type: 'image/webp' }))
        },
        'image/webp',
        qualidade
      )
    }

    img.onerror = () => reject(new Error('Não foi possível ler o arquivo de imagem.'))
    img.src = urlTemporaria
  })
}