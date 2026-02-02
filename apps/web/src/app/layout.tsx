import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Web3Provider } from '@/contexts/Web3Context';
import { QueryProvider } from '@/providers/QueryProvider';

// Tech-focused fonts
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Axionax Protocol | Trusted World Computer',
  description:
    'Layer-1 blockchain for decentralized AI compute. Math-based trust, PoPC consensus, and the path to Project Monolith.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Axionax Protocol | Trusted World Computer',
    description:
      'Layer-1 blockchain for decentralized AI compute. Math-based trust, PoPC consensus.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans">
        <QueryProvider>
          <Web3Provider>{children}</Web3Provider>
        </QueryProvider>
      </body>
    </html>
  );
}
