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
  title: 'Axionax Protocol',
  description: 'Layer-1 blockchain for decentralized AI compute',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">
        <QueryProvider>
          <Web3Provider>{children}</Web3Provider>
        </QueryProvider>
      </body>
    </html>
  );
}
