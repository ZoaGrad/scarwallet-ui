
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getProvider, getSigner } from '@/lib/ethers';
import ScarCoinABI from '@/contracts/ScarCoin.json';

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
}

export const useScarCoin = (walletAddress?: string) => {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contractAddress = process.env.NEXT_PUBLIC_SCARCOIN_CONTRACT;

  const getContract = async (withSigner = false) => {
    if (!contractAddress) {
      throw new Error('ScarCoin contract address not configured');
    }
    
    if (withSigner) {
      const signer = await getSigner();
      return new ethers.Contract(contractAddress, ScarCoinABI.abi, signer);
    } else {
      const provider = getProvider();
      return new ethers.Contract(contractAddress, ScarCoinABI.abi, provider);
    }
  };

  const fetchTokenInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const contract = await getContract();
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
        contract.totalSupply(),
      ]);

      setTokenInfo({
        name,
        symbol,
        decimals: Number(decimals),
        totalSupply: ethers.formatUnits(totalSupply, decimals),
      });
    } catch (err) {
      console.error('Error fetching token info:', err);
      setError('Failed to fetch token information');
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async (address: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const contract = await getContract();
      const balanceWei = await contract.balanceOf(address);
      const decimals = tokenInfo?.decimals || 18;
      setBalance(ethers.formatUnits(balanceWei, decimals));
    } catch (err) {
      console.error('Error fetching balance:', err);
      setError('Failed to fetch balance');
    } finally {
      setLoading(false);
    }
  };

  const transfer = async (to: string, amount: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const contract = await getContract(true);
      const decimals = tokenInfo?.decimals || 18;
      const amountWei = ethers.parseUnits(amount, decimals);
      
      const tx = await contract.transfer(to, amountWei);
      await tx.wait();
      
      // Refresh balance after transfer
      if (walletAddress) {
        await fetchBalance(walletAddress);
      }
      
      return tx;
    } catch (err) {
      console.error('Error transferring tokens:', err);
      setError('Failed to transfer tokens');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contractAddress) {
      fetchTokenInfo();
    }
  }, [contractAddress]);

  useEffect(() => {
    if (walletAddress && tokenInfo) {
      fetchBalance(walletAddress);
    }
  }, [walletAddress, tokenInfo]);

  return {
    tokenInfo,
    balance,
    loading,
    error,
    transfer,
    refetchBalance: () => walletAddress && fetchBalance(walletAddress),
    refetchTokenInfo: fetchTokenInfo,
  };
};
