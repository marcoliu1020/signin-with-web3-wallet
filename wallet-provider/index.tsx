'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// evm
import { EthereumContextProvider } from "./ethereum";

const queryClient = new QueryClient()

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <EthereumContextProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </EthereumContextProvider>
  )
}
