const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ethers } = require('ethers');

const app = express();
const PORT = process.env.PORT || 3002;

// Validator RPC endpoints (load balanced)
const RPC_ENDPOINTS = [
  'http://217.76.61.116:8545',  // Validator EU
  'http://46.250.244.4:8545',   // Validator AU
];

// Faucet wallet private key (should be set via environment variable in production)
const FAUCET_PRIVATE_KEY = process.env.FAUCET_PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const FAUCET_AMOUNT = process.env.FAUCET_AMOUNT || '100'; // 100 AXX

app.use(cors());
app.use(bodyParser.json());

// In-memory store for rate limiting (reset on restart)
const requestHistory = new Map();
const RATE_LIMIT_MS = 24 * 60 * 60 * 1000; // 24 hours

// Create provider with fallback
let currentRpcIndex = 0;
function getProvider() {
  const provider = new ethers.JsonRpcProvider(RPC_ENDPOINTS[currentRpcIndex]);
  return provider;
}

function switchRpc() {
  currentRpcIndex = (currentRpcIndex + 1) % RPC_ENDPOINTS.length;
  console.log(`[Faucet] Switched to RPC: ${RPC_ENDPOINTS[currentRpcIndex]}`);
}

// Helper to validate address format
const isValidAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

app.get('/', (req, res) => {
  res.send('Axionax Faucet API is running - Connected to real validators');
});

app.get('/health', async (req, res) => {
  try {
    const provider = getProvider();
    const blockNumber = await provider.getBlockNumber();
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      rpcEndpoint: RPC_ENDPOINTS[currentRpcIndex],
      blockNumber: blockNumber,
      chainId: 86137
    });
  } catch (error) {
    switchRpc();
    res.json({ 
      status: 'degraded', 
      timestamp: new Date().toISOString(),
      error: error.message 
    });
  }
});

// Get faucet balance
app.get('/balance', async (req, res) => {
  try {
    const provider = getProvider();
    const wallet = new ethers.Wallet(FAUCET_PRIVATE_KEY, provider);
    const balance = await provider.getBalance(wallet.address);
    res.json({
      address: wallet.address,
      balance: ethers.formatEther(balance),
      symbol: 'AXX'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get faucet balance' });
  }
});

// Get network info
app.get('/info', async (req, res) => {
  try {
    const provider = getProvider();
    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();
    res.json({
      chainId: Number(network.chainId),
      blockNumber: blockNumber,
      faucetAmount: FAUCET_AMOUNT,
      rateLimitHours: 24,
      validators: RPC_ENDPOINTS.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get network info' });
  }
});

app.post('/faucet', async (req, res) => {
  const { address } = req.body;

  if (!address || !isValidAddress(address)) {
    return res.status(400).json({ error: 'Invalid wallet address' });
  }

  // Check rate limit
  const lastRequest = requestHistory.get(address.toLowerCase());
  const now = Date.now();

  if (lastRequest && (now - lastRequest) < RATE_LIMIT_MS) {
    const hoursLeft = Math.ceil((RATE_LIMIT_MS - (now - lastRequest)) / (1000 * 60 * 60));
    return res.status(429).json({ 
      error: `Rate limit exceeded. Please try again in ${hoursLeft} hours.` 
    });
  }

  try {
    const provider = getProvider();
    const wallet = new ethers.Wallet(FAUCET_PRIVATE_KEY, provider);
    
    // Send real transaction
    const tx = await wallet.sendTransaction({
      to: address,
      value: ethers.parseEther(FAUCET_AMOUNT),
    });

    console.log(`[Faucet] Sending ${FAUCET_AMOUNT} AXX to ${address}`);
    console.log(`[Faucet] Transaction hash: ${tx.hash}`);

    // Wait for confirmation
    const receipt = await tx.wait(1);

    // Update rate limit after successful transaction
    requestHistory.set(address.toLowerCase(), now);

    console.log(`[Faucet] Confirmed in block ${receipt.blockNumber}`);

    res.json({
      success: true,
      message: `${FAUCET_AMOUNT} AXX sent successfully`,
      txHash: tx.hash,
      amount: FAUCET_AMOUNT,
      blockNumber: receipt.blockNumber,
      from: wallet.address
    });
  } catch (error) {
    console.error(`[Faucet] Error: ${error.message}`);
    
    // Try switching RPC on error
    switchRpc();
    
    res.status(500).json({ 
      error: 'Transaction failed. Please try again.',
      details: error.message
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Faucet] Server running on port ${PORT}`);
  console.log(`[Faucet] Connected to validators: ${RPC_ENDPOINTS.join(', ')}`);
  console.log(`[Faucet] Faucet amount: ${FAUCET_AMOUNT} AXX`);
});
