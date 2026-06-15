import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getRestaurants, deleteRestaurant, updateRestaurant } from '../api/client'
import { useNavigate } from 'react-router-dom'

const RestaurantsPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['restaurants'],
    queryFn: getRestaurants
  })

  const deleteMutation = useMutation({
    mutationFn: deleteRestaurant,
    onSuccess: () => queryClient.invalidateQueries(['restaurants'])
  })

  const suspendMutation = useMutation({
    mutationFn: ({ id, suspended }) => updateRestaurant(id, { suspended }),
    onSuccess: () => queryClient.invalidateQueries(['restaurants'])
  })

  const filtered = data?.restaurants?.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = (id, name) => {
    if (confirm(`Supprimer "${name}" ? Cette action est irréversible.`)) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Restaurants</h2>
        <button
          onClick={() => navigate('/create')}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-xl text-sm transition-all"
        >
          + Nouveau restaurant
        </button>
      </div>

      <div className="mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un restaurant..."
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Chargement...</div>
      ) : (
        <div className="space-y-3">
          {filtered?.map((resto) => (
            <div key={resto.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🍽️</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white">{resto.name}</p>
                      {resto.suspended && (
                        <span className="bg-red-900 text-red-400 text-xs px-2 py-0.5 rounded-full">Suspendu</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{resto.email}</p>
                    <p className="text-xs text-gray-600 mt-1">{resto.address} • {resto.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right mr-3">
                    <p className="text-xs text-gray-500">Clients</p>
                    <p className="text-white font-semibold">{resto._count.loyaltyCards}</p>
                  </div>
                  {/* 📊 Bouton Détails */}
                  <button
                    onClick={() => navigate(`/restaurant/${resto.id}`)}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all"
                  >
                    Détails
                  </button>
                  {/* ⏸️ Bouton Suspendre / Réactiver */}
                  <button
                    onClick={() => suspendMutation.mutate({ id: resto.id, suspended: !resto.suspended })}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                      resto.suspended
                        ? 'bg-green-900 text-green-400 hover:bg-green-800'
                        : 'bg-yellow-900 text-yellow-400 hover:bg-yellow-800'
                    }`}
                  >
                    {resto.suspended ? 'Réactiver' : 'Suspendre'}
                  </button>
                  {/* 🗑️ Bouton Supprimer */}
                  <button
                    onClick={() => handleDelete(resto.id, resto.name)}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium bg-red-900 text-red-400 hover:bg-red-800 transition-all"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RestaurantsPage