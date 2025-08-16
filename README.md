# scarwallet-ui
Minimal ScarWallet for ScarCoin on Polygon Amoy — connect, read ScarIndex, mint, burn.

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
```

Copy the environment variables:

```bash
cp .env.local.example .env.local
```

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy Secrets

For deployment on Vercel, configure the following environment variables:

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------||
| `CHAIN_ID` | Amoy testnet chain ID | `80002` |
| `RPC_URL` | Amoy RPC endpoint | `https://rpc-amoy.polygon.technology` |
| `NETWORK_NAME` | Network display name | `Amoy` |
| `CURRENCY_SYMBOL` | Native currency symbol | `MATIC` |
| `BLOCK_EXPLORER` | Block explorer URL | `https://amoy.polygonscan.com` |
| `SCARCOIN_CONTRACT` | ScarCoin contract address | `0x...` |
| `SCARWALLET_CONTRACT` | ScarWallet contract address | `0x...` |

### Optional Environment Variables

| Variable | Description |
|----------|-------------|
| `ANALYTICS_ID` | Analytics tracking ID |
| `SENTRY_DSN` | Sentry error tracking DSN |

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure the environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
npm run start
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking