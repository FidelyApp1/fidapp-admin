import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getRestaurantStats } from '../api/client'

const RestaurantDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['restaurant-stats', id],
    queryFn: () => getRestaurantStats(id)
  })

  if (isLoading) return (
    <div className="text-center py-12 text-gray-500">Chargement...</div>
  )

  // Extraction des données incluant la liste des check-ins récents
  const { restaurant, totalCheckins, totalRewards, recentCheckins } = data

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-white transition-colors">
          ← Retour
        </button>
        <div>
          <h2 className="text-xl font-bold text-white">{restaurant.name}</h2>
          <p className="text-gray-500 text-sm">{restaurant.email}</p>
        </div>
        {restaurant.suspended && (
          <span className="bg-red-900 text-red-400 text-xs px-3 py-1 rounded-full">Suspendu</span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <p className="text-gray-500 text-sm mb-1">Clients inscrits</p>
          <p className="text-3xl font-bold text-white">{restaurant._count.loyaltyCards}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <p className="text-gray-500 text-sm mb-1">Check-ins total</p>
          <p className="text-3xl font-bold text-orange-400">{totalCheckins}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <p className="text-gray-500 text-sm mb-1">Rewards émis</p>
          <p className="text-3xl font-bold text-green-400">{totalRewards}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <p className="text-gray-500 text-sm mb-1">Check-ins requis</p>
          <p className="text-2xl font-bold text-white">{restaurant.checksRequired}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <p className="text-gray-500 text-sm mb-1">QR Codes générés</p>
          <p className="text-2xl font-bold text-white">{restaurant._count.qrCodes}</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="font-semibold text-white mb-4">Informations</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Adresse</span>
            <span className="text-gray-300 text-sm">{restaurant.address || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Téléphone</span>
            <span className="text-gray-300 text-sm">{restaurant.phone || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Inscrit le</span>
            <span className="text-gray-300 text-sm">
              {new Date(restaurant.createdAt).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>
      </div>

      {/* 🕐 Section : Check-ins récents */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mt-4">
        <h3 className="font-semibold text-white mb-4">Check-ins récents</h3>
        {recentCheckins?.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-6">Aucun check-in pour l'instant</p>
        ) : (
          <div className="space-y-3">
            {recentCheckins?.map((checkin) => (
              <div key={checkin.id} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-900/50 rounded-full flex items-center justify-center">
                    <span className="text-sm">👤</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{checkin.loyaltyCard.user.phone}</p>
                    <p className="text-xs text-gray-500">{checkin.loyaltyCard.checkCount}/{restaurant.checksRequired} visites</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(checkin.createdAt).toLocaleDateString('fr-FR')} {new Date(checkin.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RestaurantDetailPage