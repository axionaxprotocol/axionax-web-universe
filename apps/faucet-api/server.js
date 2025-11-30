const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(bodyParser.json());

// In-memory store for rate limiting (reset on restart)
// Key: address, Value: timestamp of last request
const requestHistory = new Map();
const RATE_LIMIT_MS = 24 * 60 * 60 * 1000; // 24 hours

// Helper to validate address format
const isValidAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

app.get('/', (req, res) => {
  res.send('Axionax Faucet API is running');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/faucet', (req, res) => {
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

  // Update rate limit
  requestHistory.set(address.toLowerCase(), now);

  // Generate a fake transaction hash
  const randomHex = Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
  const txHash = `0x${randomHex}`;

  console.log(`[Faucet] Sent 100 AXX to ${address} (Tx: ${txHash})`);

  res.json({
    success: true,
    message: '100 AXX sent successfully',
    txHash: txHash,
    amount: '100'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Faucet] Server running on port ${PORT}`);
});
