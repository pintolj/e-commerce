import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, MessageCircle } from 'lucide-react'

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount)
}

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()

  const total = getCartTotal()

  const whatsappMessage = cart
    .map(
      (item) =>
        `- ${item.cantidad}x ${item.nombre} (Talla: ${item.talla || 'N/A'}, Color: ${item.color || 'N/A'}) - ${formatCurrency(item.precio * item.cantidad)}`
    )
    .join('%0A')

  const whatsappUrl = `https://wa.me/04245510357/?text=Hola, quiero hacer el siguiente pedido:%0A%0A${whatsappMessage}%0A%0ATotal: ${formatCurrency(total)}`

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">Tu carrito esta vacio</h2>
          <p className="text-gray-500 text-sm sm:text-base mb-6">Agrega productos para comenzar tu compra</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Mi Carrito</h1>
          <Link to="/" className="text-indigo-600 hover:text-indigo-800 text-xs sm:text-sm font-medium">
            Seguir comprando
          </Link>
        </div>

        <div className="space-y-3 sm:space-y-4 mb-6">
          {cart.map((item) => (
            <div
              key={item.variantKey}
              className="bg-white rounded-lg shadow-sm p-3 sm:p-4 flex gap-3 sm:gap-4 items-start"
            >
              {item.imagen_url ? (
                <img
                  src={item.imagen_url}
                  alt={item.nombre}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-400 text-[10px] sm:text-xs">
                  Sin img
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{item.nombre}</h3>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1">
                  {item.talla && (
                    <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 px-1.5 sm:px-2 py-0.5 rounded">
                      Talla: {item.talla}
                    </span>
                  )}
                  {item.color && (
                    <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 px-1.5 sm:px-2 py-0.5 rounded">
                      Color: {item.color}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">{formatCurrency(item.precio)} c/u</p>

                <div className="flex items-center justify-between mt-2 sm:mt-3 gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={() => updateQuantity(item.variantKey, item.cantidad - 1)}
                      className="w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition cursor-pointer min-w-[32px] min-h-[32px]"
                    >
                      <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <span className="w-6 sm:w-8 text-center font-medium text-sm">{item.cantidad}</span>
                    <button
                      onClick={() => updateQuantity(item.variantKey, item.cantidad + 1)}
                      className="w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition cursor-pointer min-w-[32px] min-h-[32px]"
                    >
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="font-bold text-gray-800 text-sm sm:text-base">
                      {formatCurrency(item.precio * item.cantidad)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.variantKey)}
                      className="text-red-400 hover:text-red-600 transition p-1 cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 text-sm sm:text-base">Total</span>
            <span className="text-xl sm:text-2xl font-bold text-gray-800">{formatCurrency(total)}</span>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition min-h-[48px] text-sm sm:text-base"
            >
              <MessageCircle className="w-5 h-5" />
              Pedir por WhatsApp
            </a>
            <button
              onClick={clearCart}
              className="text-red-500 text-sm hover:text-red-700 transition py-2 min-h-[44px] cursor-pointer"
            >
              Vaciar carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
