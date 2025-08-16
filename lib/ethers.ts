
import { ethers } from 'ethers';

export const getProvider = () => {
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
  if (!rpcUrl) {
    throw new Error('RPC URL not configured');
  }
  return new ethers.JsonRpcProvider(rpcUrl);
};

export const getSigner = async () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask not available');
  }
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  return await provider.getSigner();
};

export const connectWallet = async () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask not available');
  }
  
  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    
    // Switch to Polygon Amoy if needed
    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
    if (chainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${parseInt(chainId).toString(16)}` }],
        });
      } catch (switchError: any) {
        // Chain not added, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${parseInt(chainId).toString(16)}`,
              chainName: process.env.NEXT_PUBLIC_NETWORK_NAME || 'Polygon Amoy',
              nativeCurrency: {
                name: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'MATIC',
                symbol: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'MATIC',
                decimals: 18,
              },
              rpcUrls: [process.env.NEXT_PUBLIC_RPC_URL || ''],
              blockExplorerUrls: [process.env.NEXT_PUBLIC_BLOCK_EXPLORER || ''],
            }],
          });
        }
      }
    }
    
    return { address, signer };
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    throw error;
  }
};

export const signMessage = async (message: string) => {
  const signer = await getSigner();
  return await signer.signMessage(message);
};

export const verifySignature = (message: string, signature: string, address: string): boolean => {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
};
