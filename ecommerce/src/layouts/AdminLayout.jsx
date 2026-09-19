import { Outlet } from 'react-router-dom'

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <header className="bg-gray-800 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-white">Admin Panel</span>
          <div className="flex gap-4">
            <a href="/admin" className="text-gray-300 hover:text-white">Dashboard</a>
            <a href="/" className="text-gray-300 hover:text-white">Volver a la tienda</a>
          </div>
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
