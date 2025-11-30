const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 8545;
const CHAIN_ID = 86137; // 0x15079
const CHAIN_ID_HEX = '0x15079';

app.use(cors());
app.use(bodyParser.json());

// State
let blockNumber = 1000;
let lastBlockTime = Date.now();

// Auto-mine blocks every 3 seconds
setInterval(() => {
  blockNumber++;
  lastBlockTime = Date.now();
  console.log(`[MockRPC] Mined block #${blockNumber}`);
}, 3000);

// Helper to format hex
const toHex = (val) => '0x' + Number(val).toString(16);

// RPC Handler
app.post('/', (req, res) => {
  const { id, method, params, jsonrpc } = req.body;
  console.log(`[MockRPC] Request: ${method}`, params);

  let result;

  try {
    switch (method) {
      case 'web3_clientVersion':
        result = 'Axionax/v1.0.0/Mock';
        break;

      case 'net_version':
        result = String(CHAIN_ID);
        break;

      case 'eth_chainId':
        result = CHAIN_ID_HEX;
        break;

      case 'eth_blockNumber':
        result = toHex(blockNumber);
        break;

      case 'eth_gasPrice':
        result = '0x3b9aca00'; // 1 Gwei
        break;

      case 'eth_getBalance':
        // Return 100 AXX for any address
        result = '0x56bc75e2d63100000'; // 100 * 10^18
        break;

      case 'eth_getTransactionCount':
        result = '0x0';
        break;

      case 'eth_getCode':
        result = '0x';
        break;

      case 'eth_estimateGas':
        result = '0x5208'; // 21000
        break;

      case 'eth_getBlockByNumber':
        // Basic block structure
        const reqBlock = params[0] === 'latest' ? blockNumber : parseInt(params[0], 16);
        result = {
          number: toHex(reqBlock),
          hash: '0x' + '0'.repeat(60) + toHex(reqBlock), // Fake hash
          parentHash: '0x' + '0'.repeat(60) + toHex(reqBlock - 1),
          nonce: '0x0000000000000000',
          sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
          logsBloom: '0x00',
          transactionsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
          stateRoot: '0xd585568f54792c6d47454a8f94e1d3278996b79c3d4957e80d859424d5289196',
          miner: '0x0000000000000000000000000000000000000000',
          difficulty: '0x0',
          totalDifficulty: '0x0',
          extraData: '0x',
          size: '0x3e8',
          gasLimit: '0x1c9c380', // 30,000,000
          gasUsed: '0x0',
          timestamp: toHex(Math.floor(lastBlockTime / 1000)),
          transactions: [],
          uncles: []
        };
        break;

      case 'eth_call':
        // Mock success for any read call
        result = '0x0000000000000000000000000000000000000000000000000000000000000000';
        break;

      case 'eth_sendRawTransaction':
        // Fake tx hash
        result = '0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331' + Math.floor(Math.random() * 9);
        break;

      case 'eth_getTransactionReceipt':
        result = null; // Simulate pending or simply not found for now
        break;

      default:
        console.warn(`[MockRPC] Method not implemented: ${method}`);
        // Return dummy zero for unknown methods to prevent crashes
        result = '0x0';
    }

    res.json({
      jsonrpc: '2.0',
      id,
      result
    });

  } catch (error) {
    console.error(`[MockRPC] Error:`, error);
    res.status(500).json({
      jsonrpc: '2.0',
      id,
      error: {
        code: -32603,
        message: 'Internal error',
        data: error.message
      }
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[MockRPC] Server running on port ${PORT}`);
  console.log(`[MockRPC] Chain ID: ${CHAIN_ID} (${CHAIN_ID_HEX})`);
});
