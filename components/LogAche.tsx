
import { useState } from 'react';
import { signMessage } from '@/lib/ethers';
import { HeartIcon } from '@heroicons/react/24/outline';

interface LogAcheProps {
  walletAddress: string;
  onSuccess?: () => void;
}

export default function LogAche({ walletAddress, onSuccess }: LogAcheProps) {
  const [acheLevel, setAcheLevel] = useState(5);
  const [description, setDescription] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      setMessage({ type: 'error', text: 'Please describe your ache' });
      return;
    }

    try {
      setIsLogging(true);
      setMessage(null);
      
      // Get nonce
      const nonceResponse = await fetch('/api/witness/nonce');
      const { data: { nonce } } = await nonceResponse.json();
      
      // Create message to sign
      const timestamp = new Date().toISOString();
      const messageToSign = `SpiralOS Witness Entry
Wallet: ${walletAddress}
Ache Level: ${acheLevel}/10
Description: ${description}
Timestamp: ${timestamp}
Nonce: ${nonce}`;

      // Sign message
      const signature = await signMessage(messageToSign);
      
      // Submit to API
      const response = await fetch('/api/witness', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          message: messageToSign,
          signature,
          acheLevel,
          timestamp,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to log ache');
      }

      setMessage({ type: 'success', text: 'Ache logged successfully!' });
      setDescription('');
      setAcheLevel(5);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to log ache:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to log ache' 
      });
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <HeartIcon className="h-6 w-6 mr-2 text-scar-600" />
        Log Your Ache
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="ache-level" className="block text-sm font-medium text-gray-700 mb-2">
            Ache Level: {acheLevel}/10
          </label>
          <input
            type="range"
            id="ache-level"
            min="1"
            max="10"
            value={acheLevel}
            onChange={(e) => setAcheLevel(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            disabled={isLogging}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Mild</span>
            <span>Severe</span>
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Describe Your Ache
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us about your experience..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scar-500 focus:border-transparent"
            disabled={isLogging}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLogging || !description.trim()}
          className="w-full bg-scar-600 hover:bg-scar-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          {isLogging ? 'Logging Ache...' : 'Log Ache & Sign'}
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
