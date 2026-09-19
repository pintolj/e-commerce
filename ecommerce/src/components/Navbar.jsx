import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { ShoppingCart, LogOut, LogIn, Menu, X, User } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { getCartCount } = useCart()
  const navigate = useNavigate()
  const count = getCartCount()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    setMenuOpen(false)
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 min-w-0">
          <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 flex-shrink-0" />
          <span className="text-base sm:text-xl font-extrabold text-gray-900 truncate">DON REGALON</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {user && (
            <Link to="/admin" className="hidden sm:flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium">
              <User className="w-4 h-4" />
              Admin
            </Link>
          )}

          <Link to="/cart" className="relative flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-50">
            <ShoppingCart className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 right-0.5 bg-red-500 text-white text-[10px] font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center px-1">
                {count > 99 ? '99+' : count}
              </span>
            )}
            <span className="text-sm font-medium hidden md:inline">Carrito</span>
          </Link>

          {user ? (
            <button onClick={handleLogout} className="hidden sm:flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium cursor-pointer">
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          ) : (
            <Link to="/login" className="hidden sm:flex items-center gap-1 text-white bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-lg text-sm font-medium">
              <LogIn className="w-4 h-4" />
              Iniciar Sesion
            </Link>
          )}

          <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white shadow-lg">
          <div className="px-4 py-3 space-y-1">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block py-3 px-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg">Inicio</Link>
            <Link to="/cart" onClick={() => setMenuOpen(false)} className="block py-3 px-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg">Carrito ({count})</Link>
            {user && <Link to="/admin" onClick={() => setMenuOpen(false)} className="block py-3 px-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg">Admin</Link>}
            {user ? (
              <button onClick={handleLogout} className="block w-full text-left py-3 px-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg cursor-pointer">Cerrar Sesion</button>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-3 px-3 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg">Iniciar Sesion</Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
