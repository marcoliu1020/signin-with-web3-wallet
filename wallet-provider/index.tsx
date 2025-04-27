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
    <TronContextProvider>
      <EthereumContextProvider>
        <SolanaContextProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </SolanaContextProvider>
      </EthereumContextProvider>
    </TronContextProvider>
  )
}
