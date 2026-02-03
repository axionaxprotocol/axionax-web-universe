# Testing Guide – Axionax Web

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm test:e2e` | Run Playwright E2E tests (starts dev server automatically) |
| `pnpm test:e2e:ui` | Run E2E with Playwright UI |
| `pnpm test:e2e:headed` | Run E2E with visible browser |

From repo root:

- `pnpm test` – Unit tests (SDK, blockchain-utils, api, genesis-generator)
- `pnpm test:e2e` – E2E for `apps/web` only

## Prerequisites for E2E

1. **Chromium** (used by default):  
   `npx playwright install chromium` (done once per machine)
2. **Dev server**: Started automatically by Playwright unless `CI` is set.

## API Routes Used by the App

These routes were added so the site works without external services:

| Route | Purpose |
|-------|--------|
| `GET /api/stats` | Network stats (block number, validators) – uses EU/AU RPC or mock |
| `GET /api/blocks?page=1&pageSize=10` | Block list for Explorer – uses RPC or empty list |
| `GET /api/faucet/balance` | Faucet wallet balance – uses faucet-api or mock |
| `POST /api/faucet/faucet` | Request testnet tokens – proxies to faucet-api or mock success |
| `GET /api/faucet` | Faucet status (for E2E) |
| `POST /api/faucet` | Same as POST /api/faucet/faucet (E2E) |

When validators (RPC) or faucet-api are unreachable, responses fall back to mock/empty data so the UI still loads.

## E2E Test Results

- **API tests**: Most pass. Some may fail if validators are down (e.g. blocks list empty) or if rate limiting differs.
- **UI tests**: Some fail because they were written for different copy or routes:
  - No `/send` page – transaction flow tests skip or fail.
  - Nav link text (e.g. “About”, “Docs”) may not match.
  - Faucet copy: “10,000 AXXt” vs E2E expectation “10 AXX per request”.
  - Wallet connect button/modal selectors may not match current UI.

To run only API E2E:  
`pnpm test:e2e -- tests/e2e/api.spec.ts`

To run only Explorer E2E:  
`pnpm test:e2e -- tests/e2e/explorer.spec.ts`

To run only Faucet E2E:  
`pnpm test:e2e -- tests/e2e/faucet.spec.ts`

## Unit Tests

- `packages/sdk`: `pnpm --filter @axionax/sdk test`
- `packages/blockchain-utils`: `pnpm --filter @axionax/blockchain-utils test`
- `apps/api`: `pnpm --filter @axionax/api test`
- `apps/genesis-generator`: `pnpm --filter @axionax/genesis-generator test`

All via root: `pnpm test`.
