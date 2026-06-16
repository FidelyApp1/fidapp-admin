import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAllClients } from '../api/client'

const ClientsPage = () => {
  const [search, setSearch] = useState('')
  const { data, isLoading } = useQuery({ queryKey: ['all-clients'], queryFn: getAllClients })

  const filtered = data?.clients?.filter(c => c.phone.includes(search))

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-white">Clients</h2>
        <p className="text-xs text-gray-500 mt-0.5">{data?.clients?.length ?? 0} clients inscrits sur la plateforme</p>
      </div>

      <input value={search} onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher par numéro..."
        className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500" />

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="divide-y divide-gray-800">
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Chargement...</div>
          ) : filtered?.map((client) => (
            <div key={client.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-800 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <span>👤</span>
                </div>
                <div>
                  <p className="font-medium text-white">{client.phone}</p>
                  <p className="text-xs text-gray-500">
                    {client._count.loyaltyCards} resto{client._count.loyaltyCards > 1 ? 's' : ''} • Inscrit le {new Date(client.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {client.loyaltyCards.slice(0, 3).map(card => (
                  <span key={card.id} className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded-lg">
                    {card.restaurant.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ClientsPage