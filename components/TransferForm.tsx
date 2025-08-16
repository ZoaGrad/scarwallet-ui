
import { useState } from 'react';
import { useScarCoin } from '@/hooks/useScarCoin';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface TransferFormProps {
  walletAddress: string;
}

export default function TransferForm({ walletAddress }: TransferFormProps) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { tokenInfo, balance, transfer } = useScarCoin(walletAddress);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipient || !amount) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    if (parseFloat(amount) <= 0) {
      setMessage({ type: 'error', text: 'Amount must be greater than 0' });
      return;
    }

    if (parseFloat(amount) > parseFloat(balance)) {
      setMessage({ type: 'error', text: 'Insufficient balance' });
      return;
    }

    try {
      setIsTransferring(true);
      setMessage(null);
      
      const tx = await transfer(recipient, amount);
      setMessage({ 
        type: 'success', 
        text: `Transfer successful! Transaction: ${tx.hash}` 
      });
      
      // Reset form
      setRecipient('');
      setAmount('');
    } catch (error) {
      console.error('Transfer failed:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Transfer failed' 
      });
    } finally {
      setIsTransferring(false);
    }
  };

  if (!tokenInfo) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <p className="text-gray-600">Loading token information...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <PaperAirplaneIcon className="h-6 w-6 mr-2 text-scar-600" />
        Transfer {tokenInfo.symbol}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">
            Recipient Address
          </label>
          <input
            type="text"
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scar-500 focus:border-transparent"
            disabled={isTransferring}
          />
        </div>
        
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <div className="relative">
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              step="any"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scar-500 focus:border-transparent pr-16"
              disabled={isTransferring}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">{tokenInfo.symbol}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Available: {parseFloat(balance).toLocaleString()} {tokenInfo.symbol}
          </p>
        </div>
        
        <button
          type="submit"
          disabled={isTransferring || !recipient || !amount}
          className="w-full bg-scar-600 hover:bg-scar-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          {isTransferring ? 'Transferring...' : 'Transfer'}
        </button>
      </form>
      
      {message && (
        <div className={`mt-4 p-3 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          <p className="text-sm">{message.text}</p>
        </div>
      )}
    </div>
  );
}
