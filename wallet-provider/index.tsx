'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ethereum
import { EthereumContextProvider } from "./ethereum";

// tron
import { TronContextProvider } from "./tron";

const queryClient = new QueryClient()

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <TronContextProvider>
      <EthereumContextProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </EthereumContextProvider>
    </TronContextProvider>
  )
}
