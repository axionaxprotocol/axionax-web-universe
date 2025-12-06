/**
 * API Routes for Axionax Testnet Indexer
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

import { 
  startIndexer, 
  stopIndexer, 
  getIndexerStats,
  getTopAddresses 
} from '../services/indexer.js';
import { 
  calculateActivityScore, 
  calculateAllActivityScores,
  getEligibleAddresses,
  getAirdropStats 
} from '../services/calculator.js';
import {
  generateSnapshot,
  generateGenesisConfig,
  finalizeSnapshot,
  getSnapshot,
  getLatestSnapshot,
  getAllSnapshots,
  verifyProof,
} from '../services/snapshot.js';

// Note: Node service will be imported when fully implemented
// import { ... } from '../services/nodes.js';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://axionax.org'],
  credentials: true,
}));

// ============================================
// Health & Status Routes
// ============================================

app.get('/', (c) => {
  return c.json({
    name: 'Axionax Testnet Indexer API',
    version: '0.1.0',
    status: 'running',
    endpoints: {
      health: '/health',
      indexer: '/api/indexer/*',
      activity: '/api/activity/*',
      snapshot: '/api/snapshot/*',
    },
  });
});

app.get('/health', async (c) => {
  const stats = await getIndexerStats();
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    indexer: stats,
  });
});

// ============================================
// Indexer Routes
// ============================================

const indexerRouter = new Hono();

indexerRouter.get('/status', async (c) => {
  const stats = await getIndexerStats();
  return c.json(stats);
});

indexerRouter.post('/start', async (c) => {
  // Start indexer in background
  startIndexer().catch(console.error);
  return c.json({ message: 'Indexer starting...' });
});

indexerRouter.post('/stop', async (c) => {
  await stopIndexer();
  return c.json({ message: 'Indexer stopped' });
});

indexerRouter.get('/addresses', async (c) => {
  const limit = parseInt(c.req.query('limit') || '100');
  const addresses = await getTopAddresses(limit);
  return c.json({ addresses });
});

app.route('/api/indexer', indexerRouter);

// ============================================
// Activity Routes
// ============================================

const activityRouter = new Hono();

// Schema for address validation
const addressSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
});

activityRouter.get('/score/:address', zValidator('param', addressSchema), async (c) => {
  const { address } = c.req.valid('param');
  const result = await calculateActivityScore(address);
  return c.json({
    address,
    ...result,
    airdropAmount: result.airdropAmount.toString(),
  });
});

activityRouter.post('/calculate-all', async (c) => {
  // Run calculation in background
  calculateAllActivityScores().catch(console.error);
  return c.json({ message: 'Activity calculation started...' });
});

activityRouter.get('/eligible', async (c) => {
  const tier = c.req.query('tier') ? parseInt(c.req.query('tier')!) : undefined;
  const eligible = await getEligibleAddresses(tier);
  return c.json({ 
    count: eligible.length,
    addresses: eligible 
  });
});

activityRouter.get('/stats', async (c) => {
  const stats = await getAirdropStats();
  return c.json(stats);
});

app.route('/api/activity', activityRouter);

// ============================================
// Snapshot Routes
// ============================================

const snapshotRouter = new Hono();

snapshotRouter.get('/', async (c) => {
  const snapshots = await getAllSnapshots();
  return c.json({ snapshots });
});

snapshotRouter.get('/latest', async (c) => {
  const snapshot = await getLatestSnapshot();
  if (!snapshot) {
    return c.json({ error: 'No snapshots found' }, 404);
  }
  return c.json(snapshot);
});

snapshotRouter.get('/:id', async (c) => {
  const id = c.req.param('id');
  const snapshot = await getSnapshot(id);
  if (!snapshot) {
    return c.json({ error: 'Snapshot not found' }, 404);
  }
  return c.json(snapshot);
});

snapshotRouter.post('/generate', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const blockNumber = body.blockNumber ? parseInt(body.blockNumber) : undefined;
  
  try {
    const snapshot = await generateSnapshot(blockNumber);
    return c.json(snapshot);
  } catch (error) {
    return c.json({ 
      error: 'Failed to generate snapshot',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

snapshotRouter.get('/:id/genesis', async (c) => {
  const id = c.req.param('id');
  
  try {
    const genesis = await generateGenesisConfig(id);
    return c.json(genesis);
  } catch (error) {
    return c.json({ 
      error: 'Failed to generate genesis config',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

snapshotRouter.post('/:id/finalize', async (c) => {
  const id = c.req.param('id');
  
  try {
    await finalizeSnapshot(id);
    return c.json({ message: 'Snapshot finalized', id });
  } catch (error) {
    return c.json({ 
      error: 'Failed to finalize snapshot',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Verify proof endpoint
const verifySchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  amount: z.string(),
  proof: z.array(z.string()),
  root: z.string(),
});

snapshotRouter.post('/verify', zValidator('json', verifySchema), async (c) => {
  const { address, amount, proof, root } = c.req.valid('json');
  const isValid = verifyProof(address, amount, proof, root);
  return c.json({ valid: isValid });
});

app.route('/api/snapshot', snapshotRouter);

// ============================================
// Node Registration Routes
// ============================================

const nodeRouter = new Hono();

// Node type validation schema
const nodeRegistrationSchema = z.object({
  nodeType: z.enum(['validator', 'worker', 'rpc']),
  nodeName: z.string().min(1).max(100),
  operatorName: z.string().min(1).max(100),
  email: z.string().email(),
  website: z.string().url().optional(),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  serverIp: z.string().ip(),
  rpcPort: z.number().int().min(1).max(65535).optional(),
  p2pPort: z.number().int().min(1).max(65535).optional(),
  location: z.string().optional(),
});

// Register a new node
nodeRouter.post('/register', zValidator('json', nodeRegistrationSchema), async (c) => {
  const data = c.req.valid('json');
  
  // TODO: Implement actual registration
  // For now, return mock success
  const nodeId = `node_${Date.now()}`;
  
  return c.json({
    success: true,
    message: 'Node registered successfully. Please check your email for verification.',
    nodeId,
    data: {
      ...data,
      status: 'pending',
      registeredAt: new Date().toISOString(),
    },
  });
});

// Verify email
nodeRouter.get('/verify/:token', async (c) => {
  const token = c.req.param('token');
  
  // TODO: Implement actual verification
  return c.json({
    success: true,
    message: 'Email verified successfully',
  });
});

// Get all nodes
nodeRouter.get('/', async (c) => {
  const nodeType = c.req.query('type') as 'validator' | 'worker' | 'rpc' | undefined;
  const status = c.req.query('status');
  
  // TODO: Implement actual query
  // Return mock data for now
  return c.json({
    nodes: [],
    total: 0,
    filters: { nodeType, status },
  });
});

// Get node by ID
nodeRouter.get('/:id', async (c) => {
  const id = c.req.param('id');
  
  // TODO: Implement actual query
  return c.json({
    node: null,
    error: 'Node not found',
  }, 404);
});

// Get node health
nodeRouter.get('/:id/health', async (c) => {
  const id = c.req.param('id');
  const limit = parseInt(c.req.query('limit') || '100');
  
  // TODO: Implement actual query
  return c.json({
    nodeId: id,
    healthChecks: [],
    uptime24h: 0,
  });
});

// Get node rewards
nodeRouter.get('/:id/rewards', async (c) => {
  const id = c.req.param('id');
  const limit = parseInt(c.req.query('limit') || '50');
  
  // TODO: Implement actual query
  return c.json({
    nodeId: id,
    rewards: [],
    totalRewards: '0',
  });
});

// Get node statistics
nodeRouter.get('/stats/overview', async (c) => {
  // TODO: Implement actual stats
  return c.json({
    total: 2,
    byType: { validator: 2, worker: 0, rpc: 0 },
    byStatus: { pending: 0, active: 2, inactive: 0, suspended: 0, slashed: 0 },
    totalStaked: '20000000000000000000000', // 20,000 AXX
  });
});

// Get leaderboard
nodeRouter.get('/leaderboard/:type', async (c) => {
  const nodeType = c.req.param('type') as 'validator' | 'worker' | 'rpc';
  const limit = parseInt(c.req.query('limit') || '20');
  
  // Validate node type
  if (!['validator', 'worker', 'rpc'].includes(nodeType)) {
    return c.json({ error: 'Invalid node type' }, 400);
  }
  
  // TODO: Implement actual leaderboard
  return c.json({
    nodeType,
    leaderboard: [],
  });
});

// Update node stake (called after staking tx confirmed)
nodeRouter.post('/:id/stake', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json().catch(() => ({}));
  
  // TODO: Verify stake transaction on-chain
  return c.json({
    success: true,
    message: 'Stake recorded',
    nodeId: id,
    stakeAmount: body.amount,
    txHash: body.txHash,
  });
});

app.route('/api/nodes', nodeRouter);

// ============================================
// Faucet Routes
// ============================================

const faucetRouter = new Hono();

// Faucet wallet address (will be configured via env)
const FAUCET_ADDRESS = process.env.FAUCET_ADDRESS || '0x0000000000000000000000000000000000000000';
const FAUCET_AMOUNT = '100'; // 100 AXX per request
const COOLDOWN_HOURS = 24;

// Get faucet balance and info
faucetRouter.get('/balance', async (c) => {
  // TODO: Fetch real balance from blockchain
  return c.json({
    address: FAUCET_ADDRESS,
    balance: '1000000', // Mock balance - 1M AXX
    symbol: 'AXX',
  });
});

// Request tokens from faucet
faucetRouter.post('/faucet', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { address } = body;
  
  // Validate address
  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return c.json({
      success: false,
      message: 'Invalid wallet address',
    }, 400);
  }
  
  // TODO: Check cooldown from database
  // TODO: Send actual transaction using FAUCET_PRIVATE_KEY
  
  // For now, return mock success
  const mockTxHash = `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  
  return c.json({
    success: true,
    message: `Successfully sent ${FAUCET_AMOUNT} AXX to ${address}`,
    txHash: mockTxHash,
    amount: FAUCET_AMOUNT,
    blockNumber: 12345,
  });
});

// Get faucet claim history for an address
faucetRouter.get('/history/:address', async (c) => {
  const address = c.req.param('address');
  
  // TODO: Fetch from database
  return c.json({
    address,
    claims: [],
    totalClaimed: '0',
  });
});

app.route('/api/faucet', faucetRouter);

// Also mount at root for faucet.axionax.org compatibility
app.get('/balance', async (c) => {
  return c.json({
    address: FAUCET_ADDRESS,
    balance: '1000000',
    symbol: 'AXX',
  });
});

app.post('/faucet', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { address } = body;
  
  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return c.json({
      success: false,
      message: 'Invalid wallet address',
    }, 400);
  }
  
  const mockTxHash = `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  
  return c.json({
    success: true,
    message: `Successfully sent ${FAUCET_AMOUNT} AXX to ${address}`,
    txHash: mockTxHash,
    amount: FAUCET_AMOUNT,
    blockNumber: 12345,
  });
});

// ============================================
// Error Handler
// ============================================

app.onError((err, c) => {
  console.error('API Error:', err);
  return c.json({
    error: 'Internal Server Error',
    message: err.message,
  }, 500);
});

app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

export default app;
