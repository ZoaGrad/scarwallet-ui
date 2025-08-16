
import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { WalletIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function WalletConnect() {
  const { address, isConnected, isConnecting, error, connect, disconnect } = useWallet();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-2 rounded-lg">
          <WalletIcon className="h-5 w-5" />
          <span className="font-medium">{formatAddress(address)}</span>
        </div>
        <button
          onClick={disconnect}
          className="flex items-center space-x-2 bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-lg transition-colors"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span>Disconnect</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        onClick={connect}
        disabled={isConnecting}
        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        <WalletIcon className="h-5 w-5" />
        <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
      </button>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
