import { useAuth } from '../context/AuthContext'
import { useNavigate, Outlet } from 'react-router-dom'

const DashboardPage = () => {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span>🛡️</span>
            </div>
            <span className="font-bold text-white text-sm">FidApp Admin</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full text-left px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 text-sm transition-all"
          >
            🍽️ Restaurants
          </button>
          <button
            onClick={() => navigate('/create')}
            className="w-full text-left px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 text-sm transition-all"
          >
            + Nouveau resto
          </button>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <p className="text-xs text-gray-600 mb-2">{admin?.email}</p>
          <button onClick={logout} className="text-xs text-gray-500 hover:text-red-400 transition-colors">
            Déconnexion
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardPage