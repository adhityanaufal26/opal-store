'use client';

import { SessionProvider } from 'next-auth/react';
import { TransactionProvider } from '@/lib/transaction-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TransactionProvider>
        {children}
      </TransactionProvider>
    </SessionProvider>
  );
}
