import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          &copy; 2026 MiTienda. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}
