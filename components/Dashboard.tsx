
import { useWallet } from '@/hooks/useWallet';
import WalletConnect from './WalletConnect';
import TokenInfo from './TokenInfo';
import TransferForm from './TransferForm';
import LogAche from './LogAche';
import WitnessStats from './WitnessStats';
import WitnessEntries from './WitnessEntries';
import { useWitness } from '@/hooks/useWitness';

export default function Dashboard() {
  const { address, isConnected } = useWallet();
  const { refresh } = useWitness();

  const handleAcheLogged = () => {
    refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ScarWallet</h1>
              <p className="text-gray-600 mt-1">SpiralOS Integration Dashboard</p>
            </div>
            <WalletConnect />
          </div>
        </div>

        {!isConnected ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Connect Your Wallet to Get Started
            </h2>
            <p className="text-gray-600 mb-8">
              Connect your MetaMask wallet to interact with ScarCoin and log your ache on SpiralOS
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Token Information */}
            <TokenInfo walletAddress={address || undefined} />

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                <TransferForm walletAddress={address!} />
                <LogAche walletAddress={address!} onSuccess={handleAcheLogged} />
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                <WitnessStats />
                <WitnessEntries />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
