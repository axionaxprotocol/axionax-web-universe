import type { Metadata } from 'next';
import './globals.css';
import { Web3Provider } from '@/contexts/Web3Context';
import { QueryProvider } from '@/providers/QueryProvider';

export const metadata: Metadata = {
  title: 'axionax Protocol',
  description: 'Layer-1 blockchain for decentralized compute',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <Web3Provider>{children}</Web3Provider>
        </QueryProvider>
      </body>
    </html>
  );
}
