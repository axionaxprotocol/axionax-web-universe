'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ConnectButton from '@/components/wallet/ConnectButton';
import VisitorCounter from '@/components/layout/VisitorCounter';
import { AXIONAX_NETWORK } from '@/lib/web3';

const mainNav = [
  { name: 'Home', href: '/' },
  { name: 'Pitch Deck', href: '/pitch' },
  { name: 'Workers', href: '/marketplace' },
  { name: 'Explorer', href: '/explorer' },
  { name: 'Faucet', href: '/faucet' },
  { name: 'Validators', href: '/validators' },
  { name: 'Wallet', href: '/wallet' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Join Network', href: '/join' },
  { name: 'Infrastructure', href: '/infrastructure' },
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
  const isLight = false; // Dark theme only

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
            chainId: AXIONAX_NETWORK.chainId,
            chainName: AXIONAX_NETWORK.chainName,
            nativeCurrency: AXIONAX_NETWORK.nativeCurrency,
            rpcUrls: AXIONAX_NETWORK.rpcUrls,
            blockExplorerUrls: AXIONAX_NETWORK.blockExplorerUrls,
          },
        ],
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isLight ? 'bg-[#F8FAFC] text-slate-900' : 'bg-[#0a0a0f] text-starlight'
      }`}
    >
      {/* Top bar – Clean & Minimal */}
      <header
        className={`sticky top-0 z-40 flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 border-b backdrop-blur-xl transition-all duration-300 ${
          isLight
            ? 'bg-white/80 border-slate-200 shadow-sm'
            : 'bg-black/40 border-white/[0.08] shadow-sm'
        }`}
      >
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <img
            src="/assets/img/axionax-logo-new.png"
            alt="Axionax"
            className="w-8 h-8 rounded-full object-cover border border-white/10"
          />
          <span className="font-semibold text-lg tracking-tight text-white group-hover:text-tech-cyan transition-colors duration-300">
            Axionax
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          <Link
            href="/docs"
            className={`text-sm font-medium transition-colors ${
              isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Docs
          </Link>
          <button
            type="button"
            onClick={addNetwork}
            className={`text-sm font-medium transition-colors ${
              isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Add Network
          </button>
          <div className="pl-4 border-l border-white/10">
            <ConnectButton />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`lg:hidden p-2 rounded-md transition-colors ${
            isLight
              ? 'text-slate-600 hover:bg-slate-100'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
          aria-label="Menu"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </header>

      {/* Horizontal nav */}
      <nav
        className={`sticky top-16 z-30 flex items-center gap-6 px-4 sm:px-6 lg:px-8 h-12 border-b backdrop-blur-md transition-all duration-300 overflow-x-auto ${
          isLight 
            ? 'bg-[#F8FAFC]/80 border-slate-200' 
            : 'bg-[#05050A]/80 border-white/[0.04]'
        }`}
      >
        {mainNav.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center h-full text-[13px] font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? isLight
                    ? 'text-blue-600'
                    : 'text-white'
                  : isLight
                    ? 'text-slate-500 hover:text-slate-900'
                    : 'text-white/50 hover:text-white/80'
              }`}
            >
              {item.name}
              {isActive && (
                <span
                  className={`absolute bottom-0 left-0 right-0 h-[1px] transition-all duration-300 ${
                    isLight ? 'bg-blue-600' : 'bg-white'
                  }`}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden
          />
          <div
            className={`fixed top-16 left-0 right-0 z-50 lg:hidden border-b border-tech-cyan/20 p-4 max-h-[70vh] overflow-y-auto shadow-2xl ${
              isLight ? 'bg-white' : 'bg-[#0d0b14]/95 backdrop-blur-xl'
            }`}
          >
            <div className="flex flex-col gap-1">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all ${
                    pathname === item.href
                      ? isLight
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-tech-cyan/10 text-tech-cyan border border-tech-cyan/20'
                      : isLight 
                        ? 'text-slate-600 hover:bg-slate-50' 
                        : 'text-starlight hover:bg-white/5 hover:text-tech-cyan'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-tech-cyan/20 mt-3 pt-3 flex flex-wrap gap-2">
                <Link
                  href="/docs"
                  className={`px-4 py-2 text-sm hover:text-tech-cyan ${
                    isLight
                      ? 'text-slate-700'
                      : 'text-starlight/80 hover:text-tech-cyan'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Docs
                </Link>
                <button
                  type="button"
                  onClick={addNetwork}
                  className={`px-4 py-2 text-sm hover:text-tech-cyan ${
                    isLight
                      ? 'text-slate-700'
                      : 'text-starlight/80 hover:text-tech-cyan'
                  }`}
                >
                  Add Network
                </button>
                <ConnectButton />
              </div>
            </div>
          </div>
        </>
      )}

      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      <VisitorCounter />
    </div>
  );
}
