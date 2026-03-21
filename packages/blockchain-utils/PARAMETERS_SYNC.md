# Parameter sync with axionax-core-universe

Chain IDs, staking, and chain/node parameters in this package are kept in sync with **axionax-core-universe**.

**Source of truth:**  
https://github.com/axionaxprotocol/axionax-core-universe

| Source in core-universe                                                                                            | Used in this package                     |
| ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| `core/.env.example` — `CHAIN_ID=86137` (testnet), `86150` (mainnet)                                                | `CHAIN_IDS.TESTNET`, `CHAIN_IDS.MAINNET` |
| `core/DEPLOYMENT_GUIDE.md` — `chain_id = 86137`, `min_validator_stake = "10000000000000000000000"` (10,000 tokens) | `STAKING_CONSTANTS.MIN_VALIDATOR_STAKE`  |
| `core/DEPLOYMENT_GUIDE.md` — `[consensus] sample_size = 1000`, `min_confidence = 0.999`                            | `POPC_PARAMS`                            |
| `core/DEPLOYMENT_GUIDE.md` — `block_time_secs = 5`, `gas_limit = 30000000`, RPC port 8545                          | `CHAIN_PARAMS`                           |

When updating constants, check the latest values in core-universe and adjust this package so backend and frontend stay aligned.
