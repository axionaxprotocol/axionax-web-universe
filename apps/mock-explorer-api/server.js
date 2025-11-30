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

// Blocks API
const blocksHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    // Get latest block number
    const blockNumberHex = await queryRpc('eth_blockNumber');
    const latestBlockNumber = blockNumberHex ? parseInt(blockNumberHex, 16) : 0;

    const blocks = [];
    const startBlock = latestBlockNumber - (page - 1) * pageSize;

    // Fetch latest block details to get real timestamp/hash structure
    // We only fetch the *latest* real block to keep it fast, and simulate history
    // (In a real explorer, this would query a DB)
    const latestBlockData = await queryRpc('eth_getBlockByNumber', [blockNumberHex, false]);
    const latestTimestamp = latestBlockData ? parseInt(latestBlockData.timestamp, 16) : Date.now() / 1000;

    for (let i = 0; i < pageSize; i++) {
      const num = startBlock - i;
      if (num < 0) break;

      // Simulate block data based on real latest block
      // In production, you would fetch each block or use an indexer
      blocks.push({
        number: num,
        hash: i === 0 && latestBlockData ? latestBlockData.hash : `0x${Math.random().toString(16).substr(2, 64)}`, // Use real hash for latest
        timestamp: Math.floor(latestTimestamp * 1000) - (i * 3000), // Approx 3s block time
        transactions: Math.floor(Math.random() * 50),
        miner: '0x0000000000000000000000000000000000000000',
        gasUsed: '21000',
        gasLimit: '30000000'
      });
    }

    res.json({
      blocks,
      total: latestBlockNumber,
      page,
      pageSize
    });
  } catch (error) {
    console.error('Blocks API Error:', error);
    res.status(500).json({ error: 'Failed to fetch blocks' });
  }
};

app.get('/blocks', blocksHandler);
app.get('/api/blocks', blocksHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[MockExplorerAPI] Running on port ${PORT}`);
  console.log(`[MockExplorerAPI] Connected to RPC: ${RPC_URL}`);
});
