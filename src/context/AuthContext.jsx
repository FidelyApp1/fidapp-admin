
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('fidapp_admin_token'))
  const [admin, setAdmin] = useState(JSON.parse(localStorage.getItem('fidapp_admin') || 'null'))

  const loginAdmin = (token, admin) => {
    localStorage.setItem('fidapp_admin_token', token)
    localStorage.setItem('fidapp_admin', JSON.stringify(admin))
    setToken(token)
    setAdmin(admin)
  }

  const logout = () => {
    localStorage.removeItem('fidapp_admin_token')
    localStorage.removeItem('fidapp_admin')
    setToken(null)
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ token, admin, loginAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)