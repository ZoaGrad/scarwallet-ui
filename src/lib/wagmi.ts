import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { polygonAmoy } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'ScarWallet',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
  chains: [polygonAmoy],
  ssr: true,
})