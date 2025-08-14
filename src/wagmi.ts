import { http, createConfig } from "wagmi";
import { polygonAmoy } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const config = createConfig({
  chains: [polygonAmoy],
  connectors: [injected()],
  transports: { [polygonAmoy.id]: http(import.meta.env.VITE_RPC_URL) }
});
