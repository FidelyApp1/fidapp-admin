import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '../api/client'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { loginAdmin } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await adminLogin(email, password)
      loginAdmin(data.token, data.admin)
      navigate('/dashboard')
    } catch {
      setError('Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🛡️</span>
          </div>
          <h1 className="text-2xl font-bold text-white">FidApp Admin</h1>
          <p className="text-gray-500 mt-1 text-sm">Accès restreint</p>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
          <div className="mb-4">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@fidapp.ma"
              className="w-full mt-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          <div className="mb-6">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full mt-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-800 text-white font-semibold py-3 rounded-xl transition-all"
          >
            {loading ? 'Connexion...' : 'Accéder au panel →'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage