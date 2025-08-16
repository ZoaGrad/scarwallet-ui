
import { useScarCoin } from '@/hooks/useScarCoin';
import { CurrencyDollarIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface TokenInfoProps {
  walletAddress?: string;
}

export default function TokenInfo({ walletAddress }: TokenInfoProps) {
  const { tokenInfo, balance, loading, error, refetchTokenInfo, refetchBalance } = useScarCoin(walletAddress);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <p className="text-red-800">{error}</p>
          <button
            onClick={refetchTokenInfo}
            className="text-red-600 hover:text-red-800"
          >
            <ArrowPathIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  if (!tokenInfo) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <p className="text-gray-600">Token information not available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <CurrencyDollarIcon className="h-6 w-6 mr-2 text-scar-600" />
          {tokenInfo.name} ({tokenInfo.symbol})
        </h3>
        <button
          onClick={() => {
            refetchTokenInfo();
            if (walletAddress) refetchBalance();
          }}
          className="text-gray-400 hover:text-gray-600"
        >
          <ArrowPathIcon className="h-5 w-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Total Supply</p>
            <p className="text-lg font-medium text-gray-900">
              {parseFloat(tokenInfo.totalSupply).toLocaleString()} {tokenInfo.symbol}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Decimals</p>
            <p className="text-lg font-medium text-gray-900">{tokenInfo.decimals}</p>
          </div>
        </div>
        
        {walletAddress && (
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Your Balance</p>
              <p className="text-2xl font-bold text-scar-600">
                {parseFloat(balance).toLocaleString()} {tokenInfo.symbol}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
