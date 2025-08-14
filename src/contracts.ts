export const SCARCOIN_ADDRESS = import.meta.env.VITE_SCARCOIN as `0x${string}`;
export const ORACLE_ADDRESS   = import.meta.env.VITE_ORACLE as `0x${string}`;

export const SCARCOIN_ABI = [
  { "type":"function","name":"publicMint","stateMutability":"nonpayable","inputs":[{"name":"amount","type":"uint256"}],"outputs":[] },
  { "type":"function","name":"burn","stateMutability":"nonpayable","inputs":[{"name":"amount","type":"uint256"}],"outputs":[] },
  { "type":"function","name":"balanceOf","stateMutability":"view","inputs":[{"name":"account","type":"address"}],"outputs":[{"type":"uint256"}] },
  { "type":"function","name":"symbol","stateMutability":"view","inputs":[],"outputs":[{"type":"string"}] }
];

export const ORACLE_ABI = [
  { "type":"function","name":"getIndex","stateMutability":"view","inputs":[],"outputs":[{"type":"uint256"}] }
];

export const MINT_THRESHOLD = 500_000n; // 0.500000 in 6-decimals
export const AMOY_EXPLORER  = "https://amoy.polygonscan.com/tx/";
