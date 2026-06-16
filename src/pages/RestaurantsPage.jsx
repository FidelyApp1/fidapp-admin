import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getRestaurants, deleteRestaurant, updateRestaurant, resetRestaurantPassword, createRestaurant } from '../api/client'

const RestaurantsPage = () => {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [resetId, setResetId] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', phone: '', address: '', checksRequired: 10 })
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState('')

  const { data, isLoading } = useQuery({ queryKey: ['restaurants'], queryFn: getRestaurants })

  const deleteMutation = useMutation({
    mutationFn: deleteRestaurant,
    onSuccess: () => queryClient.invalidateQueries(['restaurants'])
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateRestaurant(id, data),
    onSuccess: () => { queryClient.invalidateQueries(['restaurants']); setEditingId(null) }
  })

  const resetMutation = useMutation({
    mutationFn: ({ id, newPassword }) => resetRestaurantPassword(id, newPassword),
    onSuccess: () => { setResetId(null); setGeneratedPassword(newPassword); setNewPassword('') }
  })

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
    let pwd = ''
    for (let i = 0; i < 10; i++) pwd += chars[Math.floor(Math.random() * chars.length)]
    setNewPassword(pwd)
  }

  const handleCreate = async () => {
    if (!createForm.name || !createForm.email || !createForm.password) {
      setCreateError('Nom, email et mot de passe obligatoires')
      return
    }
    setCreateLoading(true)
    setCreateError('')
    try {
      await createRestaurant({ ...createForm, checksRequired: parseInt(createForm.checksRequired) })
      queryClient.invalidateQueries(['restaurants'])
      setShowCreate(false)
      setCreateForm({ name: '', email: '', password: '', phone: '', address: '', checksRequired: 10 })
    } catch (err) {
      setCreateError(err.response?.data?.error || 'Erreur création')
    } finally {
      setCreateLoading(false)
    }
  }

  const filtered = data?.restaurants?.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Restaurants</h2>
          <p className="text-xs text-gray-500 mt-0.5">{data?.restaurants?.length ?? 0} restaurants enregistrés</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all">
          + Nouveau restaurant
        </button>
      </div>

      {/* Mot de passe généré */}
      {generatedPassword && (
        <div className="bg-green-900 border border-green-700 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-green-400 text-sm font-semibold">Mot de passe réinitialisé !</p>
            <p className="text-white font-mono text-lg mt-1">{generatedPassword}</p>
            <p className="text-green-600 text-xs mt-1">Communiquez ce mot de passe au restaurant</p>
          </div>
          <button onClick={() => { navigator.clipboard.writeText(generatedPassword); }} className="bg-green-700 text-white px-3 py-1 rounded-lg text-xs">Copier</button>
        </div>
      )}

      {/* Création restaurant */}
      {showCreate && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-4">Nouveau restaurant</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'name', placeholder: 'Nom du restaurant *', type: 'text' },
              { name: 'email', placeholder: 'Email *', type: 'email' },
              { name: 'password', placeholder: 'Mot de passe *', type: 'text' },
              { name: 'phone', placeholder: 'Téléphone', type: 'text' },
              { name: 'address', placeholder: 'Adresse', type: 'text' },
            ].map(field => (
              <input
                key={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={createForm[field.name]}
                onChange={(e) => setCreateForm({ ...createForm, [field.name]: e.target.value })}
                className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-orange-500"
              />
            ))}
            <select
              value={createForm.checksRequired}
              onChange={(e) => setCreateForm({ ...createForm, checksRequired: e.target.value })}
              className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
            >
              {[5, 8, 10, 15, 20].map(n => <option key={n} value={n}>{n} visites pour reward</option>)}
            </select>
          </div>
          {createError && <p className="text-red-400 text-sm mt-3">{createError}</p>}
          <div className="flex gap-3 mt-4">
            <button onClick={handleCreate} disabled={createLoading} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-xl text-sm transition-all">
              {createLoading ? 'Création...' : 'Créer'}
            </button>
            <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-white px-4 py-2 rounded-xl text-sm transition-all">
              Annuler
            </button>
          </div>
        </div>
      )}

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher un restaurant..."
        className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500"
      />

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Chargement...</div>
      ) : (
        <div className="space-y-3">
          {filtered?.map((resto) => (
            <div key={resto.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">🍽️</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white">{resto.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${resto.suspended ? 'bg-red-900 text-red-400' : 'bg-green-900 text-green-400'}`}>
                          {resto.suspended ? 'Suspendu' : 'Actif'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{resto.email}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{resto.address} {resto.phone && `• ${resto.phone}`}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-white font-bold">{resto._count.loyaltyCards}</p>
                      <p className="text-xs text-gray-500">clients</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-bold">{resto.checksRequired}</p>
                      <p className="text-xs text-gray-500">visites/reward</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button onClick={() => { setEditingId(resto.id); setEditForm({ name: resto.name, email: resto.email, phone: resto.phone || '', address: resto.address || '', checksRequired: resto.checksRequired }) }}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium py-2 rounded-lg transition-all">
                    ✏️ Modifier
                  </button>
                  <button onClick={() => { setResetId(resto.id); generatePassword() }}
                    className="flex-1 bg-gray-800 hover:bg-blue-900 text-gray-300 hover:text-blue-400 text-xs font-medium py-2 rounded-lg transition-all">
                    🔑 Reset MDP
                  </button>
                  <button onClick={() => updateMutation.mutate({ id: resto.id, data: { suspended: !resto.suspended } })}
                    className={`flex-1 text-xs font-medium py-2 rounded-lg transition-all ${resto.suspended ? 'bg-green-900 text-green-400 hover:bg-green-800' : 'bg-yellow-900 text-yellow-400 hover:bg-yellow-800'}`}>
                    {resto.suspended ? '✅ Réactiver' : '⏸️ Suspendre'}
                  </button>
                  <button onClick={() => { if (confirm(`Supprimer "${resto.name}" ? Irréversible.`)) deleteMutation.mutate(resto.id) }}
                    className="flex-1 bg-red-950 hover:bg-red-900 text-red-400 text-xs font-medium py-2 rounded-lg transition-all">
                    🗑️ Supprimer
                  </button>
                </div>
              </div>

              {/* Edit form */}
              {editingId === resto.id && (
                <div className="border-t border-gray-800 p-5 bg-gray-950">
                  <p className="text-sm font-semibold text-white mb-3">Modifier le restaurant</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'name', placeholder: 'Nom' },
                      { key: 'email', placeholder: 'Email' },
                      { key: 'phone', placeholder: 'Téléphone' },
                      { key: 'address', placeholder: 'Adresse' },
                    ].map(f => (
                      <input key={f.key} value={editForm[f.key]} onChange={(e) => setEditForm({ ...editForm, [f.key]: e.target.value })}
                        placeholder={f.placeholder}
                        className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500" />
                    ))}
                    <select value={editForm.checksRequired} onChange={(e) => setEditForm({ ...editForm, checksRequired: parseInt(e.target.value) })}
                      className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500">
                      {[5, 8, 10, 15, 20].map(n => <option key={n} value={n}>{n} visites/reward</option>)}
                    </select>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => updateMutation.mutate({ id: resto.id, data: editForm })}
                      className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all">
                      Sauvegarder
                    </button>
                    <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-white text-sm px-4 py-2 rounded-lg transition-all">
                      Annuler
                    </button>
                  </div>
                </div>
              )}

              {/* Reset password form */}
              {resetId === resto.id && (
                <div className="border-t border-gray-800 p-5 bg-gray-950">
                  <p className="text-sm font-semibold text-white mb-3">Réinitialiser le mot de passe</p>
                  <div className="flex gap-2">
                    <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nouveau mot de passe"
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-orange-500" />
                    <button onClick={generatePassword} className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-2 rounded-lg">
                      🎲 Générer
                    </button>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => resetMutation.mutate({ id: resto.id, newPassword })}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all">
                      Confirmer le reset
                    </button>
                    <button onClick={() => setResetId(null)} className="text-gray-400 hover:text-white text-sm px-4 py-2 rounded-lg transition-all">
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RestaurantsPage