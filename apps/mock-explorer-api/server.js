const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;
const RPC_URL = process.env.RPC_URL || 'http://rpc-node:8545';

app.use(cors());

// Helper to query RPC
async function queryRpc(method, params = []) {
  try {
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method,
        params
      })
    });
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error(`RPC Query Error (${method}):`, error.message);
    return null;
  }
}

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Stats API (matches Statistics.tsx expectations)
// Endpoint can be /api/stats (if routed with prefix) or /stats (if routed without)
// We'll support both to be safe.
const statsHandler = async (req, res) => {
  const blockNumberHex = await queryRpc('eth_blockNumber');
  const blockNumber = blockNumberHex ? parseInt(blockNumberHex, 16) : 0;

  res.json({
    blockNumber,
    services: {
      healthy: 9
    },
    uptime: {
      hours: 48 + Math.floor(process.uptime() / 3600)
    },
    deployment: 100,
    validators: {
      online: 2
    }
  });
};

app.get('/stats', statsHandler);
app.get('/api/stats', statsHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[MockExplorerAPI] Running on port ${PORT}`);
  console.log(`[MockExplorerAPI] Connected to RPC: ${RPC_URL}`);
});
