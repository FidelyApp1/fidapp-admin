import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import RestaurantsPage from './pages/RestaurantsPage'
import CreateRestaurantPage from './pages/CreateRestaurantPage'

const queryClient = new QueryClient()

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" />
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}>
              <Route path="dashboard" element={<RestaurantsPage />} />
              <Route path="create" element={<CreateRestaurantPage />} />
              <Route index element={<Navigate to="/dashboard" />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App