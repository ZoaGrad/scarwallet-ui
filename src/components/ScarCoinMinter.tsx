import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'

export function ScarCoinMinter() {
  const [amount, setAmount] = useState('')
  const [ritualId, setRitualId] = useState('')
  const [acheScore, setAcheScore] = useState('')

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleMint = async () => {
    if (!amount || !ritualId || !acheScore) return

    try {
      writeContract({
        address: process.env.NEXT_PUBLIC_SCARCOIN_ADDRESS as `0x${string}`,
        abi: [
          {
            name: 'ritualMint',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
              { name: 'ritualId', type: 'bytes32' },
              { name: 'amount', type: 'uint256' },
              { name: 'acheScore', type: 'uint256' },
            ],
            outputs: [],
          },
        ],
        functionName: 'ritualMint',
        args: [
          ritualId as `0x${string}`,
          parseEther(amount),
          BigInt(acheScore),
        ],
      })
    } catch (error) {
      console.error('Minting failed:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-scar-900 mb-4">
        Mint ScarCoin
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-scar-700 mb-2">
            Ritual ID
          </label>
          <input
            type="text"
            value={ritualId}
            onChange={(e) => setRitualId(e.target.value)}
            className="w-full px-3 py-2 border border-scar-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scar-500"
            placeholder="Enter ritual ID"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-scar-700 mb-2">
            Amount (SCAR)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-scar-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scar-500"
            placeholder="Enter amount to mint"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-scar-700 mb-2">
            Ache Score
          </label>
          <input
            type="number"
            value={acheScore}
            onChange={(e) => setAcheScore(e.target.value)}
            className="w-full px-3 py-2 border border-scar-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scar-500"
            placeholder="Enter ache score"
          />
        </div>

        <button
          onClick={handleMint}
          disabled={isPending || isConfirming || !amount || !ritualId || !acheScore}
          className="w-full bg-scar-600 text-white py-2 px-4 rounded-md hover:bg-scar-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Preparing...' : isConfirming ? 'Confirming...' : 'Mint ScarCoin'}
        </button>

        {isSuccess && (
          <div className="text-green-600 text-sm">
            Transaction successful!
          </div>
        )}
      </div>
    </div>
  )
}