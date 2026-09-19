import { useState, useEffect } from 'react'
import { Package, Loader2, Trash2, Pencil, X, Plus } from 'lucide-react'
import { crearProducto, obtenerProductos, eliminarProducto, actualizarProducto, subirImagen } from '../../services/productService'

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount)
}

export default function Dashboard() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [categoria, setCategoria] = useState('')
  const [precio, setPrecio] = useState('')
  const [stock, setStock] = useState('')
  const [tallas, setTallas] = useState('')
  const [colores, setColores] = useState('')
  const [imagen, setImagen] = useState(null)
  const [imagenPreview, setImagenPreview] = useState(null)

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
    setImagen(null); setImagenPreview(null); setEditId(null)
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
    setImagen(null)
    setImagenPreview(producto.imagen_url || null)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    resetForm()
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null
    if (file) {
      setImagen(file)
      setImagenPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      let imagenUrl = imagenPreview
      if (imagen) {
        imagenUrl = await subirImagen(imagen)
      }

      const productoData = {
        nombre,
        descripcion,
        categoria,
        precio: parseFloat(precio),
        stock: parseInt(stock),
        tallas: tallas,
        colores: colores,
        imagen_url: imagenUrl
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
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id, imagenUrl) => {
    if (!confirm('Estas seguro de eliminar este producto?')) return
    setDeletingId(id)
    try {
      await eliminarProducto(id, imagenUrl)
      await fetchProductos()
    } catch (error) {
      console.error('Error al eliminar producto:', error)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel de Administracion</h1>
            <p className="text-sm text-gray-500">Gestiona los productos de tu tienda</p>
          </div>
          <button onClick={openCreateModal} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors cursor-pointer">
            <Plus size={20} />
            Agregar Producto
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">Inventario ({productos.length} productos)</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <Loader2 size={24} className="animate-spin mr-2" />
              Cargando productos...
            </div>
          ) : productos.length === 0 ? (
            <div className="text-center py-16">
              <Package size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No hay productos registrados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                          <button onClick={() => openEditModal(producto)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" title="Editar">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => handleDelete(producto.id, producto.imagen_url)} disabled={deletingId === producto.id} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50" title="Eliminar">
                            {deletingId === producto.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{editId ? 'Editar Producto' : 'Agregar Producto'}</h3>
                <button onClick={closeModal} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripcion</label>
                  <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <input type="text" value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio (S/)</label>
                    <input type="number" step="0.01" min="0" value={precio} onChange={(e) => setPrecio(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tallas</label>
                    <input type="text" value={tallas} onChange={(e) => setTallas(e.target.value)} placeholder="S, M, L, XL" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Colores</label>
                    <input type="text" value={colores} onChange={(e) => setColores(e.target.value)} placeholder="Rojo, Negro" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors">
                    {imagenPreview ? (
                      <div className="relative w-full h-full">
                        <img src={imagenPreview} alt="Preview" className="w-full h-full object-contain p-2" />
                        <button type="button" onClick={(e) => { e.stopPropagation(); setImagen(null); setImagenPreview(null) }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5">
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Seleccionar imagen</span>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={submitting} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-white transition-colors cursor-pointer disabled:opacity-50 ${editId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                    {submitting && <Loader2 size={18} className="animate-spin" />}
                    {editId ? 'Actualizar Producto' : 'Crear Producto'}
                  </button>
                  <button type="button" onClick={closeModal} className="px-6 py-2.5 rounded-lg font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer">
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
