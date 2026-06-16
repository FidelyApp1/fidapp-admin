import { useQuery } from '@tanstack/react-query'
import { getAllRewards } from '../api/client'

const RewardsPage = () => {
  const { data, isLoading } = useQuery({ queryKey: ['all-rewards'], queryFn: getAllRewards })

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-white">Rewards émis</h2>
        <p className="text-xs text-gray-500 mt-0.5">{data?.rewards?.length ?? 0} rewards distribués sur la plateforme</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="divide-y divide-gray-800">
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Chargement...</div>
          ) : data?.rewards?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">🎁</p>
              <p className="text-gray-500">Aucun reward émis pour l'instant</p>
            </div>
          ) : data?.rewards?.map((r) => (
            <div key={r.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-800 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <span>🏆</span>
                </div>
                <div>
                  <p className="font-medium text-white">{r.loyaltyCard.user.phone}</p>
                  <p className="text-xs text-gray-500">
                    {r.description} • <span className="text-orange-400">{r.loyaltyCard.restaurant.name}</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${r.redeemedAt ? 'bg-green-900 text-green-400' : 'bg-yellow-900 text-yellow-400'}`}>
                  {r.redeemedAt ? 'Utilisé' : 'En attente'}
                </span>
                <p className="text-xs text-gray-600 mt-1">{new Date(r.createdAt).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RewardsPage