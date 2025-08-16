
import { useWitness } from '@/hooks/useWitness';
import { ChartBarIcon, UsersIcon, HeartIcon, TrophyIcon } from '@heroicons/react/24/outline';

export default function WitnessStats() {
  const { stats, loading, error } = useWitness();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  const statItems = [
    {
      label: 'Total Entries',
      value: stats.totalEntries.toLocaleString(),
      icon: ChartBarIcon,
      color: 'text-blue-600',
    },
    {
      label: 'Unique Wallets',
      value: stats.uniqueWallets.toLocaleString(),
      icon: UsersIcon,
      color: 'text-green-600',
    },
    {
      label: 'Average Ache',
      value: `${stats.averageAche}/10`,
      icon: HeartIcon,
      color: 'text-scar-600',
    },
    {
      label: 'Max Ache',
      value: `${stats.maxAche}/10`,
      icon: TrophyIcon,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Witness Statistics</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <div key={index} className="text-center">
            <div className="flex justify-center mb-2">
              <item.icon className={`h-8 w-8 ${item.color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            <p className="text-sm text-gray-500">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
