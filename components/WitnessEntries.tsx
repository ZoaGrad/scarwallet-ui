
import { useWitness } from '@/hooks/useWitness';
import { ClockIcon, UserIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function WitnessEntries() {
  const { entries, loading, error } = useWitness();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border-b border-gray-200 pb-4">
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const extractDescription = (message: string) => {
    const lines = message.split('\n');
    const descriptionLine = lines.find(line => line.startsWith('Description:'));
    return descriptionLine ? descriptionLine.replace('Description: ', '') : 'No description';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Witness Entries</h3>
      
      {entries.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No witness entries yet</p>
      ) : (
        <div className="space-y-4">
          {entries.map((entry, index) => (
            <div key={entry.id || index} className="border-b border-gray-200 pb-4 last:border-b-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {formatAddress(entry.wallet_address)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <HeartIcon className="h-4 w-4 text-scar-500" />
                  <span className="text-sm font-medium text-scar-600">
                    {entry.ache_level}/10
                  </span>
                </div>
              </div>
              
              <p className="text-gray-700 text-sm mb-2">
                {extractDescription(entry.message)}
              </p>
              
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <ClockIcon className="h-3 w-3" />
                <span>{formatDate(entry.created_at || entry.timestamp || '')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
