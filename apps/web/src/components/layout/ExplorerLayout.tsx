'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ConnectButton from '@/components/wallet/ConnectButton';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { AXIONAX_TESTNET } from '@/lib/web3';

const mainNav = [
  { name: 'Home', href: '/' },
  { name: 'Workers', href: '/marketplace' },
  { name: 'Explorer', href: '/explorer' },
  { name: 'Faucet', href: '/faucet' },
  { name: 'Validators', href: '/validators' },
  { name: 'Wallet', href: '/wallet' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Join Network', href: '/join' },
  { name: 'Airdrop', href: '/airdrop' },
  { name: 'Docs', href: '/docs' },
];

export default function ExplorerLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const addNetwork = async () => {
    if (typeof window === 'undefined') return;
    const win = window as Window & {
      ethereum?: {
        request: (args: {
          method: string;
          params?: unknown[];
        }) => Promise<unknown>;
      };
    };
    if (!win.ethereum) {
      window.open('https://metamask.io/download/', '_blank');
      return;
    }
    try {
      await win.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: AXIONAX_TESTNET.chainId,
            chainName: AXIONAX_TESTNET.chainName,
            nativeCurrency: AXIONAX_TESTNET.nativeCurrency,
            rpcUrls: AXIONAX_TESTNET.rpcUrls,
            blockExplorerUrls: AXIONAX_TESTNET.blockExplorerUrls,
          },
        ],
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-starlight flex flex-col">
      {/* Top bar – io.net style */}
      <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20 bg-[#0a0a0f]/95 backdrop-blur">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <img
            src="/assets/img/axionax-logo-new.png"
            alt="Axionax"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-bold text-lg bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
            Axionax
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          <Link
            href="/docs"
            className="text-sm text-starlight/70 hover:text-amber-400 transition-colors"
          >
            Docs
          </Link>
          <button
            type="button"
            onClick={addNetwork}
            className="text-sm text-starlight/70 hover:text-amber-400 transition-colors"
          >
            Add Network
          </button>
          <ThemeToggle />
          <ConnectButton />
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-starlight/70 hover:bg-amber-500/10 hover:text-amber-400"
          aria-label="Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </header>

      {/* Horizontal nav */}
      <nav className="sticky top-14 z-20 flex items-center gap-1 px-4 sm:px-6 lg:px-8 py-2 border-b border-amber-500/15 bg-[#0d0d12]/90 overflow-x-auto">
        {mainNav.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'text-starlight/60 hover:text-amber-300 hover:bg-amber-500/10'
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden
          />
          <div className="fixed top-14 left-0 right-0 z-50 lg:hidden bg-[#0d0d12] border-b border-amber-500/20 p-4 max-h-[70vh] overflow-y-auto">
            <div className="flex flex-col gap-1">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-starlight hover:bg-amber-500/10"
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-amber-500/20 mt-3 pt-3 flex flex-wrap gap-2">
                <Link
                  href="/docs"
                  className="px-4 py-2 text-sm text-starlight/80 hover:text-amber-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Docs
                </Link>
                <button
                  type="button"
                  onClick={addNetwork}
                  className="px-4 py-2 text-sm text-starlight/80 hover:text-amber-400"
                >
                  Add Network
                </button>
                <ThemeToggle />
                <ConnectButton />
              </div>
            </div>
          </div>
        </>
      )}

      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
