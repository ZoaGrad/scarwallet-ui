# Changelog

## [0.2.0] - 2025-08-14
### Refactor
- **ui:** Simplify ScarWallet `App` component and transaction flow
  - Use `useBalance` for cleaner SCAR balance display
  - Consolidate contract write logic into a single transaction helper
  - Add direct Polygonscan link for submitted transactions
  - Extract config constants (`MINT_THRESHOLD`, explorer URL) for easier tuning
  - Reduce ABI definitions to essential fragments only
  - Disable mint action when `ScarIndex` is below threshold
