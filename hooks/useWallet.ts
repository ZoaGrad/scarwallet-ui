
import { useState, useEffect } from 'react';
import { connectWallet } from '@/lib/ethers';

export const useWallet = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      const { address } = await connectWallet();
      setAddress(address);
      setIsConnected(true);
      localStorage.setItem('walletConnected', 'true');
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
    localStorage.removeItem('walletConnected');
  };

  const checkConnection = async () => {
    if (typeof window === 'undefined' || !window.ethereum) return;
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0 && localStorage.getItem('walletConnected')) {
        setAddress(accounts[0]);
        setIsConnected(true);
      }
    } catch (err) {
      console.error('Error checking wallet connection:', err);
    }
  };

  useEffect(() => {
    checkConnection();
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAddress(accounts[0]);
          setIsConnected(true);
        }
      });
      
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  return {
    address,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
  };
};
