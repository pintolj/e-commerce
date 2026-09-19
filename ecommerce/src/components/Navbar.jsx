import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { ShoppingCart, LogOut, LogIn, Menu, X } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { getCartCount } = useCart()
  const navigate = useNavigate()
  const count = getCartCount()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <ShoppingCart className="w-7 h-7 text-blue-600" />
          <span className="text-xl font-extrabold text-gray-900">DON REGALON</span>
        </Link>

        {/* Acciones derecha */}
        <div className="flex items-center gap-2">
          <Link to="/cart" className="relative flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
            <ShoppingCart className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 right-0.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {count > 99 ? '99+' : count}
              </span>
            )}
            <span className="text-sm font-medium hidden sm:inline">Carrito</span>
          </Link>

          
          

          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-100 px-4 py-4 space-y-2 bg-white">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-gray-700 hover:text-blue-600">Inicio</Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-gray-700 hover:text-blue-600">Carrito ({count})</Link>
          {!user && <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-blue-600 font-medium">Iniciar Sesion</Link>}
        </div>
      )}
    </header>
  )
}
