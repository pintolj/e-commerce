import { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Menu, X, LayoutDashboard, Store } from 'lucide-react'

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <header className="bg-gray-800 shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <span className="text-lg sm:text-xl font-bold text-white">Admin Panel</span>

          <div className="hidden sm:flex items-center gap-4">
            <Link to="/admin" className="flex items-center gap-1.5 text-gray-300 hover:text-white text-sm font-medium transition-colors px-3 py-2 rounded-lg hover:bg-gray-700">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link to="/" className="flex items-center gap-1.5 text-gray-300 hover:text-white text-sm font-medium transition-colors px-3 py-2 rounded-lg hover:bg-gray-700">
              <Store className="w-4 h-4" />
              Volver a la tienda
            </Link>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {menuOpen && (
          <div className="sm:hidden border-t border-gray-700 bg-gray-800 px-4 py-3 space-y-1">
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-3 px-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-3 px-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg">
              <Store className="w-4 h-4" />
              Volver a la tienda
            </Link>
          </div>
        )}
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
