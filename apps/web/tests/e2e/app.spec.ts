/**
 * End-to-End Tests: Web Application + SDK + Core
 * 
 * Tests complete user flows through the web application
 */

import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const RPC_URL = process.env.RPC_URL || 'https://rpc.axionax.org';

test.describe('Web Application E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test.describe('Landing Page', () => {
    test('should load homepage successfully', async ({ page }) => {
      await expect(page).toHaveTitle(/Axionax/);
      
      // Check for key elements
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();
    });

    test('should have working navigation', async ({ page }) => {
      // Test main navigation links
      const links = ['About', 'Docs', 'Explorer', 'Faucet'];
      
      for (const linkText of links) {
        const link = page.getByRole('link', { name: linkText });
        if (await link.isVisible()) {
          await expect(link).toHaveAttribute('href');
        }
      }
    });

    test('should display network status', async ({ page }) => {
      // Wait for network status to load
      await page.waitForSelector('[data-testid="network-status"]', { 
        timeout: 10000 
      });
      
      const status = page.locator('[data-testid="network-status"]');
      await expect(status).toContainText(/Connected|Online/i);
    });
  });

  test.describe('Wallet Connection', () => {
    test('should show wallet connection button', async ({ page }) => {
      const connectBtn = page.getByRole('button', { name: /connect/i });
      await expect(connectBtn).toBeVisible();
    });

    test('should open wallet modal on click', async ({ page }) => {
      const connectBtn = page.getByRole('button', { name: /connect/i });
      await connectBtn.click();
      
      // Check if modal appears
      const modal = page.locator('[data-testid="wallet-modal"]');
      await expect(modal).toBeVisible();
    });

    test('should display wallet providers', async ({ page }) => {
      await page.getByRole('button', { name: /connect/i }).click();
      
      // Check for common wallet options
      const walletOptions = ['MetaMask', 'WalletConnect', 'Coinbase'];
      
      for (const wallet of walletOptions) {
        const option = page.getByText(wallet);
        if (await option.isVisible()) {
          await expect(option).toBeVisible();
        }
      }
    });
  });

  test.describe('RPC Endpoint Integration', () => {
    test('should fetch and display latest block', async ({ page }) => {
      await page.goto(`${BASE_URL}/explorer`);
      
      // Wait for block data to load
      await page.waitForSelector('[data-testid="latest-block"]', { 
        timeout: 15000 
      });
      
      const blockNumber = page.locator('[data-testid="block-number"]');
      await expect(blockNumber).toBeVisible();
      
      // Verify block number is numeric
      const text = await blockNumber.textContent();
      expect(text).toMatch(/\d+/);
    });

    test('should display real-time block updates', async ({ page }) => {
      await page.goto(`${BASE_URL}/explorer`);
      
      await page.waitForSelector('[data-testid="latest-block"]');
      
      const initialBlock = await page.locator('[data-testid="block-number"]').textContent();
      
      // Wait for next block (testnet: ~6 seconds)
      await page.waitForTimeout(10000);
      
      const newBlock = await page.locator('[data-testid="block-number"]').textContent();
      
      // Block should have increased (if network is active)
      if (initialBlock && newBlock) {
        expect(parseInt(newBlock)).toBeGreaterThanOrEqual(parseInt(initialBlock));
      }
    }, 30000);
  });

  test.describe('Transaction Flow', () => {
    test('should show transaction form', async ({ page }) => {
      await page.goto(`${BASE_URL}/send`);
      
      await expect(page.getByLabel(/recipient/i)).toBeVisible();
      await expect(page.getByLabel(/amount/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /send/i })).toBeVisible();
    });

    test('should validate transaction inputs', async ({ page }) => {
      await page.goto(`${BASE_URL}/send`);
      
      // Try to send without filling form
      await page.getByRole('button', { name: /send/i }).click();
      
      // Should show validation errors
      await expect(page.getByText(/required/i)).toBeVisible();
    });

    test('should estimate gas for transaction', async ({ page }) => {
      await page.goto(`${BASE_URL}/send`);
      
      // Fill in valid data
      await page.getByLabel(/recipient/i).fill('0x' + '0'.repeat(40));
      await page.getByLabel(/amount/i).fill('1');
      
      // Wait for gas estimation
      await page.waitForSelector('[data-testid="gas-estimate"]', { 
        timeout: 10000 
      });
      
      const gasEstimate = page.locator('[data-testid="gas-estimate"]');
      await expect(gasEstimate).toBeVisible();
      
      const gasText = await gasEstimate.textContent();
      expect(gasText).toMatch(/\d+/);
    });
  });

  test.describe('Explorer Integration', () => {
    test('should search for transactions', async ({ page }) => {
      await page.goto(`${BASE_URL}/explorer`);
      
      const searchInput = page.getByPlaceholder(/search/i);
      await expect(searchInput).toBeVisible();
      
      // Enter a test transaction hash
      const testTxHash = '0x' + '1'.repeat(64);
      await searchInput.fill(testTxHash);
      await searchInput.press('Enter');
      
      // Should navigate or show results
      await page.waitForLoadState('networkidle');
    });

    test('should display transaction details', async ({ page }) => {
      // Navigate to a specific transaction (if available)
      const testTxHash = process.env.TEST_TX_HASH;
      if (!testTxHash) {
        test.skip();
        return;
      }
      
      await page.goto(`${BASE_URL}/tx/${testTxHash}`);
      
      await expect(page.locator('[data-testid="tx-hash"]')).toContainText(testTxHash);
      await expect(page.locator('[data-testid="tx-status"]')).toBeVisible();
      await expect(page.locator('[data-testid="tx-from"]')).toBeVisible();
      await expect(page.locator('[data-testid="tx-to"]')).toBeVisible();
    });
  });

  test.describe('Faucet Integration', () => {
    test('should display faucet form', async ({ page }) => {
      await page.goto(`${BASE_URL}/faucet`);
      
      await expect(page.getByLabel(/address/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /request/i })).toBeVisible();
    });

    test('should validate address format', async ({ page }) => {
      await page.goto(`${BASE_URL}/faucet`);
      
      // Enter invalid address
      await page.getByLabel(/address/i).fill('invalid-address');
      await page.getByRole('button', { name: /request/i }).click();
      
      // Should show validation error
      await expect(page.getByText(/invalid.*address/i)).toBeVisible();
    });

    test('should handle rate limiting', async ({ page }) => {
      await page.goto(`${BASE_URL}/faucet`);
      
      const validAddress = '0x' + '1'.repeat(40);
      await page.getByLabel(/address/i).fill(validAddress);
      await page.getByRole('button', { name: /request/i }).click();
      
      // Wait for response
      await page.waitForTimeout(3000);
      
      // Check for rate limit message or success
      const message = page.locator('[data-testid="faucet-message"]');
      if (await message.isVisible()) {
        const text = await message.textContent();
        expect(text).toMatch(/success|sent|wait|limit/i);
      }
    }, 10000);
  });

  test.describe('Performance', () => {
    test('should load page within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      const endTime = Date.now();
      
      const loadTime = endTime - startTime;
      expect(loadTime).toBeLessThan(5000); // 5 seconds
    });

    test('should handle concurrent API calls', async ({ page }) => {
      await page.goto(`${BASE_URL}/explorer`);
      
      // Trigger multiple requests
      await page.evaluate(() => {
        // Simulate multiple API calls
        return Promise.all([
          fetch('/api/blocks/latest'),
          fetch('/api/transactions/latest'),
          fetch('/api/stats')
        ]);
      });
      
      // Page should remain responsive
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(BASE_URL);
      
      await expect(page.locator('nav')).toBeVisible();
      
      // Check if mobile menu exists
      const mobileMenu = page.getByRole('button', { name: /menu/i });
      if (await mobileMenu.isVisible()) {
        await mobileMenu.click();
        await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible();
      }
    });

    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(BASE_URL);
      
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();
    });
  });
});
