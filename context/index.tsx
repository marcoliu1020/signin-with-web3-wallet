'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// wagmi
import { WagmiProvider } from 'wagmi';
import { config } from "./evm/config";

const queryClient = new QueryClient()

export function ContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
