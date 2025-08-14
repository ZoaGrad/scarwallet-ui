# ScarWallet UI

Minimal ScarWallet for ScarCoin on Polygon Amoy — connect, read ScarIndex, mint, burn.

This is a minimal, auditable, and easy-to-deploy dApp for interacting with the ScarCoin and ScarIndexOracle contracts on the Polygon Amoy testnet.

## Quick Start

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/scarwallet-ui.git
    cd scarwallet-ui
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    -   Copy the `.env.example` file to a new file named `.env`.
    -   ```bash
        cp .env.example .env
        ```
    -   Update the `.env` file with your contract addresses.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173`.

## Configuration

### Contract Addresses

After deploying your contracts, you need to add their addresses to the `.env` file.

```
VITE_RPC_URL=https://rpc-amoy.polygon.technology
VITE_SCARCOIN=0x...
VITE_ORACLE=0x...
```

### Contract ABIs

The placeholder ABIs are located in `src/contracts.ts`. If you need to update them, you can paste the new ABIs directly into this file. The ABIs can be found in the `scarcoin-contracts` repository or from the block explorer after contract verification.

## Deployment

This application is a standard Vite-based Single Page Application (SPA) and can be deployed to any static hosting service like Vercel or Netlify.

### Vercel

When deploying to Vercel, no special configuration is needed. Vercel will automatically detect that this is a Vite project and configure the build settings and rewrite rules for an SPA. Just connect your repository and deploy.
