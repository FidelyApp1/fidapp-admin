import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { updateAdminPassword } from '../api/client'

const SettingsPage = () => {
  const { admin } = useAuth()
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (form.newPassword !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    if (form.newPassword.length < 8) {
      setError('Minimum 8 caractères')
      return
    }
    setLoading(true)
    setError('')
    try {
      await updateAdminPassword(form.currentPassword, form.newPassword)
      setSuccess('Mot de passe mis à jour !')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Paramètres admin</h2>
        <p className="text-xs text-gray-500 mt-0.5">Gérez votre compte administrateur</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="font-semibold text-white mb-4">Informations du compte</h3>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-2xl">🛡️</div>
          <div>
            <p className="text-white font-medium">{admin?.email}</p>
            <p className="text-gray-500 text-xs">Super Administrateur FidApp</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="font-semibold text-white mb-4">Changer mon mot de passe</h3>
        <div className="space-y-3">
          {[
            { key: 'currentPassword', placeholder: 'Mot de passe actuel' },
            { key: 'newPassword', placeholder: 'Nouveau mot de passe' },
            { key: 'confirmPassword', placeholder: 'Confirmer le nouveau mot de passe' },
          ].map(f => (
            <input key={f.key} type="password" placeholder={f.placeholder}
              value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500" />
          ))}
        </div>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        {success && <p className="text-green-400 text-sm mt-3">✅ {success}</p>}
        <button onClick={handleSubmit} disabled={loading}
          className="mt-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-800 text-white font-semibold px-6 py-3 rounded-xl transition-all w-full">
          {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="font-semibold text-white mb-3">Liens rapides</h3>
        <div className="space-y-2">
          {[
            { label: 'Client PWA', url: 'https://fidapp-client.vercel.app' },
            { label: 'Dashboard restaurant', url: 'https://fidapp-dashboard.vercel.app' },
            { label: 'Backend API', url: 'https://fidapp-backend-production.up.railway.app' },
          ].map(link => (
            <a key={link.url} href={link.url} target="_blank" rel="noreferrer"
              className="flex items-center justify-between px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors">
              <span className="text-gray-300 text-sm">{link.label}</span>
              <span className="text-gray-500 text-xs">{link.url.replace('https://', '')}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage