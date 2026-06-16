import { useQuery } from '@tanstack/react-query'
import { getGlobalStats } from '../api/client'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const StatCard = ({ icon, label, value, sub, color }) => (
  <div className={`${color} rounded-2xl p-5`}>
    <div className="text-2xl mb-3">{icon}</div>
    <p className="text-3xl font-bold text-white">{value ?? '—'}</p>
    <p className="text-sm text-gray-300 mt-1">{label}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
)

const OverviewPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['global-stats'],
    queryFn: getGlobalStats,
    refetchInterval: 30000
  })

  const chartData = data?.dailyData
    ? Object.entries(data.dailyData).map(([date, count]) => ({
        day: new Date(date).toLocaleDateString('fr-FR', { weekday: 'short' }),
        checkins: count
      }))
    : []

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="🍽️" label="Restaurants" value={isLoading ? '...' : data?.totalRestaurants} sub={`${data?.activeRestaurants ?? 0} actifs · ${data?.suspendedRestaurants ?? 0} suspendus`} color="bg-gradient-to-br from-orange-600 to-orange-500" />
        <StatCard icon="👥" label="Clients inscrits" value={isLoading ? '...' : data?.totalClients} sub={`+${data?.newClientsThisMonth ?? 0} ce mois`} color="bg-gradient-to-br from-blue-700 to-blue-600" />
        <StatCard icon="✅" label="Check-ins total" value={isLoading ? '...' : data?.totalCheckins} sub={`${data?.checkinsThisMonth ?? 0} ce mois`} color="bg-gradient-to-br from-green-700 to-green-600" />
        <StatCard icon="🎁" label="Rewards émis" value={isLoading ? '...' : data?.totalRewards} sub="Repas gratuits offerts" color="bg-gradient-to-br from-purple-700 to-purple-600" />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-semibold text-white">Activité globale — 7 derniers jours</h2>
            <p className="text-xs text-gray-500 mt-0.5">Check-ins sur toute la plateforme</p>
          </div>
          <span className="bg-orange-500/20 text-orange-400 text-xs font-semibold px-3 py-1 rounded-full">Live</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '12px', fontSize: '12px', color: '#fff' }} formatter={(v) => [`${v} check-ins`, '']} />
            <Area type="monotone" dataKey="checkins" stroke="#f97316" strokeWidth={2} fill="url(#grad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="font-semibold text-white mb-1">Restaurants actifs</h3>
          <p className="text-4xl font-bold text-green-400">{data?.activeRestaurants ?? '—'}</p>
          <div className="mt-3 bg-gray-800 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${data?.totalRestaurants ? (data.activeRestaurants / data.totalRestaurants) * 100 : 0}%` }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">{data?.totalRestaurants ?? 0} total</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="font-semibold text-white mb-1">Taux de conversion</h3>
          <p className="text-4xl font-bold text-orange-400">
            {data?.totalClients && data?.totalCheckins
              ? Math.round(data.totalCheckins / data.totalClients * 10) / 10
              : '—'}
          </p>
          <p className="text-xs text-gray-500 mt-3">check-ins par client en moyenne</p>
        </div>
      </div>
    </div>
  )
}

export default OverviewPage