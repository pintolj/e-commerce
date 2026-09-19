import { supabase } from './supabaseClient'
import { comprimirMultiplesImagenes } from '../utils/imageCompressor'

export async function obtenerProductos() {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function crearProducto(producto) {
  const { data, error } = await supabase
    .from('productos')
    .insert([producto])
    .select()

  if (error) throw error
  return data
}

export async function actualizarProducto(id, datosActualizados) {
  const { data, error } = await supabase
    .from('productos')
    .update(datosActualizados)
    .eq('id', id)
    .select()

  if (error) throw error
  return data
}

export async function eliminarProducto(id, imagenUrl, imagenes) {
  const urlsToTry = [imagenUrl, ...(imagenes || [])].filter(Boolean)
  for (const url of urlsToTry) {
    try {
      const urlParts = url.split('/productos/')
      if (urlParts.length > 1) {
        const filePath = urlParts[1].split('?')[0]
        await supabase.storage.from('productos').remove([filePath])
      }
    } catch {
      // Si falla el borrado de imagen, igual eliminamos el registro
    }
  }

  const { error } = await supabase
    .from('productos')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function subirImagen(file) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`
  const filePath = fileName

  const { error: uploadError } = await supabase.storage
    .from('productos')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from('productos')
    .getPublicUrl(filePath)

  return data.publicUrl
}

export async function subirMultiplesImagenes(files, onProgress) {
  const maxFiles = 6
  const filesToUpload = Array.from(files).slice(0, maxFiles)
  const urls = []

  for (let i = 0; i < filesToUpload.length; i++) {
    if (onProgress) onProgress(i + 1, filesToUpload.length)
    const url = await subirImagen(filesToUpload[i])
    urls.push(url)
  }

  return urls
}

export async function comprimirYSubirImagenes(files, onCompressProgress, onUploadProgress) {
  const maxFiles = 6
  const filesToProcess = Array.from(files).slice(0, maxFiles)
  const comprimidas = await comprimirMultiplesImagenes(filesToProcess, onCompressProgress)
  const urls = []

  for (let i = 0; i < comprimidas.length; i++) {
    if (onUploadProgress) onUploadProgress(i + 1, comprimidas.length)
    const url = await subirImagen(comprimidas[i])
    urls.push(url)
  }

  return urls
}
