import imageCompression from 'browser-image-compression'

const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.15,
  maxWidthOrHeight: 1200,
  useWebWorker: true,
  initialQuality: 0.8,
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function esImagenValida(file) {
  return ALLOWED_TYPES.includes(file.type)
}

export function filtrarImagenesValidas(files) {
  return Array.from(files).filter(esImagenValida)
}

export async function comprimirImagen(file) {
  if (!esImagenValida(file)) {
    throw new Error(`Archivo no soportado: ${file.name}. Usa JPG, PNG o WEBP.`)
  }

  const compressed = await imageCompression(file, COMPRESSION_OPTIONS)
  return new File([compressed], file.name, { type: compressed.type })
}

export async function comprimirMultiplesImagenes(files, onProgress) {
  const total = files.length
  const comprimidas = []

  for (let i = 0; i < total; i++) {
    if (onProgress) onProgress(i + 1, total)
    const comprimida = await comprimirImagen(files[i])
    comprimidas.push(comprimida)
  }

  return comprimidas
}
