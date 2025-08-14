import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { formatEther, parseEther } from 'viem';
import { scarCoinAddress, scarCoinAbi, oracleAddress, oracleAbi } from './contracts';

function App() {
  const account = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContractAsync, data: hash } = useWriteContract();

  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' | 'error' } | null>(null);

  const { data: scarIndex, isLoading: isIndexLoading } = useReadContract({
    address: oracleAddress,
    abi: oracleAbi,
    functionName: 'getIndex',
  });

  const { data: scarBalance, refetch: refetchScarBalance } = useReadContract({
    address: scarCoinAddress,
    abi: scarCoinAbi,
    functionName: 'balanceOf',
    args: [account.address!],
    query: {
      enabled: !!account.address,
    },
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirming) {
      setToast({ message: 'Transaction pending...', type: 'info' });
    } else if (isConfirmed) {
      setToast({ message: 'Transaction successful!', type: 'success' });
      refetchScarBalance();
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [isConfirming, isConfirmed, refetchScarBalance]);

  const handleMint = async () => {
    if (scarIndex === undefined || scarIndex < 500000n) {
      setToast({ message: 'Minting is disabled: Index is below threshold.', type: 'error' });
      setTimeout(() => setToast(null), 5000);
      return;
    }
    try {
      await writeContractAsync({
        address: scarCoinAddress,
        abi: scarCoinAbi,
        functionName: 'publicMint',
        args: [parseEther('10')],
      });
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setToast({ message: `Minting failed: ${errorMessage}`, type: 'error' });
      setTimeout(() => setToast(null), 5000);
    }
  };

  const handleBurn = async () => {
    try {
      await writeContractAsync({
        address: scarCoinAddress,
        abi: scarCoinAbi,
        functionName: 'burn',
        args: [parseEther('5')],
      });
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setToast({ message: `Burning failed: ${errorMessage}`, type: 'error' });
      setTimeout(() => setToast(null), 5000);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setToast({ message: 'Address copied!', type: 'success' });
      setTimeout(() => setToast(null), 3000);
    });
  };

  const mintDisabled = scarIndex === undefined || scarIndex < 500000n;

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>ScarWallet UI</h1>
      {toast && (
        <div style={{
          position: 'fixed', top: '1rem', right: '1rem', padding: '1rem',
          backgroundColor: toast.type === 'error' ? '#f8d7da' : toast.type === 'success' ? '#d4edda' : '#cce5ff',
          color: toast.type === 'error' ? '#721c24' : toast.type === 'success' ? '#155724' : '#004085',
          borderRadius: '5px', zIndex: 1000,
        }}>
          {toast.message}
        </div>
      )}

      {account.status === 'connected' ? (
        <div>
          <p>Connected: {account.address}</p>
          <button onClick={() => disconnect()}>Disconnect</button>
        </div>
      ) : (
        <button onClick={() => connect({ connector: injected() })}>Connect Wallet</button>
      )}

      <hr style={{ margin: '2rem 0' }} />

      <h2>Contract Info</h2>
      <p>
        ScarCoin: {scarCoinAddress}{' '}
        <button onClick={() => copyToClipboard(scarCoinAddress)}>Copy</button>{' '}
        <a href={`https://amoy.polygonscan.com/address/${scarCoinAddress}`} target="_blank" rel="noopener noreferrer">Scan</a>
      </p>
      <p>
        Oracle: {oracleAddress}{' '}
        <button onClick={() => copyToClipboard(oracleAddress)}>Copy</button>{' '}
        <a href={`https://amoy.polygonscan.com/address/${oracleAddress}`} target="_blank" rel="noopener noreferrer">Scan</a>
      </p>

      <hr style={{ margin: '2rem 0' }} />

      <h2>Oracle</h2>
      {isIndexLoading ? (
        <p>Loading ScarIndex...</p>
      ) : scarIndex !== undefined ? (
        <div>
          <p>Raw ScarIndex: {scarIndex.toString()}</p>
          <p>Float ScarIndex: {(Number(scarIndex) / 1e6).toFixed(6)}</p>
        </div>
      ) : (
        <p>Could not load ScarIndex.</p>
      )}

      {account.status === 'connected' && (
        <>
          <hr style={{ margin: '2rem 0' }} />
          <h2>Your Wallet</h2>
          <p>SCAR Balance: {scarBalance !== undefined ? formatEther(scarBalance) : 'Loading...'}</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={handleMint} disabled={mintDisabled || isConfirming}>
              {isConfirming ? 'Pending...' : 'Mint 10 SCAR'}
            </button>
            <button onClick={handleBurn} disabled={isConfirming}>
              {isConfirming ? 'Pending...' : 'Burn 5 SCAR'}
            </button>
          </div>
          {mintDisabled && <p style={{ color: 'red', marginTop: '0.5rem' }}>Minting is disabled: Index below 500,000.</p>}
        </>
      )}
    </div>
  );
}

export default App;
