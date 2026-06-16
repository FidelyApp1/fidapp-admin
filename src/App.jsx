import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './context/AuthContext'
import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import Sidebar from './components/Sidebar'
import OverviewPage from './pages/OverviewPage'
import RestaurantsPage from './pages/RestaurantsPage'
import ClientsPage from './pages/ClientsPage'
import CheckinsPage from './pages/CheckinsPage'
import RewardsPage from './pages/RewardsPage'
import SettingsPage from './pages/SettingsPage'

const queryClient = new QueryClient()

const AdminLayout = () => {
  const { token, admin, logout } = useAuth()
  const [activePage, setActivePage] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!token) return <Navigate to="/login" />

  const pages = {
    overview: <OverviewPage />,
    restaurants: <RestaurantsPage />,
    clients: <ClientsPage />,
    checkins: <CheckinsPage />,
    rewards: <RewardsPage />,
    settings: <SettingsPage />,
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        admin={admin}
        logout={logout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <main className="flex-1 lg:ml-64">
        <div className="bg-gray-950 border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center text-white">
              ☰
            </button>
            <div>
              <h1 className="text-lg font-bold text-white capitalize">{activePage === 'overview' ? 'Vue globale' : activePage}</h1>
              <p className="text-xs text-gray-500">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500 hidden sm:block">Connecté</span>
          </div>
        </div>
        <div className="p-6">
          {pages[activePage]}
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*" element={<AdminLayout />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App