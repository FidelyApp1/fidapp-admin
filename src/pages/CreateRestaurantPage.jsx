import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRestaurant } from '../api/client'

const CreateRestaurantPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', address: '', checksRequired: 10
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      setError('Nom, email et mot de passe sont obligatoires')
      return
    }
    setLoading(true)
    setError('')
    try {
      await createRestaurant({ ...form, checksRequired: parseInt(form.checksRequired) })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur création')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-white transition-colors">
          ← Retour
        </button>
        <h2 className="text-xl font-bold text-white">Nouveau restaurant</h2>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nom du restaurant *</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Casa Burger"
            className="w-full mt-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email *</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="contact@resto.ma"
            className="w-full mt-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Mot de passe *</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••"
            className="w-full mt-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Téléphone</label>
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="0600000000"
            className="w-full mt-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Adresse</label>
          <input name="address" value={form.address} onChange={handleChange} placeholder="Casablanca, Maarif"
            className="w-full mt-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Check-ins requis pour reward
          </label>
          <select name="checksRequired" value={form.checksRequired} onChange={handleChange}
            className="w-full mt-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-orange-500">
            <option value={5}>5 visites</option>
            <option value={8}>8 visites</option>
            <option value={10}>10 visites</option>
            <option value={15}>15 visites</option>
            <option value={20}>20 visites</option>
          </select>
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <button onClick={handleSubmit} disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-800 text-white font-semibold py-3 rounded-xl transition-all mt-2">
          {loading ? 'Création...' : 'Créer le restaurant →'}
        </button>
      </div>
    </div>
  )
}

export default CreateRestaurantPage