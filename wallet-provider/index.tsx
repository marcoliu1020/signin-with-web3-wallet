'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ethereum
import { EthereumContextProvider } from "./ethereum";
// solana
import { SolanaContextProvider } from "./solana";
// tron
import { TronContextProvider } from "./tron";

const queryClient = new QueryClient()

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TronContextProvider>
        <EthereumContextProvider>
          <SolanaContextProvider>
            {children}
          </SolanaContextProvider>
        </EthereumContextProvider>
      </TronContextProvider>
    </QueryClientProvider>
  )
}
