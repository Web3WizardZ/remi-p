// components/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PannaProvider } from 'panna-sdk';
import * as React from 'react';
import { SidebarProvider } from './ui/sidebar';

// Create queryClient OUTSIDE component to prevent recreation on every render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: false,
      staleTime: 30 * 1000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        if (error?.status >= 400 && error?.status < 500) return false;
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

export function Providers(props: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <PannaProvider
        clientId={process.env.NEXT_PUBLIC_CLIENT_ID || ''}
        partnerId={process.env.NEXT_PUBLIC_PARTNER_ID || ''}
      >
        <SidebarProvider>{props.children}</SidebarProvider>
      </PannaProvider>
    </QueryClientProvider>
  );
}

