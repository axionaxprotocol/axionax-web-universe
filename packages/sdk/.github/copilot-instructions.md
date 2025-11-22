# Axionax SDK - Copilot Instructions
# Target Model: GPT-5.1 (Instant)

**Context:** Universal TypeScript SDK for Axionax Protocol.

## 🛠️ LIBRARY ARCHITECTURE
1.  **Universal Runtime:**
    - Code MUST work in Node.js (v20+), Bun, and Modern Browsers.
    - Avoid Node-specifics like `Buffer` (use `Uint8Array`) or `process.env`.

2.  **Strict Typing:**
    - `noImplicitAny`: true.
    - Export strictly typed interfaces for all request/response objects.
    - Use `zod` for runtime validation of user inputs.

3.  **Crypto:**
    - Use `viem` or `ethers` v6 patterns for signing/hashing.
    - Do not roll your own crypto.

4.  **Documentation:**
    - Generate JSDoc for every exported function.
    - Include `@example` usage in comments.
