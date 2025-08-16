import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useBalance } from 'wagmi'
import { ScarCoinMinter } from '@/components/ScarCoinMinter'
import { ScarIndexReader } from '@/components/ScarIndexReader'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({
    address,
    token: process.env.NEXT_PUBLIC_SCARCOIN_ADDRESS as `0x${string}`,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-scar-50 to-scar-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-scar-900 mb-4">
            ScarWallet
          </h1>
          <p className="text-scar-700 text-lg">
            Minimal ScarWallet for ScarCoin on Polygon Amoy
          </p>
        </header>

        <div className="max-w-2xl mx-auto space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-scar-900 mb-4">
              Connect Wallet
            </h2>
            <ConnectButton />
          </div>

          {isConnected && (
            <>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-scar-900 mb-4">
                  Balance
                </h2>
                <p className="text-scar-700">
                  {balance ? `${balance.formatted} ${balance.symbol}` : '0 SCAR'}
                </p>
              </div>

              <ScarIndexReader />
              <ScarCoinMinter />
            </>
          )}
        </div>
      </div>
    </div>
  )
}