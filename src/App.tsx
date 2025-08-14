import { useAccount, useConnect, useReadContract, useWriteContract, useBalance } from "wagmi";
import { SCARCOIN_ADDRESS, ORACLE_ADDRESS, SCARCOIN_ABI, ORACLE_ABI, MINT_THRESHOLD, AMOY_EXPLORER } from "./contracts";

export default function App() {
  const { connect, connectors } = useConnect();
  const { address } = useAccount();
  const { data: idxRaw } = useReadContract({ address: ORACLE_ADDRESS, abi: ORACLE_ABI, functionName: "getIndex" });
  const { data: bal } = useBalance({ address, token: SCARCOIN_ADDRESS, query: { enabled: !!address }});
  const { writeContractAsync, isPending } = useWriteContract();

  const index = typeof idxRaw === "bigint" ? idxRaw : 0n;
  const indexFloat = Number(index) / 1_000_000;

  const canMint = index >= MINT_THRESHOLD && !!address;

  async function tx(fn: "publicMint" | "burn", amt: bigint) {
    const hash = await writeContractAsync({
      address: SCARCOIN_ADDRESS,
      abi: SCARCOIN_ABI,
      functionName: fn,
      args: [amt]
    });
    alert(`Tx sent: ${hash}\nOpening Polygonscan…`);
    window.open(`${AMOY_EXPLORER}${hash}`, "_blank");
  }

  return (
    <div style={{maxWidth: 720, margin: "40px auto", padding: 24}}>
      <h1>ScarWallet (Amoy)</h1>

      {!address ? (
        <button onClick={() => connect({ connector: connectors[0] })}>Connect Wallet</button>
      ) : (
        <div>Connected: {address}</div>
      )}

      <p>ScarIndex: <b>{indexFloat.toFixed(6)}</b> {index < MINT_THRESHOLD ? " (below mint threshold)" : " (mint enabled)"}</p>
      <p>Your SCAR balance: <b>{bal ? Number(bal.value) / 1e18 : 0}</b></p>

      <div style={{display:"flex", gap:12}}>
        <button disabled={!canMint || isPending} onClick={()=>tx("publicMint", 10n * 10n**18n)}>Mint 10 SCAR</button>
        <button disabled={!address || isPending} onClick={()=>tx("burn", 5n * 10n**18n)}>Burn 5 SCAR</button>
      </div>
    </div>
  );
}
