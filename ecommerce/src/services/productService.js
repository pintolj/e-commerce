import { supabase } from './supabaseClient'

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

export async function eliminarProducto(id, imagenUrl) {
  if (imagenUrl) {
    try {
      const urlParts = imagenUrl.split('/productos/')
      if (urlParts.length > 1) {
        const filePath = urlParts[1]
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
  const filePath = `${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('productos')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from('productos')
    .getPublicUrl(filePath)

  return data.publicUrl
}
