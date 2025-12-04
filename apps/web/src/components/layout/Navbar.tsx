'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ConnectButton from '@/components/wallet/ConnectButton';
import ThemeToggle from '@/components/ui/ThemeToggle';

// Navbar component - Main navigation bar with cosmic black hole theme
export default function Navbar(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: '🏠 Home', href: '/' },
    { name: '🔭 Explorer', href: '/explorer' },
    { name: '💧 Faucet', href: '/faucet' },
    { name: '⚡ Validators', href: '/validators' },
    { name: '🛒 Marketplace', href: 'https://axionax.org:3003' },
    { name: '📚 Docs', href: '/docs' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-deep-space/80 backdrop-blur-xl border-b border-horizon-purple/20">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo with black hole effect */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-void shadow-horizon-sm group-hover:shadow-horizon transition-shadow duration-300">
                <div 
                  className="absolute inset-1 rounded-full border border-horizon-orange/50"
                  style={{ animation: 'spin 10s linear infinite' }}
                />
                <div 
                  className="absolute inset-2 rounded-full border border-horizon-purple/50"
                  style={{ animation: 'spin 7s linear infinite reverse' }}
                />
                <div className="absolute inset-3 rounded-full bg-void" />
              </div>
            </div>
            <span className="text-xl font-bold text-horizon">
              Axionax
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 rounded-lg text-starlight/70 hover:text-starlight hover:bg-horizon-purple/10 transition-all duration-200"
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={
                  item.href.startsWith('http')
                    ? 'noopener noreferrer'
                    : undefined
                }
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Connect Wallet Button & Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <ConnectButton />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-starlight hover:bg-horizon-purple/20 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-horizon-purple/20 animate-fade-in">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-starlight/70 hover:text-starlight hover:bg-horizon-purple/10 transition-colors px-4 py-3 rounded-lg"
                  onClick={() => setIsOpen(false)}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={
                    item.href.startsWith('http')
                      ? 'noopener noreferrer'
                      : undefined
                  }
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-4 pt-4 flex items-center gap-3 border-t border-horizon-purple/20">
                <ThemeToggle />
                <ConnectButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
