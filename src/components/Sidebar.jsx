const navItems = [
  { id: 'overview', label: 'Vue globale', icon: '📊' },
  { id: 'restaurants', label: 'Restaurants', icon: '🍽️' },
  { id: 'clients', label: 'Clients', icon: '👥' },
  { id: 'checkins', label: 'Check-ins', icon: '✅' },
  { id: 'rewards', label: 'Rewards', icon: '🎁' },
  { id: 'settings', label: 'Paramètres', icon: '⚙️' },
]

const Sidebar = ({ activePage, setActivePage, admin, logout, sidebarOpen, setSidebarOpen }) => {
  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`w-64 bg-gray-950 border-r border-gray-800 flex flex-col fixed h-full z-30 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-xl">🛡️</span>
            </div>
            <div>
              <p className="font-bold text-white">FidApp</p>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-gray-800">
          <div className="bg-gray-900 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center text-xs">👤</div>
              <div>
                <p className="text-white text-xs font-medium">{admin?.email}</p>
                <p className="text-gray-500 text-xs">Super Admin</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActivePage(item.id); setSidebarOpen(false) }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
                activePage === item.id
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'text-gray-400 hover:bg-gray-900 hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 rounded-xl text-sm text-gray-500 hover:text-red-400 hover:bg-red-950 transition-all flex items-center gap-2"
          >
            <span>🚪</span> Déconnexion
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar