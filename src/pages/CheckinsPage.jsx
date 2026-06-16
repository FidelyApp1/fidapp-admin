import { useQuery } from '@tanstack/react-query'
import { getAllCheckins } from '../api/client'

const CheckinsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['all-checkins'],
    queryFn: getAllCheckins,
    refetchInterval: 15000
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Check-ins globaux</h2>
          <p className="text-xs text-gray-500 mt-0.5">50 derniers check-ins sur toute la plateforme</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-400">Live — refresh 15s</span>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="divide-y divide-gray-800">
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Chargement...</div>
          ) : data?.checkins?.map((c) => (
            <div key={c.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-800 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <span>✅</span>
                </div>
                <div>
                  <p className="font-medium text-white">{c.loyaltyCard.user.phone}</p>
                  <p className="text-xs text-gray-500">
                    chez <span className="text-orange-400">{c.loyaltyCard.restaurant.name}</span> •
                    visite {c.loyaltyCard.checkCount}/{c.loyaltyCard.restaurant.checksRequired}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-300">{new Date(c.createdAt).toLocaleDateString('fr-FR')}</p>
                <p className="text-xs text-gray-600">{new Date(c.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CheckinsPage