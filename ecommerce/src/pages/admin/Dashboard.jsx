import { useState, useEffect } from 'react'
import { Package, Loader2, Trash2, Pencil, X, Plus, ImagePlus } from 'lucide-react'
import { crearProducto, obtenerProductos, eliminarProducto, actualizarProducto, comprimirYSubirImagenes } from '../../services/productService'
import { esImagenValida } from '../../utils/imageCompressor'

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount)
}

const MAX_IMAGES = 6
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']

function esExtensionValida(nombre) {
  const ext = nombre.split('.').pop().toLowerCase()
  return ALLOWED_EXTENSIONS.includes(ext)
}

export default function Dashboard() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [progressMsg, setProgressMsg] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [categoria, setCategoria] = useState('')
  const [precio, setPrecio] = useState('')
  const [stock, setStock] = useState('')
  const [tallas, setTallas] = useState('')
  const [colores, setColores] = useState('')
  const [nuevasImagenes, setNuevasImagenes] = useState([])
  const [previewsExistentes, setPreviewsExistentes] = useState([])
  const [previewsNuevas, setPreviewsNuevas] = useState([])

  const fetchProductos = async () => {
    setLoading(true)
    try {
      const data = await obtenerProductos()
      setProductos(data)
    } catch (error) {
      console.error('Error al obtener productos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProductos() }, [])

  const resetForm = () => {
    setNombre(''); setDescripcion(''); setCategoria('')
    setPrecio(''); setStock(''); setTallas(''); setColores('')
    setNuevasImagenes([]); setPreviewsExistentes([]); setPreviewsNuevas([])
    setEditId(null); setProgressMsg('')
  }

  const openCreateModal = () => {
    resetForm()
    setShowModal(true)
  }

  const openEditModal = (producto) => {
    setEditId(producto.id)
    setNombre(producto.nombre)
    setDescripcion(producto.descripcion || '')
    setCategoria(producto.categoria || '')
    setPrecio(producto.precio)
    setStock(producto.stock)
    setTallas(producto.tallas || '')
    setColores(producto.colores || '')
    setNuevasImagenes([])
    setPreviewsNuevas([])
    const imagenesExistentes = producto.imagenes || (producto.imagen_url ? [producto.imagen_url] : [])
    setPreviewsExistentes(imagenesExistentes)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    resetForm()
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || [])
    const totalActual = previewsExistentes.length + previewsNuevas.length
    const disponibles = MAX_IMAGES - totalActual
    if (disponibles <= 0) return

    const archivosValidos = files.filter((f) => esImagenValida(f) && esExtensionValida(f.name))
    const archivosAGuardar = archivosValidos.slice(0, disponibles)
    const nuevasPreviews = archivosAGuardar.map((f) => URL.createObjectURL(f))

    setNuevasImagenes((prev) => [...prev, ...archivosAGuardar])
    setPreviewsNuevas((prev) => [...prev, ...nuevasPreviews])
    e.target.value = ''
  }

  const removePreviewExistente = (index) => {
    setPreviewsExistentes((prev) => prev.filter((_, i) => i !== index))
  }

  const removePreviewNueva = (index) => {
    setNuevasImagenes((prev) => prev.filter((_, i) => i !== index))
    setPreviewsNuevas((prev) => prev.filter((_, i) => i !== index))
  }

  const totalImagenes = previewsExistentes.length + previewsNuevas.length

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      let urlsNuevas = []
      if (nuevasImagenes.length > 0) {
        setProgressMsg('Optimizando imagenes...')
        urlsNuevas = await comprimirYSubirImagenes(
          nuevasImagenes,
          (current, total) => setProgressMsg(`Comprimiendo ${current}/${total}...`),
          (current, total) => setProgressMsg(`Subiendo ${current}/${total}...`)
        )
      }

      const todasLasUrls = [...previewsExistentes, ...urlsNuevas]
      const imagenUrl = todasLasUrls[0] || null
      const imagenes = todasLasUrls

      const productoData = {
        nombre,
        descripcion,
        categoria,
        precio: parseFloat(precio),
        stock: parseInt(stock),
        tallas: tallas,
        colores: colores,
        imagen_url: imagenUrl,
        imagenes: imagenes
      }

      if (editId) {
        await actualizarProducto(editId, productoData)
      } else {
        await crearProducto(productoData)
      }

      closeModal()
      await fetchProductos()
    } catch (error) {
      console.error('Error al guardar producto:', error)
      setProgressMsg('Error: ' + error.message)
    } finally {
      setSubmitting(false)
      setProgressMsg('')
    }
  }

  const handleDelete = async (id, producto) => {
    if (!confirm('Estas seguro de eliminar este producto?')) return
    setDeletingId(id)
    try {
      await eliminarProducto(id, producto.imagen_url, producto.imagenes)
      await fetchProductos()
    } catch (error) {
      console.error('Error al eliminar producto:', error)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Panel de Administracion</h1>
            <p className="text-xs sm:text-sm text-gray-500">Gestiona los productos de tu tienda</p>
          </div>
          <button onClick={openCreateModal} className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-5 py-2.5 rounded-lg font-medium transition-colors cursor-pointer min-h-[44px] text-sm sm:text-base flex-shrink-0">
            <Plus size={20} />
            Agregar Producto
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800 text-sm sm:text-base">Inventario ({productos.length} productos)</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12 sm:py-16 text-gray-400">
              <Loader2 size={24} className="animate-spin mr-2" />
              Cargando productos...
            </div>
          ) : productos.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <Package size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No hay productos registrados</p>
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-3">Producto</th>
                      <th className="px-6 py-3">Precio</th>
                      <th className="px-6 py-3">Stock</th>
                      <th className="px-6 py-3">Tallas</th>
                      <th className="px-6 py-3">Colores</th>
                      <th className="px-6 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {productos.map((producto) => (
                      <tr key={producto.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              {producto.imagen_url ? (
                                <img src={producto.imagen_url} alt={producto.nombre} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                  <Package size={20} />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{producto.nombre}</p>
                              {producto.categoria && <p className="text-xs text-gray-500">{producto.categoria}</p>}
                              {producto.imagenes && producto.imagenes.length > 1 && (
                                <p className="text-[10px] text-indigo-500">{producto.imagenes.length} fotos</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">{formatCurrency(producto.precio)}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${producto.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {producto.stock} uds
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{producto.tallas || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{producto.colores || '-'}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => openEditModal(producto)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center" title="Editar">
                              <Pencil size={16} />
                            </button>
                            <button onClick={() => handleDelete(producto.id, producto)} disabled={deletingId === producto.id} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50 min-w-[36px] min-h-[36px] flex items-center justify-center" title="Eliminar">
                              {deletingId === producto.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden divide-y divide-gray-100">
                {productos.map((producto) => (
                  <div key={producto.id} className="p-4 flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {producto.imagen_url ? (
                        <img src={producto.imagen_url} alt={producto.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Package size={20} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{producto.nombre}</p>
                          {producto.categoria && <p className="text-xs text-gray-500">{producto.categoria}</p>}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button onClick={() => openEditModal(producto)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => handleDelete(producto.id, producto)} disabled={deletingId === producto.id} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50 min-w-[36px] min-h-[36px] flex items-center justify-center">
                            {deletingId === producto.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="font-medium text-gray-900 text-sm">{formatCurrency(producto.precio)}</span>
                        <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full ${producto.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {producto.stock} uds
                        </span>
                        {producto.tallas && <span className="text-xs text-gray-500">T: {producto.tallas}</span>}
                        {producto.colores && <span className="text-xs text-gray-500">C: {producto.colores}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" onClick={closeModal}>
            <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] sm:max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">{editId ? 'Editar Producto' : 'Agregar Producto'}</h3>
                <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none min-h-[44px]" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripcion</label>
                  <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <input type="text" value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none min-h-[44px]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio (S/)</label>
                    <input type="number" step="0.01" min="0" value={precio} onChange={(e) => setPrecio(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none min-h-[44px]" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none min-h-[44px]" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tallas</label>
                    <input type="text" value={tallas} onChange={(e) => setTallas(e.target.value)} placeholder="S, M, L, XL" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none min-h-[44px]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Colores</label>
                    <input type="text" value={colores} onChange={(e) => setColores(e.target.value)} placeholder="Rojo, Negro" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none min-h-[44px]" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">Imagenes</label>
                    <span className={`text-xs font-medium ${totalImagenes >= MAX_IMAGES ? 'text-red-500' : 'text-gray-400'}`}>
                      {totalImagenes}/{MAX_IMAGES}
                    </span>
                  </div>

                  {(previewsExistentes.length > 0 || previewsNuevas.length > 0) && (
                    <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
                      {previewsExistentes.map((url, i) => (
                        <div key={`exist-${i}`} className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group">
                          <img src={url} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removePreviewExistente(i)} className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity min-w-[20px] min-h-[20px] flex items-center justify-center">
                            <X size={10} />
                          </button>
                          {i === 0 && <span className="absolute bottom-0 left-0 bg-indigo-600 text-white text-[8px] px-1 rounded-tr">Principal</span>}
                        </div>
                      ))}
                      {previewsNuevas.map((url, i) => (
                        <div key={`nueva-${i}`} className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-indigo-200 group">
                          <img src={url} alt={`Nueva ${i + 1}`} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removePreviewNueva(i)} className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity min-w-[20px] min-h-[20px] flex items-center justify-center">
                            <X size={10} />
                          </button>
                          {previewsExistentes.length === 0 && i === 0 && <span className="absolute bottom-0 left-0 bg-indigo-600 text-white text-[8px] px-1 rounded-tr">Principal</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  {totalImagenes < MAX_IMAGES && (
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors">
                      <ImagePlus className="w-6 h-6 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-400">JPG, PNG, WEBP - Max {MAX_IMAGES} fotos</span>
                      <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleImageChange} className="hidden" />
                    </label>
                  )}

                  {totalImagenes === 0 && (
                    <p className="text-xs text-gray-400 text-center mt-1">No hay imagenes seleccionadas</p>
                  )}
                </div>

                {progressMsg && (
                  <div className="flex items-center gap-2 p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-700 text-sm">
                    <Loader2 size={16} className="animate-spin flex-shrink-0" />
                    {progressMsg}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button type="submit" disabled={submitting} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-white transition-colors cursor-pointer disabled:opacity-50 min-h-[48px] ${editId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                    {submitting && <Loader2 size={18} className="animate-spin" />}
                    {submitting && progressMsg ? progressMsg : (editId ? 'Actualizar Producto' : 'Crear Producto')}
                  </button>
                  <button type="button" onClick={closeModal} className="px-6 py-3 rounded-lg font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer min-h-[48px]">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}