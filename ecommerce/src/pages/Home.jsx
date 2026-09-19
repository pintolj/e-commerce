import { useState, useEffect, useMemo } from 'react'
import { ShoppingCart, Loader2, Search, X, Eye } from 'lucide-react'
import { obtenerProductos } from '../services/productService'
import { useCart } from '../context/CartContext'
import { buscarProductos } from '../utils/searchUtils'

function parseOptions(text) {
  if (!text) return []
  return text.split(',').map((s) => s.trim()).filter(Boolean)
}

function formatCurrency(value) {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value)
}

function ProductModal({ producto, onClose, onAdd }) {
  const tallas = parseOptions(producto.tallas)
  const colores = parseOptions(producto.colores)
  const [talla, setTalla] = useState(tallas[0] || '')
  const [color, setColor] = useState(colores[0] || '')
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    onAdd(producto, talla, color)
    setAdded(true)
    setTimeout(onClose, 1200)
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          {producto.imagen_url ? (
            <img src={producto.imagen_url} alt={producto.nombre} className="w-full aspect-square object-cover sm:rounded-t-2xl" />
          ) : (
            <div className="w-full aspect-square bg-gray-100 sm:rounded-t-2xl flex items-center justify-center text-gray-400">Sin imagen</div>
          )}
          <button onClick={onClose} className="absolute top-3 right-3 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 sm:p-6">
          {producto.categoria && <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full mb-2">{producto.categoria}</span>}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{producto.nombre}</h2>
          <p className="text-xl sm:text-2xl font-bold text-blue-600 mb-4">{formatCurrency(producto.precio)}</p>
          {producto.descripcion && <p className="text-gray-600 text-sm mb-6 leading-relaxed">{producto.descripcion}</p>}

          {tallas.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Talla</label>
              <select value={talla} onChange={(e) => setTalla(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-[44px]">
                {tallas.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          )}

          {colores.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <select value={color} onChange={(e) => setColor(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-[44px]">
                {colores.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}

          <button onClick={handleAdd} disabled={added} className={`w-full flex items-center justify-center gap-2 text-white font-semibold py-3.5 px-4 rounded-xl transition-colors cursor-pointer min-h-[48px] ${added ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'}`}>
            <ShoppingCart className="w-5 h-5" />
            {added ? 'Agregado al carrito' : 'Anadir al carrito'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas')
  const [productoModal, setProductoModal] = useState(null)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await obtenerProductos()
        setProductos(data)
      } catch (err) {
        setError(err.message || 'Error al cargar productos.')
      } finally {
        setLoading(false)
      }
    }
    fetchProductos()
  }, [])

  const categorias = useMemo(() => {
    const cats = [...new Set(productos.map((p) => p.categoria).filter(Boolean))]
    return ['Todas', ...cats]
  }, [productos])

  const productosFiltrados = useMemo(() => {
    const resultadosBusqueda = buscarProductos(productos, busqueda)
    return resultadosBusqueda.filter((producto) => {
      return categoriaSeleccionada === 'Todas' || producto.categoria === categoriaSeleccionada
    })
  }, [productos, busqueda, categoriaSeleccionada])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-10 h-10 text-blue-600 animate-spin" /></div>
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4"><div className="text-center"><h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2><p className="text-gray-600">{error}</p></div></div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {productos.length > 0 && (
          <div className="mb-6 sm:mb-10 bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl overflow-hidden relative min-h-[160px] sm:min-h-[240px] flex items-center">
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800" alt="Tienda" className="absolute inset-0 w-full h-full object-cover opacity-30" />
            <div className="relative z-10 p-5 sm:p-8 lg:p-12">
              <span className="text-blue-400 text-xs sm:text-sm font-semibold uppercase tracking-wider">Bienvenido</span>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-1 sm:mt-2 mb-2 sm:mb-3">Descubre Nuestros Productos</h2>
              <p className="text-gray-300 text-xs sm:text-sm max-w-md">Explora nuestra coleccion y encuentra lo que buscas.</p>
            </div>
          </div>
        )}

        <div className="mb-6 sm:mb-8 flex flex-col gap-3 sm:gap-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar productos..." className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm shadow-sm min-h-[44px]" />
            {busqueda && (
              <button onClick={() => setBusqueda('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto w-full pb-1 -mx-1 px-1 scrollbar-hide">
            {categorias.map((cat) => (
              <button key={cat} onClick={() => setCategoriaSeleccionada(cat)} className={`px-4 py-2.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer flex-shrink-0 min-h-[40px] ${categoriaSeleccionada === cat ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400 hover:text-blue-600'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {productos.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 text-base sm:text-lg">No hay productos disponibles aun.</p>
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <Search className="w-12 h-12 sm:w-16 sm:h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 text-base sm:text-lg mb-2">No se encontraron productos</p>
            <button onClick={() => { setBusqueda(''); setCategoriaSeleccionada('Todas') }} className="text-blue-600 hover:text-blue-800 font-medium text-sm cursor-pointer min-h-[44px] px-4">Limpiar filtros</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">Productos ({productosFiltrados.length})</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {productosFiltrados.map((producto) => (
                <div key={producto.id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col border border-gray-100">
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    {producto.imagen_url ? (
                      <img src={producto.imagen_url} alt={producto.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ShoppingCart className="w-8 h-8 sm:w-12 sm:h-12" />
                      </div>
                    )}
                  </div>
                  <div className="p-3 sm:p-4 flex flex-col flex-1">
                    {producto.categoria && <span className="text-[10px] sm:text-[11px] font-medium text-gray-400 uppercase tracking-wide">{producto.categoria}</span>}
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mt-1 mb-2 line-clamp-2 leading-snug">{producto.nombre}</h3>
                    <div className="mt-auto">
                      <p className="text-sm sm:text-lg font-bold text-blue-600 mb-2 sm:mb-3">{formatCurrency(producto.precio)}</p>
                      <button onClick={() => setProductoModal(producto)} className="w-full flex items-center justify-center gap-1.5 sm:gap-2 bg-gray-900 hover:bg-blue-600 text-white text-xs sm:text-sm font-medium py-2 sm:py-2.5 rounded-lg transition-colors cursor-pointer min-h-[36px] sm:min-h-[40px]">
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {productoModal && <ProductModal producto={productoModal} onClose={() => setProductoModal(null)} onAdd={(p, t, c) => addToCart(p, t, c)} />}
    </div>
  )
}
